exports.execute = async (client, ctx) => {
  if (!ctx.channel.permissionsFor(ctx.member).has('MANAGE_MESSAGES')) return ctx.channel.send(client.I18n.translate`❌ I do not have the permission \`${'MANAGE_MESSAGES'}\`!`);

  const thing = ctx.args.join(' ').split(' for ')[0];
  if (!thing) return ctx.channel.send(client.I18n.translate`❌ You must include something to delete! (can be: a user, an amount or bots)`);

  let reason = ctx.args.join(' ').split(' for ').slice(1).join(' for ');
  if (!reason) reason = client.I18n.translate`no reason specified`;

  const config = client.servers.get(ctx.guild.id);

  if (isNaN(thing)) {
    let messages = await ctx.channel.messages.fetch({ limit: 50 });
    if (thing === 'bots') {
      messages = messages.filter(m => m.author.bot);
      if (messages.size < 1) return ctx.channel.send(client.I18n.translate`❌ No message to delete!`);

      ctx.channel.bulkDelete(messages).then((m) => {
        config.moderation.push({
          ACTION: 'CLEAR_BOTS',
          AUTHOR: ctx.author.id,
          CHANNEL: ctx.channel.id,
          REASON: reason,
          TIME: new Date().getTime(),
        });
        client.servers.set(ctx.guild.id, config);

        const path = `./tmp/${ctx.guild.id}_${new Date().getTime()}.txt`;
        require('fs').writeFileSync(path, m.map(me => `${require('moment-timezone')().tz(config.timezone).format('DD/MM/YYYY HH:mm:ss')} ${me.author.tag} (ID:${me.author.id}) - ${me.cleanContent}`).join('\r\n'));

        client.modUtil.Modlog(client, ctx.guild, `🗑 **${ctx.author.tag}** deleted ${m.size} messages by bots in ${ctx.channel.toString()}.`, reason, [path]);
        ctx.channel.send(client.I18n.translate`✅ Deleted **${m.size}** messages!`);
      }).catch(() => ctx.channel.send(client.I18n.translate`❌ An unknown error occured while deleting messages! Try later.`));
    } else if (thing.startsWith('"') && thing.endsWith('"')) {
      const match = thing.replace(/"/g, '');
      const filtered = messages.filter(m => m.content.includes(match));
      if (filtered.size === 0) return ctx.channel.send(client.I18n.translate`❌ No message to delete!`);

      ctx.channel.bulkDelete(filtered).then((m) => {
        config.moderation.push({
          ACTION: `CLEAR_TEXT ("${match}")`,
          AUTHOR: ctx.author.id,
          CHANNEL: ctx.channel.id,
          REASON: reason,
          TIME: new Date().getTime(),
        });
        client.servers.set(ctx.guild.id, config);

        const path = `./tmp/${ctx.guild.id}_${new Date().getTime()}.txt`;
        require('fs').writeFileSync(path, m.map(me => `${require('moment-timezone')().tz(config.timezone).format('DD/MM/YYYY HH:mm:ss')} ${me.author.tag} (ID:${me.author.id}) - ${me.cleanContent}`).join('\r\n'));

        client.modUtil.Modlog(client, ctx.guild, `🗑 **${ctx.author.tag}** deleted ${m.size} messages matching "${match}" in ${ctx.channel.toString()}.`, reason, [path]);
        ctx.channel.send(client.I18n.translate`✅ Deleted **${m.size}** messages!`);
      }).catch(() => ctx.channel.send(client.I18n.translate`❌ An unknown error occured while deleting messages! Try later.`));
    } else {
      /* MEMBERS FINDER */
      let member;
      const search = ctx.args.join(' ').split(' for ')[0];
      if (search) {
        if (ctx.mentions.members.size > 0) member = ctx.mentions.members.first();
        else {
          member = client.findersUtil.findMember(ctx.guild, search);
          if (member.size === 0) return ctx.channel.send(client.I18n.translate`❌ Nobody found matching \`${search}\`!`);
          else if (member.size === 1) member = member.first();
          else return ctx.channel.send(client.findersUtil.formatMembers(client, member));
        }
      } else {
        return ctx.channel.send(client.I18n.translate`❌ You must mention or specify a user to kick!`);
      }

      messages = messages.filter(m => m.author.id === member.id);
      if (messages.size < 1) return ctx.channel.send(client.I18n.translate`❌ No message to delete!`);

      ctx.channel.bulkDelete(messages).then((m) => {
        config.moderation.push({
          ACTION: 'CLEAR_USER',
          AUTHOR: ctx.author.id,
          VICTIM: member.id,
          CHANNEL: ctx.channel.id,
          REASON: reason,
          TIME: new Date().getTime(),
        });
        client.servers.set(ctx.guild.id, config);

        const path = `./tmp/${ctx.guild.id}_${new Date().getTime()}.txt`;
        require('fs').writeFileSync(path, m.map(me => `${require('moment-timezone')().tz(config.timezone).format('DD/MM/YYYY HH:mm:ss')} ${me.author.tag} (ID:${me.author.id}) - ${me.cleanContent}`).join('\r\n'));

        client.modUtil.Modlog(client, ctx.guild, `🗑 **${ctx.author.tag}** deleted ${m.size} messages by **${member.user.tag}** in ${ctx.channel.toString()}.`, reason, [path]);
        ctx.channel.send(client.I18n.translate`✅ Deleted **${m.size}** messages!`);
      }).catch(() => ctx.channel.send(client.I18n.translate`❌ An unknown error occured while deleting messages! Try later.`));
    }
  } else {
    const messages = await ctx.channel.messages.fetch({ limit: thing });
    if (messages.size === 0) return ctx.channel.send(client.I18n.translate`❌ No message to delete!`);

    ctx.channel.bulkDelete(messages).then((m) => {
      config.moderation.push({
        ACTION: `CLEAR (${m.size})`,
        AUTHOR: ctx.author.id,
        CHANNEL: ctx.channel.id,
        REASON: reason,
        TIME: new Date().getTime(),
      });
      client.servers.set(ctx.guild.id, config);

      const path = `./tmp/${ctx.guild.id}_${new Date().getTime()}.txt`;
      require('fs').writeFileSync(path, m.map(me => `${require('moment-timezone')().tz(config.timezone).format('DD/MM/YYYY HH:mm:ss')} ${me.author.tag} (ID:${me.author.id}) - ${me.cleanContent}`).join('\r\n'));

      client.modUtil.Modlog(client, ctx.guild, `🗑 **${ctx.author.tag}** deleted ${m.size} messages in ${ctx.channel.toString()}.`, reason, [path]);
      ctx.channel.send(client.I18n.translate`✅ Deleted **${m.size}** messages!`);
    }).catch(() => ctx.channel.send(client.I18n.translate`❌ An unknown error occured while deleting messages! Try later.`));
  }
};

exports.conf = {
  name: 'clear',
  aliases: ['purge'],
  public: true,
  user_permission: 'MANAGE_MESSAGES',
  bot_permission: 'MANAGE_MESSAGES',
};
