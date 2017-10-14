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
    return ctx.channel.send(client.I18n.translate`❌ You must mention or specify a user to warn!`);
  }

  let reason = ctx.args.join(' ').split(' for ').slice(1).join(' for ');
  if (!reason) reason = client.I18n.translate`no reason specified`;

  const config = client.servers.get(ctx.guild.id);
  const warns = config.moderation.filter(o => o.VICTIM !== undefined).filter(o => o.ACTION === 'WARN' && o.VICTIM === member.id);
  const unwarns = config.moderation.filter(o => o.VICTIM !== undefined).filter(o => o.ACTION === 'UNWARN' && o.VICTIM === member.id);
  const warncount = (warns.length - unwarns.length);

  config.moderation.push({
    ACTION: 'WARN',
    AUTHOR: ctx.author.id,
    VICTIM: member.id,
    REASON: reason,
    TIME: new Date().getTime(),
  });
  client.servers.set(ctx.guild.id, config);

  if (!member.user.bot) member.user.send(client.I18n.translate`📝 You have been warned on __${ctx.guild.name}__ by **${ctx.author.tag}**.\n__Reason :__ ${reason}`);
  client.modUtil.Modlog(client, ctx.guild, client.I18n.translate`📝 **${ctx.author.tag}** warned **${member.user.tag}** (ID:${member.id}). *Warns count: ${(warncount + 1)}*`, reason);
  ctx.channel.send(client.I18n.translate`✅ Warned **${member.user.tag}**!`);
};

exports.conf = {
  name: 'warn',
  aliases: [],
  public: true,
  user_permission: 'KICK_MEMBERS',
  bot_permission: 'KICK_MEMBERS',
};
