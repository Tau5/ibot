const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).render('tos', {
    identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO'),
  });
});

module.exports = router;
