exports.execute = async (client, ctx) => {
  /* MEMBERS FINDER */
  const search = ctx.args.join(' ');
  let { member } = ctx;
  if (ctx.mentions.members.size > 0) member = ctx.mentions.members.first();
  else if (search) {
    member = client.findersUtil.findMember(ctx.guild, search);
    if (member.size === 0) return ctx.channel.send(client.I18n.translate`❌ Nobody found matching \`${search}\`!`);
    else if (member.size === 1) member = member.first();
    else return ctx.channel.send(client.findersUtil.formatMembers(client, member));
  }

  const { MessageEmbed } = require('discord.js');
  const embed = new MessageEmbed()
    .setImage(member.user.displayAvatarURL())
    .setColor(ctx.guild.me.displayHexColor);

  return ctx.channel.send(client.I18n.translate`🖼 Avatar for **${member.user.tag}** :`, { embed });
};

exports.conf = {
  name: 'avatar',
  aliases: ['pp'],
  public: true,
};
