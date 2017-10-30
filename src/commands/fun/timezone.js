exports.execute = async (client, ctx) => {
  const search = ctx.args.join(' ');
  let member = ctx.member;

  if (search) {
    if (ctx.mentions.members.size > 0) member = ctx.mentions.members.first();
    else {
      member = client.findersUtil.findMember(ctx.guild, search);
      if (member.size === 0) return ctx.channel.send(client.I18n.translate`❌ Nobody found matching \`${search}\`!`);
      else if (member.size === 1) member = member.first();
      else return ctx.channel.send(client.findersUtil.formatMembers(client, member));
    }
  }

  const profile = client.profiles.get(member.id);
  if (!profile || Object.keys(profile).indexOf('timezone') === -1) return ctx.channel.send(client.I18n.translate`❌ **${member.user.tag}** does not have a profile!`);

  const mtz = require('moment-timezone');
  if (mtz.tz.names().indexOf(profile.timezone) === -1) return ctx.channel.send(client.I18n.translate`❌ \`${profile.timezone}\` is not a valid timezone!`);

  const time = `${mtz().tz(profile.timezone).format('`HH:mm`')} (${mtz().tz(profile.timezone).format('`hh:mm A`')})`;
  ctx.channel.send(client.I18n.translate`🕐 Time for **${member.user.tag}**: ${time}`);
};

exports.conf = {
  name: 'timezone',
  aliases: ['tz', 'timefor', 'tf'],
  public: true,
};
