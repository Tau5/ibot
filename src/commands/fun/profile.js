exports.execute = async (client, ctx) => {
  const fields = ['about', 'email', 'minecraft', 'steam', 'timezone', 'twitch', 'twitter', 'youtube'];
  let profile = client.profiles.get(ctx.author.id);

  if (fields.indexOf(ctx.args[0]) !== -1) {
    const field = ctx.args[0];
    const value = ctx.args.slice(1).join(' ');
    if (!value) return ctx.channel.send(client.I18n.translate`❌ You must put a value for filling a field!`);

    if (!profile) profile = {};
    profile[field] = value;
    client.profiles.set(ctx.author.id, profile);

    ctx.channel.send(client.I18n.translate`✅ Field \`${field}\` created!`);
  } else if (ctx.args[0] === 'clear') {
    const field = ctx.args[1];
    if (!field) return ctx.channel.send(client.I18n.translate`❌ You must put a field name!`);
    if (fields.indexOf(field) === -1) return ctx.channel.send(client.I18n.translate`❌ \`${field}\` is not a valid field name!`);

    if (!profile) return ctx.channel.send(client.I18n.translate`❌ You do not have a profile!`);
    if (!profile[field]) return ctx.channel.send(client.I18n.translate`❌ Your profile does not have the field \`${field}\`!`);
    delete profile[field];
    client.profiles.set(ctx.author.id, profile);

    ctx.channel.send(client.I18n.translate`✅ Field \`${field}\` deleted!`);
  } else {
    const search = ctx.args.join(' ');
    let member = ctx.member;

    if (search) {
      if (ctx.mentions.members.size > 0) member = ctx.mentions.members.first();
      else {
        member = client.findersUtil.findMembers(ctx.guild, search);
        if (member.size === 0) return ctx.channel.send(client.I18n.translate`❌ Nobody found matching \`${search}\`!`);
        else if (member.size === 1) member = member.first();
        else return ctx.channel.send(client.findersUtil.formatMembers(client, member));
      }
    }

    const distProfile = client.profiles.get(member.id);
    if (!distProfile || Object.keys(distProfile).length === 0) return ctx.channel.send(client.I18n.translate`❌ **${member.user.tag}** does not have a profile!`);

    const mapped = Object.keys(distProfile).map(e => `**${e.charAt(0).toUpperCase() + e.substring(1)}** : ${distProfile[e]}`).join('\n');
    ctx.channel.send(client.I18n.translate`👤 Profile for **${member.user.tag}** :\n${mapped}`);
  }
};

exports.conf = {
  name: 'profile',
  aliases: ['p'],
  public: true,
};
