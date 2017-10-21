module.exports = async (client, oldMember, newMember) => {
  const config = client.servers.get(oldMember.guild.id);
  client.I18n.use(config.locale);

  if (config.switch_serverlog === 0) return;

  if (oldMember.nickname !== newMember.nickname) {
    client.modUtil.Serverlog(client, oldMember.guild, client.I18n.translate`✏ **${oldMember.user.tag}**'s nickname changed from [${oldMember.nickname ? oldMember.nickname : 'None'}] to [${newMember.nickname ? newMember.nickname : 'None'}].`);
  }
};
