const config = require('../../config.json');
const Enmap = require('enmap');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const RememberMeStrategy = require('passport-remember-me').Strategy;
const utils = require('util');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((id, done) => {
  done(null, id);
});

passport.use(new DiscordStrategy({
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  scope: config.scopes,
  callbackURL: config.callbackURL,
}, (accessToken, refreshToken, profile, done) => {
  if (accessToken === null) return;
  done(null, profile);
}));

passport.use(new RememberMeStrategy(
  (token, done) => {
    token.consume(token, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false);
      return done(null, user);
    });
  },
  (user, done) => {
    const token = config.secret;
    token.save(token, { user }, (err) => {
      if (err) return done(err);
      return done(null, token);
    });
  },
));

module.exports = passport;
