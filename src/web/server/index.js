module.exports = (client) => {
  const express = require('express');
  const router = express.Router();
  const timezones = require('moment-timezone').tz.names();

  router.post('/update/:id', (req, res) => {
    if (!client.guilds.has(req.params.id)) return res.status(404).render('error', { code: '404', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    const config = client.servers.get(req.params.id);
    const newConfig = {
      channel_welcome: req.body.channel_welcome,
      channel_serverlog: req.body.channel_serverlog,
      channel_modlog: req.body.channel_modlog,
      message_welcome: req.body.message_welcome,
      message_leaving: req.body.message_leaving,
      switch_welcome: ((req.body.channel_welcome !== 'NOT_SET' && req.body.message_welcome !== 'NOT_SET') ? parseInt(req.body.switch_welcome) : 0),
      switch_leaving: ((req.body.channel_welcome !== 'NOT_SET' && req.body.message_leaving !== 'NOT_SET') ? parseInt(req.body.switch_leaving) : 0),
      switch_serverlog: (req.body.channel_serverlog !== 'NOT_SET' ? parseInt(req.body.switch_serverlog) : 0),
      switch_modlog: (req.body.channel_modlog !== 'NOT_SET' ? parseInt(req.body.switch_modlog) : 0),
      switch_clearbackup: parseInt(req.body.switch_clearbackup),
      roleme: config.roleme,
      custom_prefixes: config.custom_prefixes,
      moderation: config.moderation,
      imported_tags: config.imported_tags,
      ignored_channels: config.ignored_channels,
      timezone: req.body.timezone,
      locale: req.body.locale,
    };

    client.servers.set(req.params.id, newConfig);
    res.redirect(`/server/${req.params.id}`);
  });

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
