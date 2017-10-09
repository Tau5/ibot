exports.execute = async (client, ctx) => {
  const config = client.servers.get(ctx.guild.id);
  if (ctx.args.length === 0) return ctx.channel.send(client.I18n.translate`❌ You must include a moderation case ID!`);
  if (isNaN(ctx.args[0])) return ctx.channel.send(client.I18n.translate`❌ The moderation case ID must be a number!`);
  ctx.args[0] = parseInt(ctx.args[0]);

  const mod = config.moderation[ctx.args[0] - 1];
  if (mod) {
    const oldReason = mod.REASON;
    const reason = ctx.args.slice(1).join(' ');
    if (!reason) return ctx.channel.send(client.I18n.translate`❌ You must include a reason!`);
    mod.REASON = reason;
    config.moderation[ctx.args[0] - 1] = mod;
    client.servers.set(ctx.guild.id, config);
    ctx.guild.channels.get(config.channel_modlog).messages.fetch({ limit: 30 }).then((messages) => {
      const modMessage = messages.find(m => m.content.includes(`\`[${require('moment-timezone')(mod.TIME).tz(config.timezone).format('HH:mm:ss')}]\` \`[${ctx.args[0]}]\``));
      if (!modMessage) return ctx.channel.send(client.I18n.translate`❌ The reason has been changed in the moderation part but the message has not been found!`);
      modMessage.content = modMessage.content.replace(oldReason, reason);
      modMessage.edit(modMessage.content).then(() => {
        ctx.channel.send(client.I18n.translate`✅ Reason changed for case ${ctx.args[0]}!`);
      }).catch(e => console.log(e.stack));
    }).catch(e => console.log(e.stack));
  } else {
    ctx.channel.send(client.I18n.translate`❌ No record found matching ID \`${ctx.args[0]}\`!`);
  }
};

exports.conf = {
  name: 'reason',
  aliases: [],
  public: true,
  user_permission: 'KICK_MEMBERS',
};
