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
  const { promisify } = require('util');
  const request = promisify(require('request'));

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

  const updateSession = (req, res, next) => {
    if (!req.cookies.accessToken) return next();
    const profile = await request('https://discordapp.com/api/users/@me', { headers: { Authorization: `Bearer ${req.cookies.accessToken}` } }).catch(() => next());
    const guilds = await request('https://discordapp.com/api/users/@me/guilds', { headers: { Authorization: `Bearer ${req.cookies.accessToken}` } }).catch(() => next());

    const user = JSON.parse(profile.body);
    user.guilds = JSON.parse(guilds.body);

    req.login(user, () => res.render('error', { code: '500', identity: 'NO' }));
    req.session.save(() => res.render('error', { code: '500', identity: 'NO' }));

    res.redirect('/');
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
    .use(express.static(`${__dirname}/public/`))
    .use(bodyParser.urlencoded({
      extended: false,
    }))
    .use(logger('common', {
      stream: require('fs').createWriteStream('./src/web/logs.txt'),
    }))
    .use(cookieParser())
    .use(session({
      secret: client.config.dashboard.session_secret,
      resave: true,
      saveUninitialized: true,
      proxy: true,
    }))
    .use(authentication.initialize())
    .use(authentication.session())
    .set('view engine', 'ejs')
    .set('views', `${__dirname}/templates/`);

  // Page handling
  client.app.get('/', (req, res, next) => updateSession(req, res, next), (req, res) => {
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

  client.app.listen(client.config.dashboard.port, () => console.log(`[Express] Listening on port ${client.config.dashboard.port}`));
};
