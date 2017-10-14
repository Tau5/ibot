const config = require('../../config.json');
const Enmap = require('enmap');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const utils = require('util');

const users = new Enmap({ name: 'users', persistent: true });

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
  const user = {
    accessToken,
    refreshToken,
    profile,
  };
  users.set(profile.id, user);
  done(null, profile);
}));

module.exports = passport;
