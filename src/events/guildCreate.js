module.exports = async (client, guild) => {
  /* BLACKLIST */
  const blacklist = client.config.blacklist.guilds[guild.id];
  if (blacklist) {
    /* LOGGING */
    console.log(`[Alert] Blacklisted guild ${guild.name} (ID:${guild.id}) got invited!`);
    
    /* WE INFORM THE OWNER AND LEAVE */
    guild.owner.user.send(`⚠ The guild you are owner of (**${guild.name}**) is blacklisted and iBot is not allowed to come in.\n__Given reason :__ ${blacklist.reason} - __Time :__ ${blacklist.time}`);
    await guild.leave();
    return;
  }

  /* LOGGING */
  console.log(`[Servers] Join - ${guild.name} (ID:${guild.id}) - Check the guilds log for more informations.`);
  require('fs').appendFile('./logs/guilds.txt', `[${require('moment-timezone')().tz('UTC').format('DD/MM/YYYY HH:mm:ss')}] JOIN - ${guild.name} (ID:${guild.id}) - Owner: ${guild.owner.user.tag} (ID:${guild.ownerID}) - Members: ${guild.memberCount} (${guild.members.filter(m => m.user.bot).size} bots) - Creation: ${guild.createdAt.toUTCString()}\r\n`, console.error);

  /* GAME & DISCORD BOTS STATS */
  client.botUtil.updateGame(client);
  client.botUtil.updateStatsDiscordBotsOrg(client);

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
    ignored_channels: [],
    timezone: 'UTC',
    locale: 'en',
  };
  client.servers.set(guild.id, config);
};
