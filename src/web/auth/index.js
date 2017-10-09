const express = require('express');
const authSystem = require('./auth');

const router = express.Router();

router
  .use('/login', (req, res) => {
    if (req.cookies.user) {
      req.user = req.cookies.user;
      res.redirect('/');
    }
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
