exports.execute = async (client, ctx) => {
  /* MEMBERS FINDER */
  let member;
  const search = ctx.args.join(' ').split(' for ')[0];
  if (search) {
    if (ctx.mentions.members.size > 0) member = ctx.mentions.members.first();
    else {
      member = client.findersUtil.findMember(ctx.guild, search);
      if (member.size === 0) return ctx.channel.send(client.I18n.translate`❌ Nobody found matching \`${search}\`!`);
      else if (member.size === 1) member = member.first();
      else return ctx.channel.send(client.findersUtil.formatMembers(client, member));
    }
  } else {
    ctx.channel.send(client.I18n.translate`❌ You must mention or specify a user to unwarn!`);
  }

  let reason = ctx.args.join(' ').split(' for ').slice(1).join(' for ');
  if (!reason) reason = client.I18n.translate`no reason specified`;

  const config = client.servers.get(ctx.guild.id);
  const warns = config.moderation.filter(o => o.VICTIM !== undefined).filter(o => o.ACTION === 'WARN' && o.VICTIM === member.id);

  if (warns.length === 0) return ctx.channel.send(client.I18n.translate`❌ **${member.user.tag}** does not have any warn!`);

  config.moderation.push({
    ACTION: 'UNWARN',
    AUTHOR: ctx.author.id,
    VICTIM: member.id,
    REASON: reason,
    TIME: new Date().getTime(),
  });
  client.servers.set(ctx.guild.id, config);

  client.modUtil.Modlog(client, ctx.guild, client.I18n.translate`📝 **${ctx.author.tag}** unwarned **${member.user.tag}** (ID:${member.id}). *Warns count: ${(warns.length - 1)}*`, reason);
  ctx.channel.send(client.I18n.translate`✅ Unwarned **${member.user.tag}**!`);
};

exports.conf = {
  name: 'unwarn',
  aliases: [],
  public: true,
  user_permission: 'KICK_MEMBERS',
  bot_permission: 'KICK_MEMBERS',
};
