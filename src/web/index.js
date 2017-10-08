module.exports = (client) => {
  /* DASHBOARD LOADER */
  /* WEB */
  /* iBot - Dashboard module */

  // Modules
  const express = require('express');
  const bodyParser = require('body-parser');
  const cookieParser = require('cookie-parser');
  const session = require('express-session');
  const authentication = require('../web/auth/auth');

  client.app = express();

  // External
  const auth = require('../web/auth');
  const invite = require('../web/invite');

  /* Auth checker */
  const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) next();
    else res.status(401).render('error', { code: '401', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
  };

  const checkOwner = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (['205427654042583040'].includes(req.user.id)) next();
      else res.status(503).render('error', { code: '503', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    } else {
      res.status(501).render('error', { code: '501', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    }
  };

  // Middlewares
  client.app
    .enable('trust proxy')
    .use(bodyParser.urlencoded({
      extended: false,
    }))
    .use(cookieParser(client.config.secret))
    .use(session({
      secret: client.config.secret,
      resave: true,
      saveUninitialized: true,
      proxy: true,
    }))
    .use(authentication.initialize())
    .use(authentication.session())
    .set('view engine', 'ejs');

  // Page handling
  client.app.get('/', (req, res) => {
    res.status(200).render('index', { client, identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
  });

  client.app
    .use('/auth', auth)
    .use('/admin', checkOwner, require('../web/admin')(client))
    .use('/servers', checkAuth, require('../web/servers')(client))
    .use('/user', checkAuth, require('../web/user')(client))
    .use('/invite', checkAuth, invite)
    .use('*', (req, res) => res.status(404).render('error', { code: '404', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') }));

  client.app.listen(client.config.port, () => console.log(`[Express] Listening on port ${client.config.port}`));
};