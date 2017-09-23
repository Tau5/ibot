exports.execute = async (client, ctx) => {
  const config = client.servers.get(ctx.guild.id);
  if (ctx.args.length === 0) return ctx.channel.send(client.I18n.translate`❌ You must include a moderation case ID!`);
  if (isNaN(ctx.args[0])) return ctx.channel.send(client.I18n.translate`❌ The moderation case ID must be a number!`);
  ctx.args[0] = parseInt(ctx.args[0]);

  const mod = config.moderation[ctx.args[0] - 1];
  if (mod) {
    const author = await client.users.fetch(mod.AUTHOR);
    let user;
    if (mod.VICTIM !== undefined) user = await client.users.fetch(mod.VICTIM);
    if (mod.USER !== undefined) user = await client.users.fetch(mod.USER);
    const { MessageEmbed } = require('discord.js');
    const embed = new MessageEmbed()
      .addField(client.I18n.translate`Type`, mod.ACTION, true)
      .addField(client.I18n.translate`Author`, author.tag, true)
      .setColor(ctx.guild.me.displayHexColor)
      .setThumbnail(author.displayAvatarURL());
    if (mod.USER || mod.VICTIM) embed.addField(client.I18n.translate`User`, user.tag, true);
    if (mod.CHANNEL) embed.addField(client.I18n.translate`Channel`, `<#${mod.CHANNEL}>`, true);
    embed.addField(client.I18n.translate`Reason`, mod.REASON, true);
    embed.addField(client.I18n.translate`Time`, new Date(mod.TIME).toUTCString());
    ctx.channel.send(client.I18n.translate`🖊 Moderation case **n°${ctx.args[0]}** :`, { embed });
  } else {
    ctx.channel.send(client.I18n.translate`❌ No record found matching ID \`${ctx.args[0]}\`!`);
  }
};

exports.conf = {
  name: 'moderation',
  aliases: ['mod', 'modcase'],
  public: true,
  user_permission: 'KICK_MEMBERS',
};
