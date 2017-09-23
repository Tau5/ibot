exports.execute = async (client, ctx) => {
  const id = ctx.args.join(' ').split(' for ')[0];
  if (!id) return ctx.channel.send(client.I18n.translate`❌ You must specify a user ID to ban!`);

  let reason = ctx.args.join(' ').split(' for ').slice(1).join(' for ');
  if (!reason) reason = client.I18n.translate`no reason specified`;

  if (ctx.member.id === id) return ctx.channel.send(client.I18n.translate`❌ You cannot kick yourself!`);
  if (ctx.guild.members.has(id)) return ctx.channel.send(client.I18n.translate`❌ The user you try to hackban is on this server (**${ctx.guild.members.get(id).user.tag}**), use the ban command instead.`);

  ctx.guild.ban(id, `[HACKBAN] ${ctx.author.tag}: ${reason}`).then(async () => {
    const user = await client.users.fetch(id);

    const config = client.servers.get(ctx.guild.id);
    config.moderation.push({
      ACTION: 'HACKBAN',
      AUTHOR: ctx.author.id,
      VICTIM: id,
      REASON: reason,
      TIME: new Date().getTime(),
    });
    client.servers.set(ctx.guild.id, config);

    client.modUtil.Modlog(client, ctx.guild, client.I18n.translate`⚒ **${ctx.author.tag}** hackbanned **${user.tag}** (ID:${id}).`, reason);

    return ctx.channel.send(client.I18n.translate`✅ Hackbanned **${user.tag}**!`);
  }).catch((e) => {
    ctx.channel.send(client.I18n.translate`❌ An error has occured! You might have put a wrong user ID.`); console.error(e);
  });
};

exports.conf = {
  name: 'hackban',
  aliases: [],
  public: true,
  user_permission: 'BAN_MEMBERS',
  bot_permission: 'BAN_MEMBERS',
};
