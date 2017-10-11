module.exports = (client) => {
  const express = require('express');
  const router = express.Router();

  router.use('/:id', (req, res) => {
    if (!client.guilds.has(req.params.id)) return res.status(404).render('error', { code: '404', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    const guild = client.guilds.get(req.params.id);
    const config = client.servers.get(req.params.id);

    res.status(200).render('server', {
      guild, config, user: req.user, identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO'),
    });
  });

  router.post('/update/:id', (req, res) => {
    if (!client.guilds.has(req.params.id)) return res.status(404).render('error', { code: '404', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    const guild = client.guilds.get(req.params.id);
    const config = client.servers.get(req.params.id);

    config.switch_welcome = parseInt(req.body.switch_welcome);
    config.switch_serverlog = parseInt(req.body.switch_serverlog);
    config.switch_modlog = parseInt(req.body.switch_modlog);
    config.switch_clearbackup = parseInt(req.body.switch_clearbackup);

    client.servers.set(req.params.id, config);
    res.redirect(`/server/${req.params.id}`);
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
