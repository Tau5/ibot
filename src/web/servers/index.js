module.exports = (client) => {
  const express = require('express');
  const router = express.Router();

  router.use('/', (req, res) => res.status(200).render('servers', { mutualGuilds: client.guilds.filter(g => g.members.has(req.user.id)), identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') }));

  return router;
};
