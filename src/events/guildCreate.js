module.exports = async (client, guild) => {
  /* LOGGING */
  console.log(`[Servers] Join - ${guild.name} (ID:${guild.id}) - Check the guilds log for more informations.`);
  require('fs').appendFile('./logs/guilds.txt', `[${require('moment-timezone')().tz('UTC').format('DD/MM/YYYY HH:mm:ss')}] JOIN - ${guild.name} (ID:${guild.id}) - Owner: ${guild.owner.user.tag} (ID:${guild.ownerID}) - Members: ${guild.memberCount} (${guild.members.filter(m => m.user.bot).size} bots) - Creation: ${guild.createdAt.toUTCString()}\r\n`, err => console.error(err));

  /* SERVER CONFIGURATION */
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
  client.servers.set(guild.id, config);
};
