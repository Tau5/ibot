module.exports = (client) => {
  const express = require('express');
  const router = express.Router;

  router.use('/stats', (req, res) => {
    res.json(200, {
      uptime: client.readyAt.getTime(),
      guilds: client.guilds.size,
      users: client.users.size,
      channels: client.channels.size,
      languages: Object.keys(client.languages).length,
      cmdsran: client.stats.get('cmdsran'),
      ram: Math.round(process.memoryUsage().heapUsed / 1000000),
    });
  });

  return router;
};
