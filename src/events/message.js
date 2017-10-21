/* eslint-disable consistent-return no-param-reassign */
module.exports = async (client, ctx) => {
  client.lastactive.set(ctx.author.id, new Date().getTime());

  /* SECURITY */
  if (ctx.author.bot || !ctx.guild) return;

  /* LOCALIZATION */
  const config = client.servers.get(ctx.guild.id);

  /* AFK */
  if (client.afk.has(ctx.author.id)) {
    client.afk.delete(ctx.author.id);
    ctx.author.send(client.I18n.translate`👋 Welcome back! I removed your AFK status.`);
  }

  if (ctx.mentions.users.size > 0) {
    ctx.mentions.users.forEach((u) => {
      if (!client.afk.has(u.id)) return;
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

    /* BLACKLIST */
    const blacklist = client.config.blacklist.users[ctx.author.id];
    if (blacklist) {
      await ctx.channel.send(`⚠ You have been blacklisted - You cannot use iBot commands anymore.\n__Given reason :__ ${blacklist.reason} - __Time :__ ${blacklist.time}`);
      return;
    }

    const question = ctx.content.split(/ /g).slice(1).join(' ');
    if (!question) return;
    if (question === 'reset' && client.cs[ctx.author.id] !== undefined) {
      if (!ctx.guild) return;
      client.I18n.use(config.locale);
      delete client.cs[ctx.author.id];
      ctx.channel.send(client.I18n.translate`✅ Your conversation has been erased!`);
    } else {
      ctx.channel.startTyping();
      const cleverbot = require('cleverbot-unofficial-api');
      cleverbot(client.config.api.cleverbot, question, client.cs[ctx.author.id]).then((res) => {
        ctx.channel.send(res.output);
        client.cs[ctx.author.id] = res.cs;
        ctx.channel.stopTyping();
      }).catch(() => {
        ctx.channel.stopTyping(true);
        delete client.cs[ctx.author.id];
      });
    }
  }

  if (!ctx.guild) return;

  /* PREFIX CHECKING */
  const prefixes = [client.config.discord.prefix, client.config.discord.prefix.toUpperCase()];
  config.custom_prefixes.forEach(prefix => prefixes.push(prefix));
  let prefix;
  prefixes.forEach((prefix2) => {
    if (ctx.content.indexOf(prefix2) === 0) {
      prefix = prefix2;
    }
  });
  if (!prefix) return;

  /* HANDLING */
  ctx.args = ctx.content.split(/ +/g);
  const command = ctx.args.shift().slice(prefix.length).toLowerCase();

  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (cmd) {
    client.I18n.use(config.locale);

    /* BLACKLIST */
    const blacklist = client.config.blacklist.users[ctx.author.id];
    if (blacklist) {
      await ctx.channel.send(client.I18n.translate`⚠ You have been blacklisted - You cannot use iBot commands anymore.\n__Given reason :__ ${blacklist.reason} - __Time :__ ${blacklist.time}`);
      return;
    }
    
    /* IF COMMAND IS PRIVATE */
    if (!cmd.conf.public && ctx.author.id !== client.config.discord.ownerID) return ctx.channel.send(client.I18n.translate`❌ You do not have the permission to execute this command!`);

    /* PERMISSIONS */
    if (cmd.conf.user_permission && !ctx.member.hasPermission(cmd.conf.user_permission)) return ctx.channel.send(client.I18n.translate`❌ You do not have the permission \`${cmd.conf.user_permission}\`!`);
    if (cmd.conf.bot_permission && !ctx.guild.me.hasPermission(cmd.conf.bot_permission)) return ctx.channel.send(client.I18n.translate`❌ I do not have the permission \`${cmd.conf.bot_permission}\`!`);

    /* EXECUTE */
    try {
      require('fs').appendFile('./logs/commands.txt', `[${require('moment-timezone')().tz('UTC').format('DD/MM/YYYY HH:mm:ss')}] Author: ${ctx.author.tag} (ID:${ctx.author.id}) - Guild: ${ctx.guild.name} (ID:${ctx.guild.id}) - Channel: ${ctx.channel.name} (ID:${ctx.channel.id})\r\n${ctx.cleanContent}\r\n--------------------\r\n`, (err) => {});
      let commandsRan = client.stats.get('cmdsran');
      if (!commandsRan) commandsRan = 0;
      commandsRan = parseInt(commandsRan) + 1;
      client.stats.set('cmdsran', commandsRan);
      cmd.execute(client, ctx);
    } catch (e) {
      ctx.channel.send(client.I18n.translate`❌ An unhandled error has occured! I told my dad about it, don't worry and... it'll be fixed soon!`);
      require('fs').appendFile('./logs/errors.txt', `----------\r\n${require('moment-timezone')().tz('UTC').format('DD/MM/YYYY HH:mm:ss')}] Author: ${ctx.author.tag} (ID:${ctx.author.id}) - Guild: ${ctx.guild.name} (ID:${ctx.guild.id}) - Channel: ${ctx.channel.name} (ID:${ctx.channel.id}) - Command: ${command}\r\n${ctx.cleanContent}\r\n===RETURNED ERROR===\n${e}\r\n`, err => console.error(err));
    }
  } else if (config.imported_tags.indexOf(command) !== -1) {
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
