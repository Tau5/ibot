const express = require('express');
const authSystem = require('./auth');

const router = express.Router();

router
  .use('/login', (req, res, next) => {
    if (req.cookies.user) {
      let cookies = req.cookies.user;
      cookies = String(cookies).replace('j%3A', '');
      cookies = decodeURIComponent(req.cookies.user);
      req.login(cookies, (err) => {
        if (err) return;
        return res.redirect('/');
      });
    }
    next();
  }, authSystem.authenticate('discord'))
  .use('/callback', authSystem.authenticate('discord'), (req, res) => {
    res.cookie('user', req.user);
    res.redirect('/');
  })
  .use('/logout', (req, res) => {
    res.clearCookie('user');
    req.logout();
    res.redirect('/');
  });

module.exports = router;
