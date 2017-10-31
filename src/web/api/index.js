module.exports = (client) => {
  const express = require('express');
  const router = express.Router();

  router.use('/bot', require('./bot')(client));
  router.use('/guild', require('./guild')(client));

  return router;
};
