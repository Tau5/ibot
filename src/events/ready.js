module.exports = async (client) => {
  /* LOGGING */
  console.log(`[Bot] Logged in as ${client.user.username}! On ${client.guilds.size} servers and ${client.users.size} users.`);

  /* GAME */
  client.botUtil.updateGame(client);

  /* WE LOAD THE DASHBOARD */
  if (!client.app) require('../web/index')(client);

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
};
