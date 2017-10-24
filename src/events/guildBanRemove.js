module.exports = async (client, guild, user) => {
  const config = client.servers.get(guild.id);
  client.I18n.use(config.locale);

  if (config.switch_serverlog === 1) {
    client.modUtil.Serverlog(client, guild, client.I18n.translate`⚙ **${user.tag}** (ID:${user.id}) was unbanned from the server.`);
  }
};
