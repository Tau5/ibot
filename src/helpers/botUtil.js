const botUtil = {
  updateGame(client) {
    client.user.setActivity(`Type ${client.config.prefix}help ! On ${client.guilds.size} servers with ${client.users.size} users.`);
  },
};

module.exports = botUtil;
