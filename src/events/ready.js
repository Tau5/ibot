module.exports = async (client) => {
  /* LOGGING */
  console.log(`[Bot] Logged in as ${client.user.username}! On ${client.guilds.size} servers and ${client.users.size} users.`);

  /* GAME */
  client.botUtil.updateGame(client);

  /* IF SERVERS GOT INVITED */
  client.guilds.filter(g => !client.servers.has(g.id)).forEach((g) => {
    const config = {
      channel_welcome: 'NOT_SET',
      channel_serverlog: 'NOT_SET',
      channel_modlog: 'NOT_SET',
      message_welcome: 'NOT_SET',
      switch_welcome: 0,
      switch_serverlog: 0,
      switch_modlog: 0,
      switch_clearbackup: 0,
      roleme: [],
      custom_prefixes: [],
      moderation: [],
      imported_tags: [],
      timezone: 'UTC',
      locale: 'en',
    };
    client.servers.set(g.id, config);
    console.log(`[Servers] Created (lately) the configuration file for ${g.name} (ID:${g.id})`);
  });

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
    .use('/invite', checkAuth, invite)
    .use('*', (req, res) => res.status(404).render('error', { code: '404', identity: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : 'NO') }));

  client.app.listen(client.config.port, () => console.log(`[Express] Listening on port ${client.config.port}`));
};
