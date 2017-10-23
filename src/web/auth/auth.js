const config = require('../../config.json');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((id, done) => done(null, id));

passport.use(new DiscordStrategy({
  clientID: config.dashboard.clientID,
  clientSecret: config.dashboard.clientSecret,
  scope: config.dashboard.scopes,
  callbackURL: config.dashboard.callbackURL,
}, (accessToken, refreshToken, profile, done) => {
  process.nextTick(() => done(null, profile));
}));

module.exports = passport;
