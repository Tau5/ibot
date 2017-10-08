module.exports = (client) => {
  const express = require('express');
  const router = express.Router();

  router.post('/eval', async (req, res) => {
    const code = req.body.code;
    try {
      let evaled = await eval(code);
      if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
      res.status(200).render('evaled', { status: 'OK', output: evaled, identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    } catch (e) {
      res.status(200).render('evaled', { status: 'NO', output: e, identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    }
  });

  router.post('/game', async (req, res) => {
    const game = req.body.game;
    await client.user.setGame(game);
    res.status(200).render('admin', { client, identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
  });

  router.use('/', (req, res) => res.status(200).render('admin', { client, identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') }));

  return router;
};

