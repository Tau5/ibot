exports.execute = async (client, ctx) => {
  const { MessageEmbed } = require('discord.js');
  const embed = new MessageEmbed()
    .addField(client.I18n.translate`Owner`, 'iDroid#4441')
    .addField(client.I18n.translate`Servers`, ctx.client.guilds.size)
    .addField(client.I18n.translate`RAM Usage`, `${Math.round(process.memoryUsage().rss / 100000)}MB`)
    .addField(client.I18n.translate`Support server`, 'https://discord.gg/invite')
    .setColor(ctx.guild.me.displayHexColor)
    .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 1024 }));

  ctx.channel.send(client.I18n.translate`👤 Informations about **${client.user.username}** :`, { embed });
};

exports.conf = {
  name: 'about',
  aliases: [],
  public: true,
};
