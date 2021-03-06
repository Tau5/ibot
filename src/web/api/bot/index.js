module.exports = (client) => {
  const express = require('express');
  const router = express.Router();

  router.use('/stats', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*').status(200).json({
      uptime: Date.now() - client.readyAt.getTime(),
      guilds: client.guilds.size,
      users: client.users.size,
      channels: client.channels.size,
      languages: Object.keys(client.languages).length,
      cmdsran: parseInt(client.stats.get('cmdsran')),
      ram: Math.floor(process.memoryUsage().heapUsed / 1000000),
    });
  });

  router.post('/changePresence', (req, res) => {
    if (req.isAuthenticated()) {
      if (req.user.id !== '205427654042583040') return res.header('Access-Control-Allow-Origin', '*').status(403).json({ message: 'UNAUTHORIZED' });
      req.body = JSON.parse(decodeURIComponent(Object.keys(req.body)[0]));

      client.user.setPresence({
        status: req.body.status === '' ? 'online' : req.body.status,
        activity: {
          type: 0,
          name: req.body.game === '' ? `Type ${client.config.discord.prefix}help ! On ${client.guilds.size} servers with ${client.users.size} users.` : req.body.game,
        },
      }).then((newPresence) => {
        res.header('Access-Control-Allow-Origin', '*').status(200).json(newPresence);
      }).catch((e) => {
        res.header('Access-Control-Allow-Origin', '*').status(400).json({ message: e.message });
      });
    } else {
      res.header('Access-Control-Allow-Origin', '*').status(401).json({
        message: 'NOT_LOGGED_IN',
      });
    }
  });

  return router;
};
