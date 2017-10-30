module.exports = (client) => {
  const express = require('express');
  const router = express.Router();

  router.use('/:id', (req, res) => {
    client.users.fetch(req.params.id)
      .then((user) => {
        let lastactive = 'No information';
        if (client.lastactive.has(user.id)) {
          const time = client.lastactive.get(user.id);
          lastactive = require('time-ago')().ago(typeof time === 'string' ? parseInt(time) : time);
        }
        res.status(200).render('user', { user, lastactive, identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
      }).catch(() => {
        res.status(500).render('error', { code: '500', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
      });
  });

  router.use('/', (req, res) => res.redirect('/'));

  return router;
};
