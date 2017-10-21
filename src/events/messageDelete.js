module.exports = async (client, message) => {
  if (message.author.id === client.user.id) return;
  if (!message.guild) return;
  const config = client.servers.get(message.guild.id);
  client.I18n.use(config.locale);

  if (!message.content || message.content.length >= 1024) return;
  const { MessageEmbed } = require('discord.js');
  const embed = new MessageEmbed()
    .addField(client.I18n.translate`Content`, message.content)
    .setColor('RED');

  client.modUtil.Serverlog(client, message.guild, client.I18n.translate`🔥 **${message.author.tag}**'s message has been deleted from ${message.channel.toString()} :`, { embed });
};
