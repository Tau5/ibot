exports.execute = async (client, ctx) => { // eslint-disable-line consistent-return
  const lookup = ctx.args.join(' ');
  const { MessageEmbed } = require('discord.js');
  const embed = new MessageEmbed().setColor(ctx.guild.me.displayHexColor);

  if (isNaN(lookup)) { // eslint-disable-line no-restricted-globals
    const invite = await client.fetchInvite(lookup).catch(() => {});
    if (!invite) return ctx.channel.send(client.I18n.translate`❌ No invite found matching \`${lookup}\`!`);
    let inviter = client.I18n.translate`Unknown inviter`;
    if (invite.inviter) inviter = `**${invite.inviter.tag}** (ID:${invite.inviter.id})`;

    embed.addField(client.I18n.translate`Inviter`, inviter)
      .addField(client.I18n.translate`Channel`, `**#${invite.channel.name}** (ID:${invite.channel.id})`)
      .setThumbnail(invite.guild.iconURL({ format: 'png', size: 1024 }));

    ctx.channel.send(client.I18n.translate`📧 Informations about **${invite.guild.name}** :`, { embed });
  } else {
    client.users.fetch(lookup).then((user) => {
      let emote = '👤';
      if (user.bot) emote = '<:bot:334859813915983872>';

      let premium = client.I18n.translate`None`;
      if (user.avatar !== null && user.avatar.startsWith('a_')) premium = '<:nitro:334859814566101004> Discord Nitro';

      embed.addField('🔢 ID', user.id, true)
        .addField(client.I18n.translate`🏅 Special ranks`, premium, true)
        .addField(client.I18n.translate`📆 Account creation date`, user.createdAt.toUTCString())
        .setThumbnail(user.displayAvatarURL());

      return ctx.channel.send(client.I18n.translate`${emote} Informations about **${user.tag}** :`, { embed });
    }).catch(() => {
      const guild = client.guilds.get(lookup);
      if (!guild) return ctx.channel.send(client.I18n.translate`❌ No user or guild found matching \`${lookup}\`!`);

      embed.addField('🔢 ID', guild.id, true)
        .addField(client.I18n.translate`👤 Owner`, `**${guild.owner.user.tag}** (ID:${guild.ownerID})`, true)
        .addField(client.I18n.translate`👥 Members`, guild.memberCount, true)
        .addField(client.I18n.translate`🗺 Channels`, `${guild.channels.filter(c => c.type === 'text').size} text and ${guild.channels.filter(c => c.type === 'voice').size} voice channels`, true)
        .addField(client.I18n.translate`📆 Guild creation date`, guild.createdAt.toUTCString(), true)
        .setThumbnail(guild.iconURL({ format: 'png', size: 1024 }));

      return ctx.channel.send(client.I18n.translate`🌐 Informations about **${guild.name}** :`, { embed });
    });
  }
};

exports.conf = {
  name: 'lookup',
  aliases: ['mag'],
  public: true,
};
