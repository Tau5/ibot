module.exports = async (client, member) => {
  const config = client.servers.get(member.guild.id);
  client.I18n.use(config.locale);

  if (config.switch_welcome === 1) {
    const channel = member.guild.channels.get(config.channel_welcome);
    if (!channel) return 1;
    const message = config.message_welcome
      .replace(/{usermention}/g, member.toString())
      .replace(/{usertag}/g, member.user.tag)
      .replace(/{guildname}/g, member.guild.name)
      .replace(/{guildcount}/g, member.guild.memberCount);
    channel.send(message);
  }

  if (config.switch_serverlog === 1) {
    client.modUtil.Serverlog(client, member.guild, client.I18n.translate`📥 **${member.user.tag}** (ID:${member.id}) joined the server.\n__Account creation :__ ${member.user.createdAt.toUTCString()}`);
  }
};
