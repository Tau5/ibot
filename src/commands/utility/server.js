exports.execute = async (client, ctx) => {
  let explicit;
  switch (ctx.guild.explicitContentFilter) {
    case 0:
      explicit = client.I18n.translate`None`;
      break;
    case 1:
      explicit = client.I18n.translate`Members without role`;
      break;
    case 2:
      explicit = client.I18n.translate`Everyone`;
      break;
    default:
      explicit = client.I18n.translate`Unknown`;
      break;
  }

  let verificationLevel;
  switch (ctx.guild.verificationLevel) {
    case 0:
      verificationLevel = client.I18n.translate`None`;
      break;
    case 1:
      verificationLevel = client.I18n.translate`Low`;
      break;
    case 2:
      verificationLevel = client.I18n.translate`Medium`;
      break;
    case 3:
      verificationLevel = '(╯°□°）╯︵ ┻━┻';
      break;
    case 4:
      verificationLevel = '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻';
      break;
    default:
      verificationLevel = client.I18n.translate`Unknown`;
      break;
  }

  const { MessageEmbed } = require('discord.js');
  const embed = new MessageEmbed()
    .addField('👤 ID', ctx.guild.id, true)
    .addField(client.I18n.translate`👤 Owner`, ctx.guild.owner.user.tag, true)
    .addField(client.I18n.translate`🏠 Region`, ctx.guild.region, true)
    .addField(client.I18n.translate`👥 Members`, `${ctx.guild.members.size} (${ctx.guild.members.filter(m => m.user.bot).size} bots)`, true)
    .addField(client.I18n.translate`🔒 Verification level`, verificationLevel, true)
    .addField(client.I18n.translate`🚔 Explicit content filter`, explicit, true)
    .addField(client.I18n.translate`📆 Guild creation date`, ctx.guild.createdAt.toUTCString(), true)
    .setColor(ctx.guild.me.displayHexColor)
    .setThumbnail(ctx.guild.iconURL({ format: 'png', size: 1024 }) || 'https://ibot.idroid.me/images/discord_server.png');

  ctx.channel.send(client.I18n.translate`🗺 Informations about **${ctx.guild.name}** :`, { embed });
};

exports.conf = {
  name: 'server',
  aliases: ['guild'],
  public: true,
};
