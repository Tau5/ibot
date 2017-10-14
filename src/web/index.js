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

  const checkOwner = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (['205427654042583040'].includes(req.user.id)) next();
      else res.status(503).render('error', { code: '403', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    } else {
      res.status(501).render('error', { code: '401', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    }
  };

  const updateSession = (req, res, next, isFromIndex = false) => {
    if (!req.cookies.accessToken) return next();
    const request = require('request');
    request('https://discordapp.com/api/users/@me', { headers: { Authorization: `Bearer ${req.cookies.accessToken}` } }, (err, http, body) => {
      if (err) {
        if (isFromIndex) return next(ee => (ee ? console.error(ee) : undefined));
        return res.redirect('/auth/login');
      }
      req.logout();
      const user = JSON.parse(body);
      user.provider = 'discord';


      request('https://discordapp.com/api/users/@me/guilds', { headers: { Authorization: `Bearer ${req.cookies.accessToken}` } }, (err2, http2, body2) => {
        if (err2) {
          if (isFromIndex) return next(n => (n ? console.error(n) : undefined));
          return res.redirect('/auth/login');
        }
        user.guilds = JSON.parse(body2);
        req.session.passport = {
          user,
        };
        req.login(user, error3 => (error3 ? console.error(error3) : undefined));
        req.session.save(error4 => (error4 ? console.error(error4) : undefined));
        return next();
      });
    });
  };

  const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) next();
    else {
      if (req.cookies.accessToken) updateSession(req, res, next);
      res.status(401).render('error', { code: '401', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    }
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
  client.app.get('/', (req, res, next) => updateSession(req, res, next, true), (req, res) => {
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
