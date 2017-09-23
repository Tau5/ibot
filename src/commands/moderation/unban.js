exports.execute = async (client, ctx) => {
  const search = ctx.args.join(' ').split(' for ')[0].toLowerCase();
  if (!search) return ctx.channel.send(client.I18n.translate`❌ You must specify a user to unban!`);

  let reason = ctx.args.join(' ').split(' for ').slice(1).join(' for ');
  if (!reason) reason = client.I18n.translate`no reason specified`;

  ctx.guild.fetchBans().then((bans) => {
    let user;
    const filtered = bans.filter(u => `${u.user.username}#${u.user.discriminator}`.toLowerCase().includes(search) || u.user.id === search);
    if (filtered.size === 0) return ctx.channel.send(client.I18n.translate`❌ Nobody found matching \`${ctx.args.join(' ').split(' for ')[0]}\`!`);
    else if (filtered.size === 1) user = filtered.first().user;
    else return ctx.channel.send(client.findersUtil.formatUsers(client, filtered));

    ctx.guild.unban(user.id, `[UNBAN] ${ctx.author.tag}: ${reason}`).then(() => {
      const config = client.servers.get(ctx.guild.id);
      config.moderation.push({
        ACTION: 'UNBAN',
        AUTHOR: ctx.author.id,
        VICTIM: user.id,
        REASON: reason,
        TIME: new Date().getTime(),
      });
      client.servers.set(ctx.guild.id, config);

      client.modUtil.Modlog(client, ctx.guild, client.I18n.translate`⚙ **${ctx.author.tag}** unbanned **${user.username}#${user.discriminator}** (ID:${user.id}).`, reason);

      return ctx.channel.send(client.I18n.translate`✅ Unbanned **${user.username}#${user.discriminator}**!`);
    }).catch(() => ctx.channel.send(client.I18n.translate`❌ An error has occured!`));
  });
};

exports.conf = {
  name: 'unban',
  aliases: [],
  public: true,
  user_permission: 'BAN_MEMBERS',
  bot_permission: 'BAN_MEMBERS',
};
