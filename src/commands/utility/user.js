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

  let status;
  switch (member.user.presence.status) {
    case 'online':
      status = client.I18n.translate`<:online:334859814410911745> Online`;
      break;
    case 'idle':
      status = client.I18n.translate`<:away:334859813869584384> Absent`;
      break;
    case 'dnd':
      status = client.I18n.translate`<:dnd:334859814029099008> Do not disturb`;
      break;
    case 'offline':
      status = client.I18n.translate`<:offline:334859814423232514> Offline`;
      break;
    default:
      status = client.I18n.translate`Unknown`;
      break;
  }

  if (member.user.presence.activity) status += client.I18n.translate`\n🎮 Playing *${member.user.presence.activity.name}*`;

  const emote = member.user.bot ? '<:bot:334859813915983872>' : '👤';

  const premium = (member.user.avatar !== null && member.user.avatar.startsWith('a_')) ? '<:nitro:334859814566101004> Discord Nitro' : client.I18n.translate`None`;

  let lastactive = client.I18n.translate`No information`;
  if (client.lastactive.has(member.id)) {
    lastactive = require('time-ago')().ago(new Date(client.lastactive.get(member.id)));
    if (lastactive.includes('ms')) lastactive = client.I18n.translate`Less than a second ago.`;
  }

  const { roles } = member;
  let role = client.I18n.translate`None`;
  roles.delete(ctx.guild.id);
  if (roles.size >= 1) role = roles.sort((a, b) => b.position - a.position).map(r => r.toString()).join(', ');

  const ordered = ctx.guild.members.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
  const index = ordered.keyArray().indexOf(member.id);
  let joinOrder;
  switch (index) {
    case 0:
      joinOrder = `**${ordered.array()[index].user.username}** > ${ordered.array()[index + 1].user.username} > ${ordered.array()[index + 2].user.username} > ${ordered.array()[index + 3].user.username} > ${ordered.array()[index + 4].user.username}`;
      break;
    case 1:
      joinOrder = `${ordered.array()[index - 1].user.username} > **${ordered.array()[index].user.username}** > ${ordered.array()[index + 1].user.username} > ${ordered.array()[index + 2].user.username} > ${ordered.array()[index + 3].user.username}`;
      break;
    case (ctx.guild.members.size - 1):
      joinOrder = `${ordered.array()[index - 4].user.username} > ${ordered.array()[index - 3].user.username} > ${ordered.array()[index - 2].user.username} > ${ordered.array()[index - 1].user.username} > **${ordered.array()[index].user.username}**`;
      break;
    case (ctx.guild.members.size - 2):
      joinOrder = `${ordered.array()[index - 3].user.username} > ${ordered.array()[index - 2].user.username} > ${ordered.array()[index - 1].user.username} > **${ordered.array()[index].user.username}** > ${ordered.array()[index + 1].user.username}`;
      break;
    default:
      joinOrder = `${ordered.array()[index - 2].user.username} > ${ordered.array()[index - 1].user.username} > **${ordered.array()[index].user.username}** > ${ordered.array()[index + 1].user.username} > ${ordered.array()[index + 2].user.username}`;
      break;
  }

  let afk = client.I18n.translate`No`;
  if (client.afk.has(member.id)) afk = client.afk.get(member.id);

  const { MessageEmbed } = require('discord.js');
  const embed = new MessageEmbed()
    .addField('🔢 ID', member.id, true)
    .addField(client.I18n.translate`📝 Nickname`, member.nickname ? member.nickname : client.I18n.translate`None`, true)
    .addField(client.I18n.translate`👁 Presence`, status, true)
    .addField(client.I18n.translate`🏅 Special ranks`, premium, true)
    .addField(client.I18n.translate`👕 Roles`, role)
    .addField(client.I18n.translate`▶ Join order (#${(index + 1)})`, joinOrder)
    .addField(client.I18n.translate`⏱ Last active`, lastactive, true)
    .addField(client.I18n.translate`💤 AFK`, afk, true)
    .addField(client.I18n.translate`⏲ Server join date`, member.joinedAt.toUTCString(), true)
    .addField(client.I18n.translate`📆 Account creation date`, member.user.createdAt.toUTCString(), true)
    .setColor(ctx.guild.me.displayHexColor)
    .setThumbnail(member.user.displayAvatarURL());

  return ctx.channel.send(client.I18n.translate`${emote} Informations about **${member.user.tag}** :`, { embed });
};

exports.conf = {
  name: 'user',
  aliases: ['info', 'i'],
  public: true,
};
