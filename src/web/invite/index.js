const express = require('express');

const router = express.Router();

router.use('/', (req, res) => res.redirect('https://discordapp.com/oauth2/authorize?client_id=305277118105911296&scope=bot'));

module.exports = router;
