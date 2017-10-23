const botUtil = {
  updateGame(client) {
    client.user.setActivity(`Type ${client.config.discord.prefix}help ! On ${client.guilds.size} servers with ${client.users.size} users.`);
  },

  updateStatsDiscordBotsOrg(client) {
    const request = require('request');
    request.post(`https://discordbots.org/api/bots/${client.user.id}/stats`, {
      headers: {
        Authorization: client.config.api.discordbots_org,
      },
      form: {
        server_count: parseInt(client.guilds.size),
      },
    }, (err) => {
      if (err) console.error(err);
    });
  },
};

module.exports = botUtil;
