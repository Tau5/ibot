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
      if (req.session.user.id !== '205427654042583040') return res.header('Access-Control-Allow-Origin', '*').status(403).json({ message: 'UNAUTHORIZED' });
      req.body = JSON.parse(decodeURIComponent(Object.keys(req.body)[0]));

      client.user.setPresence({
        status: req.body.status === '' ? null : req.body.status,
        activity: {
          type: 0,
          name: req.body.game === '' ? null : req.body.game,
        },
      }).then((newPresence) => {
        res.header('Access-Control-Allow-Origin', '*').status(200).json(newPresence);
      }).catch((e) => {
        res.header('Access-Control-Allow-Origin', '*').status(500).json({ error: e.message });
      });
    } else {
      res.header('Access-Control-Allow-Origin', '*').status(401).json({
        message: 'NOT_LOGGED_IN',
      });
    }
  });

  return router;
};
