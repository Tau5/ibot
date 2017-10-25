module.exports = async (client, member) => {
  const config = client.servers.get(member.guild.id);
  client.I18n.use(config.locale);

  if (config.switch_leaving === 1) {
    const channel = member.guild.channels.get(config.channel_welcome);
    if (!channel) return;
    const message = config.message_leaving
      .replace(/{usermention}/g, member.toString())
      .replace(/{usertag}/g, member.user.tag)
      .replace(/{guildname}/g, member.guild.name)
      .replace(/{guildcount}/g, member.guild.memberCount);
    channel.send(message);
  }

  if (config.switch_serverlog === 1) {
    client.modUtil.Serverlog(client, member.guild, client.I18n.translate`📤 **${member.user.tag}** (ID:${member.id}) left the server.\n__Account creation :__ ${member.user.createdAt.toUTCString()}\n__Roles :__ ${member.roles.sort((a, b) => b.position - a.position).map(r => `\`${r.name}\``).join(', ')}.`);
  }
};
