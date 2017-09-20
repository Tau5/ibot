module.exports = async (client, oldMessage, newMessage) => { // eslint-disable-line consistent-return max-len
  if (oldMessage.author.id === client.user.id) return 1;
  if (!oldMessage.guild) return 1;
  const config = client.servers.get(oldMessage.guild.id);
  client.I18n.use(config.locale);

  if (!oldMessage.content || !newMessage.content) return 1;
  const { MessageEmbed } = require('discord.js');
  const embed = new MessageEmbed()
    .addField(client.I18n.translate`Old content`, oldMessage.content)
    .addField(client.I18n.translate`New content`, newMessage.content)
    .setColor('RED');

  client.modUtil.Serverlog(client, oldMessage.guild, client.I18n.translate`✍ **${oldMessage.author.tag}** edited their message from ${oldMessage.channel.toString()} :`, embed);
};
