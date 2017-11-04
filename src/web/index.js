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
  const https = require('https');
  const { readFileSync } = require('fs');

  const app = express();

  // External
  const auth = require('../web/auth');

  /* Auth checker */

  const checkOwner = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (client.config.discord.ownerID === req.user.id) next();
      else res.status(403).render('error', { code: '403', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    } else {
      res.status(401).render('error', { code: '401', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    }
  };

  const updateSession = async (req, res, next) => {
    if (!req.signedCookies.accessToken) next();
    else {
      const profile = await request('https://discordapp.com/api/users/@me', { headers: { Authorization: `Bearer ${req.signedCookies.accessToken}` } }).catch(() => next());
      const guilds = await request('https://discordapp.com/api/users/@me/guilds', { headers: { Authorization: `Bearer ${req.signedCookies.accessToken}` } }).catch(() => next());

      const user = JSON.parse(profile.body);
      user.guilds = JSON.parse(guilds.body);

      req.login(user, e => (e ? res.render('error', { code: '500', identity: 'NO' }) : undefined));
      req.session.save(e => (e ? res.render('error', { code: '500', identity: 'NO' }) : undefined));

      next();
    }
  };

  const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) next();
    else if (req.signedCookies.accessToken) {
      updateSession(req, res, next);
    } else {
      res.redirect(`/auth/login?redirectURI=${req.originalUrl}`);
    }
  };

  // Middlewares
  app
    .enable('trust proxy')
    .use(express.static(`${__dirname}/public/`))
    .use(bodyParser.urlencoded({
      extended: false,
    }))
    .use(logger('common', {
      stream: require('fs').createWriteStream('./src/web/logs.txt'),
    }))
    .use(cookieParser(client.config.dashboard.session_secret))
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
  app.get('/', (req, res) => {
    res.status(200).render('index', {
      identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO'),
    });
  });

  app
    .use('/auth', auth)
    .use('/api', require('./api')(client))
    .use('/admin', checkOwner, updateSession, require('./admin')(client))
    .use('/servers', checkAuth, updateSession, require('./servers')(client))
    .use('/user', checkAuth, updateSession, require('./user')(client))
    .use('/server', checkAuth, updateSession, require('./server')(client))
    .use('/invite', checkAuth, updateSession, require('./invite')(client))
    .use('/tos', require('./tos'))
    .use('*', (req, res) => res.status(404).render('error', { code: '404', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') }));

  client.app = https.createServer({
    key: readFileSync('/home/idroid/dashboard_certs/dashboard.pem'),
    cert: readFileSync('/home/idroid/dashboard_certs/dashboard.crt'),
  }, app).listen(client.config.dashboard.port, (err) => {
    if (err) console.error(err);
    else console.log(`[Express] Listening on ${client.config.dashboard.port}`);
  });
};
