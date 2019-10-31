const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");

let { User } = require("./bookshelf");

// user being passed in the one that is returned in done in passport.use
passport.serializeUser((user, done) => {
  // id assigned my mongo, so that gogle,fb auth can be done in one record
  done(null, user.email);
  // will be set as cookie
});

// convert serialized id to mongoose model
passport.deserializeUser(async (email, done) => {
  let user = await User.where("email", email).fetch();
  done(null, user.attributes);
});

passport.use(
  // google auth initialize
  new GoogleStrategy(
    {
      ...keys.google,
      // relative path causes http,as heroku servers go through proxy
      // proxy cant be trusted usually, but in this case its alright
      // callbackURL: '/auth/google/callback'
      callbackURL: "/auth/google/callback",
      // https remain if proxy
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.where(
        "email",
        profile.emails[0].value
      ).fetch();

      if (existingUser) {
        // null means everything well alright

        return done(null, existingUser.attributes);
        // return daal diya to waise else ki zaroorat nahi hai
      } else {
        let user = await User.forge({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value
        }).save();
        done(null, user.attributes);
      }
    }
  )
);
