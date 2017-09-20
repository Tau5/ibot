module.exports = async (client, message) => { // eslint-disable-line consistent-return
  if (!message.guild) return 1;
  const config = client.servers.get(message.guild.id);
  client.I18n.use(config.locale);

  if (!message.content) return 1;
  const { MessageEmbed } = require('discord.js');
  const embed = new MessageEmbed()
    .addField(client.I18n.translate`Content`, message.content)
    .setColor('RED');

  client.modUtil.Serverlog(message.guild, client.I18n.translate`🔥 **${message.author.tag}**'s message has been deleted from ${message.channel.toString()} :`, { embed });
};
