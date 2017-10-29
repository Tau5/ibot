exports.execute = async (client, ctx) => {
  const search = ctx.args.join(' ');
  if (!search) return ctx.channel.send(client.I18n.translate`❌ You must specify a role to search!`);

  let role;
  if (ctx.mentions.roles.size > 0) role = ctx.roles.channels.first();
  else {
    role = client.findersUtil.findRoles(ctx.guild, search);
    if (role.size === 0) return ctx.channel.send(client.I18n.translate`❌ No role found matching \`${search}\`!`);
    else role = role.first();
  }

  const config = client.servers.get(ctx.guild.id);
  if (config.roleme.indexOf(role.id) === -1) return ctx.channel.send(client.I18n.translate`❌ This role is not available for roleme!`);

  if (ctx.member.roles.has(role.id)) {
    await ctx.member.removeRole(role.id, `ROLEME: ${ctx.author.tag}`);
    ctx.channel.send(client.I18n.translate`✅ Role **${role.name}** removed!`);
  } else {
    await ctx.member.addRole(role.id, `ROLEME: ${ctx.author.tag}`);
    ctx.channel.send(client.I18n.translate`✅ Role **${role.name}** added!`);
  }
};

exports.conf = {
  name: 'roleme',
  aliases: [],
  public: true,
};
