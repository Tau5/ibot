module.exports = (client) => {
  const express = require('express');
  const router = express.Router();

  router.post('/eval', async (req, res) => {
    const { code } = req.body;
    try {
      let evaled = await eval(code);
      if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
      res.status(200).render('evaled', { status: 'OK', output: evaled, identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    } catch (e) {
      res.status(200).render('evaled', { status: 'NO', output: e, identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    }
  });

  router.post('/presence', async (req, res) => {
    const presence = {
      activity: {
        type: 0,
        name: req.body.game,
      },
      status: req.body.status,
    };

    await client.user.setPresence(presence).catch(() => res.render(500).send('error', { identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') }));
    res.redirect('/');
  });

  router.use('/leave/:id', async (req, res) => {
    const guild = client.guilds.get(req.params.id);
    await guild.leave();
    res.redirect('/');
  });

  router.use('/', (req, res) => res.status(200).render('admin', {
    client, identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO'), game: client.user.presence.activity.name, status: client.user.presence.status,
  }));

  return router;
};

