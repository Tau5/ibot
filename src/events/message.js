module.exports = async (client, ctx) => { // eslint-disable-line consistent-return
  client.lastactive.set(ctx.author.id, new Date().getTime());
  
  /* SECURITY */
  if (ctx.author.bot) return 1; // eslint-disable-line consistent-return
  if (ctx.channel.type !== 'text') return ctx.channel.send(client.I18n.translate`❌ You must be in a guild channel in order to use ${client.user.username}!`);

  /* LOCALIZATION */
  const config = client.servers.get(ctx.guild.id);

  /* AFK */
  if (client.afk.has(ctx.author.id)) {
    client.afk.delete(ctx.author.id);
    ctx.author.send(client.I18n.translate`👋 Welcome back! I removed your AFK status.`);
  }

  if (ctx.mentions.users.size > 0) {
    ctx.mentions.users.forEach((u) => {
      if (!client.afk.has(u.id)) return 1;
      const { MessageEmbed } = require('discord.js');
      const embed = new MessageEmbed()
        .addField(client.I18n.translate`💤 **${u.username}** is AFK!`, client.afk.get(u.id))
        .setColor(ctx.guild.me.displayHexColor);
      return ctx.channel.send({ embed });
    });
  }

  /* CLEVERBOT */
  if (client.cleverbot && (ctx.content.indexOf(`<@${client.user.id}>`) === 0 || ctx.content.indexOf(`<@!${client.user.id}>`) === 0)) {
    client.I18n.use(config.locale);
    const question = ctx.content.split(/ /g).slice(1).join(' ');
    if (!question) return 1;
    ctx.channel.startTyping();
    const cleverbot = require('cleverbot-unofficial-api');
    cleverbot(client.config.cleverbot_api, question, client.cs[ctx.author.id]).then((res) => {
      ctx.channel.send(res.output);
      client.cs[ctx.author.id] = res.cs; // eslint-disable-line no-param-reassign
      ctx.channel.stopTyping();
    }).catch(() => {
      ctx.channel.stopTyping(true);
      delete client.cs[ctx.author.id]; // eslint-disable-line no-param-reassign
    });
  }

  /* HANDLING */
  if (ctx.content.indexOf(client.config.prefix) !== 0
    && ctx.content.indexOf(client.config.prefix.toUpperCase()) !== 0) return 1;
  ctx.args = ctx.content.split(/ /g);
  const command = ctx.args.shift().slice(client.config.prefix.length).toLowerCase();

  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (cmd) {
    client.I18n.use(config.locale);

    /* IF COMMAND IS PRIVATE */
    if (!cmd.conf.public && ctx.author.id !== '205427654042583040') return ctx.channel.send(client.I18n.translate`❌ You do not have the permission to execute this command!`);

    /* PERMISSIONS */
    if (cmd.conf.user_permission && !ctx.member.hasPermission(cmd.conf.user_permission)) return ctx.channel.send(client.I18n.translate`❌ You do not have the permission \`${cmd.conf.user_permission}\`!`);
    if (cmd.conf.bot_permission && !ctx.guild.me.hasPermission(cmd.conf.bot_permission)) return ctx.channel.send(client.I18n.translate`❌ I do not have the permission \`${cmd.conf.bot_permission}\`!`);

    /* EXECUTE */
    try {
      cmd.execute(client, ctx);
    } catch (e) {
      ctx.channel.send(client.I18n.translate`❌ An unhandled error has occured! I told my dad about it, don't worry and... it'll be fixed soon!`);
      require('fs').appendFile('./logs/errors.txt', `----------\r\n${require('moment-timezone')().tz('UTC').format('DD/MM/YYYY HH:mm:ss')}] Author: ${ctx.author.tag} (ID:${ctx.author.id}) - Guild: ${ctx.guild.name} (ID:${ctx.guild.id}) - Channel: ${ctx.channel.name} (ID:${ctx.channel.id}) - Command: ${command}\r\n${ctx.cleanContent}\r\n===RETURNED ERROR===\n${e}\r\n`, err => console.error(err));
    }
  } else if (client.tags.has(command)) {
    const args = ctx.args.join(' ');
    const tag = client.tags.get(command);

    const content = tag.content
      .replace(/{args}/g, args)
      .replace(/{randomuser}/g, ctx.guild.members.random().user.username)
      .replace(/{range1-100}/g, Math.floor(Math.random() * 1000))
      .replace(/{guildname}/g, ctx.guild.name)
      .replace(/{guildcount}/g, ctx.guild.memberCount);
    ctx.channel.send(content);
  }
};
