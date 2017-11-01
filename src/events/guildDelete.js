module.exports = async (client, guild) => {
  if (!Object.keys(client.config.blacklist.guilds).includes(guild.id)) {
    /* LOGGING */
    console.log(`[Servers] Leave - ${guild.name} (ID:${guild.id}) - Check the guilds log for more informations.`);
    require('fs').appendFile('./logs/guilds.txt', `[${require('moment-timezone')().tz('UTC').format('DD/MM/YYYY HH:mm:ss')}] LEAVE - ${guild.name} (ID:${guild.id}) - Owner: ${guild.owner.user.tag} (ID:${guild.ownerID}) - Members: ${guild.memberCount} (${guild.members.filter(m => m.user.bot).size} bots) - Creation: ${guild.createdAt.toUTCString()}\r\n`, console.error);

    /* GAME & DISCORD BOTS STATS */
    client.botUtil.updateGame(client);
    client.botUtil.updateStatsDiscordBotsOrg(client);

    /* SERVER CONFIGURATION */
    client.servers.delete(guild.id);
  }
};
