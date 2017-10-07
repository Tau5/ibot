module.exports = {
  init(port, client) {
    /* **************** */
    /* iBot - Dashboard */
    /*   October 2017   */
    /* **************** */

    /* MODULES */
    const app = require('express')();

    app.set('view engine', 'ejs');

    /* INDEX */
    const servercount = client.guilds.size;
    const usercount = client.users.size;
    const langcount = Object.keys(client.languages).length;
    const cmdrancount = client.commandsran;

    app
      .get('/', (req, res) => {
        res.render('index', {
          servercount, usercount, langcount, cmdrancount,
        });
      })
      .use('/auth', require('./pages/auth.js'));

    app.listen(port, () => {
      console.log(`Connected under port ${port}`);
    });
  },
};
