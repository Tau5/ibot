module.exports = async (client, member) => { // eslint-disable-line consistent-return
  const config = client.servers.get(member.guild.id);
  client.I18n.use(config.locale);

  if (config.switch_serverlog === 1) {
    client.modUtil.Serverlog(member.guild, client.I18n.translate`📤 **${member.user.tag}** (ID:${member.id}) left the server.\n__Account creation :__ ${member.user.createdAt.toUTCString()}\n__Roles :__ ${member.roles.sort((a, b) => b.position - a.position).map(r => `\`${r.name}\``).join(', ')}.`);
  }
};
