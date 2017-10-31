module.exports = (client) => {
  const express = require('express');
  const router = express.Router();

  router.post('/updateConfig', (req, res) => {
    if (req.isAuthenticated()) {
      console.log(require('util').inspect(Object.keys(req.body)));
      const guild = client.guilds.get(req.body.guildID);
      if (!guild) return res.header('Access-Control-Allow-Origin', '*').status(404).json({ message: 'UNKNOWN_GUILD_ID' });

      if (!guild.members.get(req.session.user.id).hasPermission('MANAGE_GUILD') && req.session.user.id !== '305277118105911296') return res.header('Access-Control-Allow-Origin', '*').status(403).json({ message: 'UNAUTHORIZED' });

      const config = client.servers.get(req.body.guildID);
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
      return res.header('Access-Control-Allow-Origin', '*').status(200).json({
        message: 'SUCCESS',
        config: newConfig,
      });
    } else {
      res.header('Access-Control-Allow-Origin', '*').status(401).json({
        message: 'NOT_LOGGED_IN',
      });
    }
  });

  return router;
};
