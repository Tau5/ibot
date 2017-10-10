module.exports = (client, guild, config) => {
  const express = require('express');
  const router = express.Router();

  router.use('/:id', (req, res) => {
    const guildMember = guild.members.get(req.params.id);
    if (!guildMember) return res.status(404).render('error', { code: '404', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    res.status(200).render('member', {
      guild, config, guildMember, user: req.user, identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO'),
    });
  });

  router.post('/', (req, res) => {
    /* MEMBERS FINDER */
    let member;
    const search = req.body.query;
    if (search) member = client.findersUtil.findMember(guild, search);
    else return res.status(500).render('error', { code: '500', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });

    res.status(200).render('memberList', {
      guild, config, member, user: req.user, identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO'),
    });
  });

  return router;
};
