const express = require('express');
const authSystem = require('./auth');

const router = express.Router();

router
  .use('/login', authSystem.authenticate('discord'))
  .use('/callback', authSystem.authenticate('discord'), (req, res) => {
    res.redirect('/');
  })
  .use('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

module.exports = router;
