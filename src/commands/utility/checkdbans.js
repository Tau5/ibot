exports.execute = async (client, ctx) => {
  /* MEMBERS FINDER */
  const search = ctx.args.join(' ');
  let { member } = ctx;
  if (search.length === 18 && !isNaN(search)) {
    client.users.fetch(search).then((u) => {
      member = u;
    }).catch(() => {
      member = 'NO';
      return ctx.channel.send(client.I18n.translate`❌ The given user ID is not known by Discord!`);
    });
    if (member === 'NO') return 1;
  } else if (ctx.mentions.users.size > 0) member = ctx.mentions.users.first();

  else if (search) {
    member = client.findersUtil.findMember(ctx.guild, search);
    if (member.size === 0) return ctx.channel.send(client.I18n.translate`❌ Nobody found matching \`${search}\`!`);
    else if (member.size === 1) member = member.first().user;
    else return ctx.channel.send(client.findersUtil.formatMembers(client, member));
  }

  const request = require('request');
  request.post('https://bans.discordlist.net/api', { form: { version: 3, userid: member.id, token: client.config.dbans_api } }, (err, http, body) => {
    if (err && http.statusCode !== 200) return ctx.channel.send(client.I18n.translate`❌ An error has occured!`);
    const { MessageEmbed } = require('discord.js');
    let status = client.I18n.translate`Is not on the list.`;
    let color = 'GREEN';

    if (body !== 'True' && body !== 'False') body = JSON.parse(body);
    if (typeof body === 'object') {
      status = client.I18n.translate`Is on the list.`;
      color = 'RED';
    }

    const embed = new MessageEmbed()
      .addField(client.I18n.translate`User`, `**${member.tag}** (ID:${member.id})`, true)
      .addField(client.I18n.translate`Status`, status, true)
      .setColor(color)
      .setThumbnail(member.displayAvatarURL());

    if (color === 'RED') {
      embed.addField(client.I18n.translate`Reason`, body[3], true);
      embed.addField('🖼', body[4], true);
    }

    return ctx.channel.send(client.I18n.translate`🚔 Discord Bans list fetched!`, { embed });
  });
};

exports.conf = {
  name: 'checkdbans',
  aliases: ['dbans', 'checkbans'],
  public: true,
};
