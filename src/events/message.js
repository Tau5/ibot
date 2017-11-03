/* eslint-disable consistent-return no-param-reassign */
module.exports = async (client, ctx) => {
  client.lastactive.set(ctx.author.id, Date.now());

  /* SECURITY */
  if (ctx.author.bot || !ctx.guild) return;

  /* LOCALIZATION */
  const config = client.servers.get(ctx.guild.id);

  /* BANNED WORDS */
  if (config.banned_words.some(word => ctx.content.toLowerCase().includes(word.toLowerCase())) && !ctx.content.startsWith(`${client.config.discord.prefix}config`)) {
    const action = config.action_bannedword;
    if (action === 'DELETE') {
      ctx.delete().then(() => {
        ctx.channel.send(client.I18n.translate`⚠ This message contains some banned words that are in the banned words list! Action \`${action}\` done.`);
      }).catch(() => {});
      return;
    } else if (action === 'KICK') {
      ctx.member.kick('Banned word').then(() => {
        ctx.channel.send(client.I18n.translate`⚠ Kicked **${ctx.author.tag}** for having said a banned word.`);
      }).catch(() => {});
      return;
    } else if (action === 'BAN') {
      ctx.member.ban('Banned word').then(() => {
        ctx.channel.send(client.I18n.translate`⚠ Banned **${ctx.author.tag}** for having said a banner word.`);
      }).catch(() => {});
      return;
    }
  }

  /* AFK */
  if (client.afk.has(ctx.author.id)) {
    client.I18n.use(config.locale);
    client.afk.delete(ctx.author.id);
    ctx.author.send(client.I18n.translate`👋 Welcome back! I removed your AFK status.`);
  }

  if (ctx.mentions.users.size > 0) {
    ctx.mentions.users.forEach((u) => {
      if (!client.afk.has(u.id)) return;
      client.I18n.use(config.locale);
      const { MessageEmbed } = require('discord.js');
      const embed = new MessageEmbed()
        .addField(client.I18n.translate`💤 **${u.username}** is AFK!`, client.afk.get(u.id))
        .setColor(ctx.guild.me.displayHexColor);
      return ctx.channel.send({ embed });
    });
  }

  /* PREVENT IGNORED CHANNELS */
  if (config.ignored_channels.indexOf(ctx.channel.id) !== -1) return;

  /* CLEVERBOT */
  if (client.cleverbot && (ctx.content.indexOf(`<@${client.user.id}>`) === 0 || ctx.content.indexOf(`<@!${client.user.id}>`) === 0)) {
    client.I18n.use(config.locale);

    /* COOLDOWN */
    if (client.cooldown.has(ctx.author.id)) return ctx.channel.send(client.I18n.translate`⚠ Calm down!`);

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
      const fs = require('fs');
      const request = require('request');
      request(`https://www.cleverbot.com/getreply?key=${client.config.api.cleverbot}&input=${encodeURIComponent(question)}&cs=${client.cs[ctx.author.id] ? client.cs[ctx.author.id] : '0'}`, (err, http, body) => {
        if (err) throw err;

        try {
          const response = JSON.parse(body);

          let commandCount = client.stats.get('cleverbot');
          if (!commandCount) commandCount = 0;
          commandCount = parseInt(commandCount) + 1;
          client.stats.set('cleverbot', commandCount);

          client.cooldown.add(ctx.author.id);
          setTimeout(() => client.cooldown.delete(ctx.author.id), 2000);

          if (response.status) {
            ctx.channel.send(`❌ \`\`\`${response.status}\`\`\``);
            ctx.channel.stopTyping(true);
            fs.appendFile('./logs/cleverbot.txt', `======ERROR======\n[${require('moment-timezone')().tz('UTC').format('DD MM YYYY HH:mm:ss')}] ${ctx.author.tag} (ID:${ctx.author.id}) - Guild: ${ctx.guild.name} (ID:${ctx.guild.id}) - Channel: ${ctx.channel.name} (ID:${ctx.channel.id}) - Question: ${question}\n=> ERROR: ${response.status}\n=================`, () => {});
          } else {
            ctx.channel.send(response.output);
            client.cs[ctx.author.id] = response.cs;
            ctx.channel.stopTyping();
            fs.appendFile('./logs/cleverbot.txt', `======DONE!======\n[${require('moment-timezone')().tz('UTC').format('DD MM YYYY HH:mm:ss')}] ${ctx.author.tag} (ID:${ctx.author.id}) - Guild: ${ctx.guild.name} (ID:${ctx.guild.id}) - Channel: ${ctx.channel.name} (ID:${ctx.channel.id}) - Question: ${question}\n=> CS: ${response.cs}\n=> Response: ${response.output}\n=================`, () => {});
          }
        } catch (e) {
          ctx.channel.send('❌ An unknown error has occured!');
          delete client.cs[ctx.author.id];
          ctx.channel.stopTyping(true);
        }
      });
    }
  }

  /* PREFIX CHECKING */
  const prefixes = [client.config.discord.prefix, client.config.discord.prefix.toUpperCase()];
  config.custom_prefixes.forEach(prefix => prefixes.push(prefix));
  let prefix;
  prefixes.forEach((prefix2) => {
    if (ctx.content.indexOf(prefix2) === 0) {
      prefix = prefix2;
    }
  });
  if (!prefix) {
    if (ctx.channel.id !== config.channel_phone) return;
    if (client.calls[ctx.guild.id]) {
      const call = client.calls[ctx.guild.id];
      if (call.state === 1) {
        const called = client.guilds.get(client.numbers.get(call.calling));
        const distantConfig = client.servers.get(called.id);
        const calledPhoneChannel = client.channels.get(distantConfig.channel_phone);
        const nums = {
          sender: ((client.calls[ctx.guild.id].type === 0) ? client.calls[ctx.guild.id].calling : client.calls[called.id].calling),
          receiver: ((client.calls[ctx.guild.id].type === 1) ? client.calls[ctx.guild.id].calling : client.calls[called.id].calling),
        };

        if (!calledPhoneChannel) {
          delete client.calls[called.id];
          delete client.calls[ctx.guild.id];
          ctx.channel.send(client.I18n.translate`☎ Lost connection with \`${call.calling}\`!`);
          const logMsg = `[${require('moment-timezone')().tz(distantConfig.timezone).format('HH:mm:ss')}] - ======LOST CONNECTION======\n\n`;
          require('fs').appendFile(`./logs/calls/${nums.sender}_${nums.receiver}.txt`, logMsg, () => {});
        } else {
          const textToSend = ctx.cleanContent.split(/ +/g).join(' ');
          const logMsg = `[${require('moment-timezone')().tz(distantConfig.timezone).format('HH:mm:ss')}] - [${client.numbers.findKey(k => k === ctx.guild.id)}] **${ctx.author.tag}** (ID:${ctx.author.id}) - ${ctx.guild.name} : ${textToSend}\n`;
          let msgToSend = `☎ **${ctx.author.tag}** : ${textToSend}`;
          if (ctx.attachments.size > 0) msgToSend += `\n🖇 (${ctx.attachments.size})`;
          ctx.attachments.forEach((a) => {
            msgToSend += `\n**${a.name}** - <${a.url}>`;
          });

          require('fs').appendFile(`./logs/calls/${nums.sender}_${nums.receiver}.txt`, logMsg, () => {});
          calledPhoneChannel.send(msgToSend);
        }
      }
    }
  } else {
    /* HANDLING */
    ctx.args = ctx.content.split(/ +/g);
    const command = ctx.args.shift().slice(prefix.length).toLowerCase();

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (cmd) {
      client.I18n.use(config.locale);

      /* COOLDOWN */
      if (client.cooldown.has(ctx.author.id)) return ctx.channel.send(client.I18n.translate`⚠ Calm down!`);

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

      /* HANDLING */
      try {
        /* LOGGING */
        require('fs').appendFile('./logs/commands.txt', `[${require('moment-timezone')().tz('UTC').format('DD/MM/YYYY HH:mm:ss')}] Author: ${ctx.author.tag} (ID:${ctx.author.id}) - Guild: ${ctx.guild.name} (ID:${ctx.guild.id}) - Channel: ${ctx.channel.name} (ID:${ctx.channel.id})\r\n${ctx.cleanContent}\r\n--------------------\r\n`, () => {});

        /* STATS */
        client.stats.set('cmdsran', parseInt(client.stats.get('cmdsran')) + 1);
        client.stats.set(cmd.conf.name, parseInt(client.stats.get(cmd.conf.name)) + 1 || 1);
        client.stats.set(ctx.author.id, parseInt(client.stats.get(ctx.author.id)) + 1 || 1);

        /* COOLDOWN */
        client.cooldown.add(ctx.author.id);
        setTimeout(() => client.cooldown.delete(ctx.author.id), 2000);

        /* EXECUTE */
        cmd.execute(client, ctx);
      } catch (e) {
        /* LOGGING */
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
  }
};
