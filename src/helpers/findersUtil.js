const findersUtil = {
  findMember(guild, query) {
    const search = query.toLowerCase();
    return guild.members.filter(m => m.displayName.toLowerCase().includes(search)
     || m.user.tag.toLowerCase().includes(search)
     || m.id === search);
  },

  formatMembers(client, list) {
    let message = client.I18n.translate`⚠ Found **${list.size}** members :\n${list.first(5).map(m => `- **${m.user.tag}** (ID:${m.id})`).join('\n')}\n`;
    if (list.size > 5) message += client.I18n.translate`And ${(list.size - 5)} more...`;
    return message;
  },

  findTextChannels(guild, query) {
    const search = query.toLowerCase();
    return guild.channels.filter(c => c.type === 'text').filter(c => c.name.toLowerCase().includes(search) || c.id === search);
  },

  findVoiceChannels(guild, query) {
    const search = query.toLowerCase();
    return guild.channels.filter(c => c.type === 'voice').filter(c => c.name.toLowerCase().includes(search) || c.id === search);
  },

  findRoles(guild, query) {
    const search = query.toLowerCase();
    return guild.roles.filter(r => r.name.toLowerCase().includes(search) || r.id === search);
  },

  findUsers(client, guild, query) {
    const search = query.toLowerCase();
    return client.users.filter(u => u.tag.toLowerCase().includes(search) || u.id === search);
  },

  formatUsers(client, list) {
    let message = client.I18n.translate`⚠ Found **${list.size}** users :\n${list.first(5).map(u => `- **${u.user.tag}** (ID:${u.user.id})`).join('\n')}\n`;
    if (list.size > 5) message += client.I18n.translate`And ${(list.size - 5)} more...`;
    return message;
  },
};

module.exports = findersUtil;
