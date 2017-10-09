const express = require('express');
const authSystem = require('./auth');

const router = express.Router();

router
  .use('/login', (req, res, next) => {
    if (req.cookies.user) {
      req.user = JSON.parse(req.cookies.user);
      req.login('user', (err) => {
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
