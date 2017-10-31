exports.execute = async (client, ctx) => {
  /* MEMBERS FINDER */
  const search = ctx.args.join(' ');
  let member = ctx.author;
  if (search.length === 18 && !isNaN(search)) {
    member = await client.users.fetch(search).catch(() => {
      member = 'NO';
      return ctx.channel.send(client.I18n.translate`❌ The given user ID is not known by Discord!`);
    });
    if (member === 'NO') return;
  } else if (ctx.mentions.users.size > 0) member = ctx.mentions.users.first();

  else if (search) {
    member = client.findersUtil.findMember(ctx.guild, search);
    if (member.size === 0) return ctx.channel.send(client.I18n.translate`❌ Nobody found matching \`${search}\`!`);
    else if (member.size === 1) member = member.first().user;
    else return ctx.channel.send(client.findersUtil.formatMembers(client, member));
  }

  const request = require('request');
  request.post('https://bans.discordlist.net/api', { form: { version: 3, userid: member.id, token: client.config.api.discord_bans } }, (err, http, body) => {
    if (err && http.statusCode !== 200) return ctx.channel.send(client.I18n.translate`❌ An error has occured!`);
    const { MessageEmbed } = require('discord.js');
    let status = client.I18n.translate`Is not on the list.`;
    let color = 'GREEN';
    let reason = 'nothing';

    if (body !== 'True' && body !== 'False') {
      body = JSON.parse(body);
      status = client.I18n.translate`Is on the list.`;
      color = 'RED';
      reason = body[3];
    }

    const embed = new MessageEmbed()
      .addField(client.I18n.translate`User`, `**${member.tag}** (ID:${member.id})`, true)
      .addField(client.I18n.translate`Status`, status, true)
      .setColor(color)
      .setThumbnail(member.displayAvatarURL());

    if (reason !== 'nothing') embed.addField(client.I18n.translate`Reason`, reason);

    return ctx.channel.send(client.I18n.translate`🚔 Discord Bans list fetched!`, { embed });
  });
};

exports.conf = {
  name: 'checkdbans',
  aliases: ['dbans', 'checkbans'],
  public: true,
};
