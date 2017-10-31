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

  router.use('/leaveGuild/:id', (req, res) => {
    if (req.isAuthenticated()) {
      if (req.session.user.id !== '205427654042583040') return res.header('Access-Control-Allow-Origin', '*').status(403).json({ message: 'UNAUTHORIZED' });

      const guild = client.guilds.get(req.body.guildID);
      if (!guild) return res.header('Access-Control-Allow-Origin', '*').status(404).json({ message: 'UNKNOWN_GUILD_ID' });
      guild.leave().then(() => {
        res.header('Access-Control-Allow-Origin', '*').status(200).json({ message: 'SUCCESS' });
      }).catch(e => res.header('Access-Control-Allow-Origin', '*').status(500).json({ message: `ERROR: ${e}` }));
    } else {
      res.header('Access-Control-Allow-Origin', '*').status(401).json({
        message: 'NOT_LOGGED_IN',
      });
    }
  });

  return router;
};
