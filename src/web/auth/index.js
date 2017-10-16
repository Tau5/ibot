const express = require('express');
const authSystem = require('./auth');
const { promisify } = require('util');
const request = promisify(require('request'));

const router = express.Router();

router
  .use('/login', async (req, res, next) => {
    if (!req.cookies.accessToken) return next();
    else {
      const profile = await request('https://discordapp.com/api/users/@me', { headers: { Authorization: `Bearer ${req.cookies.accessToken}` } });
      const guilds = await request('https://discordapp.com/api/users/@me/guilds', { headers: { Authorization: `Bearer ${req.cookies.accessToken}` } });

      const user = JSON.parse(profile.body);
      user.guilds = JSON.parse(guilds.body);

      req.login(user, (e) => e ? res.render('error', { code: '500', identity: 'NO' }) : undefined);
      req.session.save((e) => e ? res.render('error', { code: '500', identity: 'NO' }) : undefined);

      res.redirect('/');
    }
  }, authSystem.authenticate('discord'))
  .use('/callback', authSystem.authenticate('discord'), (req, res) => {
    res.cookie('accessToken', req.session.passport.user.accessToken);
    res.redirect('/');
  })
  .use('/logout', (req, res) => {
    res.clearCookie('accessToken');
    req.logout();
    res.redirect('/');
  });

module.exports = router;
