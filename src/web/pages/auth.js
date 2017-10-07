/* Auth */
const app = require('express').Router();

app.get('/login', (req, res) => {
  res.redirect('https://www.google.com');
});

module.exports = app;
