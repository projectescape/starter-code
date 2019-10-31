const express = require("express");
const app = express();
const cookieSession = require("cookie-session");

const keys = require("./config/keys");

const passport = require("passport");
require("./services/passport");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// App.use are middlewares
// Add cookie support to express
app.use(
  cookieSession({
    // in millisecond
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);

// To use the port heroku has decided for app
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
