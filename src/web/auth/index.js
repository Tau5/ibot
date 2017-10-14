const express = require('express');
const authSystem = require('./auth');

const router = express.Router();

router
  .use('/login', (req, res, next) => {
    if (req.cookies.accessToken) {
      const request = require('request');
      request('https://discordapp.com/api/users/@me', { headers: { Authorization: `Bearer ${req.cookies.accessToken}` } }, (err, http, body) => {
        const user = body;
        user.provider = 'discord';


        request('https://discordapp.com/api/users/@me/guilds', { headers: { Authorization: `Bearer ${req.cookies.accessToken}` } }, (err, http, body) => {
          user.guilds = body;
          req.session.passport = {
            user,
          };

          req.login(user, (error) => {
            if (error) res.render('error', { code: '500', identity: 'NO' });
          });

          req.session.save(error2 => res.render('error', { code: '500', identity: 'NO' }));

          console.log('========REQ.SESSION==========\n' + req.session);
          console.log('========REQ.USER==========\n' + req.user);

          res.redirect('/');
        });
      });
    } else { next(); }
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
