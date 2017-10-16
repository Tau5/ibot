const express = require('express');
const authSystem = require('./auth');
const { promisify } = require('util');
const request = promisify(require('request'));

const router = express.Router();

router
  .use('/login', async (req, res, next) => {
    if (!req.cookies.accessToken) next();
    const profile = await request('https://discordapp.com/api/users/@me', { headers: { Authorization: `Bearer ${req.cookies.accessToken}` } }).catch(() => next());
    const guilds = await request('https://discordapp.com/api/users/@me/guilds', { headers: { Authorization: `Bearer ${req.cookies.accessToken}` } }).catch(() => next());

    const user = JSON.parse(profile);
    user.guilds = JSON.parse(guilds);

    req.login(user, () => {
      if (error) return res.render('error', { code: '500', identity: 'NO' });
    });

    req.session.save(() => {
      res.render('error', { code: '500', identity: 'NO' });
    });

    res.redirect('/');
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
