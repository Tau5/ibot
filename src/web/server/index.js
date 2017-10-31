module.exports = (client) => {
  const express = require('express');
  const router = express.Router();
  const timezones = require('moment-timezone').tz.names();

  router.use('/:id', (req, res) => {
    if (!client.guilds.has(req.params.id)) return res.status(404).render('error', { code: '404', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    const guild = client.guilds.get(req.params.id);
    const config = client.servers.get(req.params.id);

    res.status(200).render('server', {
      timezones, guild, config, user: req.user, identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO'),
    });
  });

  router.use('/', (req, res) => {
    if (req.query.guild_id) {
      res.redirect(`/server/${req.query.guild_id}`);
    } else {
      res.redirect('/');
    }
  });

  return router;
};
