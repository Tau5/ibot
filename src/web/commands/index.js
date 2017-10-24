module.exports = (client) => {
  const express = require('express');

  const router = express.Router();

  router.use('/', (req, res) => {
    res.status(200).render('commands', { client, identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
  });

  return router;
};
