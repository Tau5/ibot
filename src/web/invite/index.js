module.exports = (client) => {
  const express = require('express');

  const router = express.Router();

  router.use('/:id', (req, res) => {
    res.redirect(`https://discordapp.com/oauth2/authorize?&client_id=305277118105911296&scope=bot&guild_id=${req.params.id}&response_type=code&redirect_uri=http%3A%2F%2F78.202.166.128%2Fserver%2F`);
  });

  router.use('/', (req, res) => {
    const Discord = require('discord.js');
    const guilds = req.user.guilds.filter(g => !client.guilds.has(g.id) && (new Discord.Permissions(g.permissions).has('MANAGE_GUILD)')));
    res.status(200).render('invite', { guilds, identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
  });

  return router;
};

