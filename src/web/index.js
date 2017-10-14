module.exports = (client) => {
  /* DASHBOARD LOADER */
  /* WEB */
  /* iBot - Dashboard module */

  // Modules
  const express = require('express');
  const bodyParser = require('body-parser');
  const cookieParser = require('cookie-parser');
  const session = require('express-session');
  const logger = require('morgan');
  const authentication = require('../web/auth/auth');

  client.app = express();

  // External
  const auth = require('../web/auth');

  /* Auth checker */
  const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) next();
    else res.status(401).render('error', { code: '401', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
  };

  const checkOwner = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (['205427654042583040'].includes(req.user.id)) next();
      else res.status(503).render('error', { code: '403', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    } else {
      res.status(501).render('error', { code: '401', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    }
  };

  const updateSession = (req, res, next) => {
    const request = require('request');
    request('https://discordapp.com/api/users/@me', { headers: { Authorization: `Bearer ${req.cookies.accessToken}` } }, (err, http, body) => {
      const user = body;
      user.provider = 'discord';


      request('https://discordapp.com/api/users/@me/guilds', { headers: { Authorization: `Bearer ${req.cookies.accessToken}` } }, (err2, http2, body2) => {
        user.guilds = body2;
        req.session.passport = {
          user,
        };
        req.session.save(error => res.render('error', { code: '500', identity: 'NO' }));
        next();
      });
    });
  };

  // Middlewares
  client.app
    .enable('trust proxy')
    .use(express.static(`${__dirname}/../../public/`))
    .use(bodyParser.urlencoded({
      extended: false,
    }))
    .use(logger('common', {
      stream: require('fs').createWriteStream('./src/web/logs.txt'),
    }))
    .use(cookieParser())
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
    .use('/admin', checkOwner, updateSession, require('../web/admin')(client))
    .use('/servers', checkAuth, updateSession, require('../web/servers')(client))
    .use('/user', checkAuth, updateSession, require('../web/user')(client))
    .use('/server', checkAuth, updateSession, require('../web/server')(client))
    .use('/invite', checkAuth, updateSession, require('../web/invite')(client))
    .use('*', (req, res) => res.status(404).render('error', { code: '404', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') }));

  client.app.listen(client.config.port, () => console.log(`[Express] Listening on port ${client.config.port}`));
};
