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


  const config = client.servers.get(ctx.guild.id);
  const warns = config.moderation.filter(o => o.VICTIM !== undefined).filter(o => o.ACTION === 'WARN' && o.VICTIM === member.id);
  const unwarns = config.moderation.filter(o => o.VICTIM !== undefined).filter(o => o.ACTION === 'UNWARN' && o.VICTIM === member.id);
  const warncount = (warns.length - unwarns.length);

  if (warncount <= 1) return ctx.channel.send(client.I18n.translate`❌ **${member.user.tag}** does not have any warn!`);

  ctx.channel.send(client.I18n.translate`ℹ **${member.user.tag}** has ${warncount} warns.\nWarn cases (oldest to newest): ${warns.sort((a, b) => a.TIME - b.TIME).map(v => `\`${config.moderation.indexOf(v) + 1}\``).join(', ')}.\nUnwarn cases (oldest to newest): ${unwarns.sort((a, b) => a.TIME - b.TIME).map(v => `\`${config.moderation.indexOf(v) + 1}\``).join(', ')}.`);
};

exports.conf = {
  name: 'warns',
  aliases: ['warnings'],
  user_permission: 'KICK_MEMBERS',
  public: true,
};
