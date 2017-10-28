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
      if (client.config.discord.ownerID === req.user.id) next();
      else res.status(503).render('error', { code: '403', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    } else {
      res.status(501).render('error', { code: '401', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
    }
  };

  const updateSession = async (req, res, next) => {
    if (!req.signedCookies.accessToken) return next();
    const profile = await request('https://discordapp.com/api/users/@me', { headers: { Authorization: `Bearer ${req.signedCookies.accessToken}` } }).catch(() => next());
    const guilds = await request('https://discordapp.com/api/users/@me/guilds', { headers: { Authorization: `Bearer ${req.signedCookies.accessToken}` } }).catch(() => next());

    const user = JSON.parse(profile.body);
    user.guilds = JSON.parse(guilds.body);

    req.login(user, e => (e ? res.render('error', { code: '500', identity: 'NO' }) : undefined));
    req.session.save(e => (e ? res.render('error', { code: '500', identity: 'NO' }) : undefined));

    return next();
  };

  const returnNoWWW = (req, res, next) => {
    const host = req.get('host');
    if (host.startsWith('www.')) {
      res.redirect(`http://ibot.idroid.me:9024${req.originalUrl}`);
    } else {
      next();
    }
  };

  const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) next();
    else {
      if (req.signedCookies.accessToken) updateSession(req, res, next);
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
  client.app.get('/', returnNoWWW, updateSession, (req, res) => {
    res.status(200).render('index', { client, identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') });
  });

  client.app
    .use('/auth', returnNoWWW, auth)
    .use('/api', returnNoWWW, require('../web/api')(client))
    .use('/admin', returnNoWWW, checkOwner, updateSession, require('../web/admin')(client))
    .use('/servers', returnNoWWW, checkAuth, updateSession, require('../web/servers')(client))
    .use('/user', returnNoWWW, checkAuth, updateSession, require('../web/user')(client))
    .use('/server', returnNoWWW, checkAuth, updateSession, require('../web/server')(client))
    .use('/invite', returnNoWWW, checkAuth, updateSession, require('../web/invite')(client))
    .use('*', (req, res) => res.status(404).render('error', { code: '404', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') }));

  client.app.listen(client.config.dashboard.port, () => console.log(`[Express] Listening on port ${client.config.dashboard.port}`));
};
