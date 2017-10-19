exports.execute = async (client, ctx) => {
  const action = ctx.args[0];
  const value = ctx.args.slice(1).join(' ');
  if (!action || !value) return ctx.channel.send('❌ You must put an action (game, status, etc) and a value to set!');

  if (action === 'game') {
    if (value.length > 32) return ctx.channel.send('❌ The game length may not exceed 32 caracters!');
    client.user.setActivity(value).then(() => ctx.channel.send('✅ Game changed successfully!'))
      .catch(e => ctx.channel.send(e, { code: 'js' }));
  } else if (action === 'status') {
    client.user.setStatus(value).then(() => ctx.channel.send('✅ Status changed successfully!'))
      .catch(e => ctx.channel.send(e, { code: 'js' }));
  } else if (action === 'blacklist') {
    const subAction = ctx.args[1];
    const id = ctx.args[2];
    const reason = ctx.args.slice(3).join(' ');
    if (subAction === 'guild') {
      if (!id) return ctx.channel.send('❌ Please specify a guild ID!');
      client.config.blacklist.guilds[id] = {
        reason,
        time: new Date().toUTCString(),
      };
      ctx.channel.send(`✅ Successfully blacklisted guild ID \`${id}\`!`);
    } else if (subAction === 'user') {
      if (!id) return ctx.channel.send('❌ Please specify a user ID!');
      client.config.blacklist.users[id] = {
        reason,
        time: new Date().toUTCString(),
      };
      ctx.channel.send(`✅ Successfully blacklisted user ID \`${id}\`!`);
    } else {
      ctx.channel.send('❌ Ur not iBot owner...');
    }
  } else if (action === 'shutdown') {
    await ctx.channel.send('💤 Goodbye!');
    client.destroy().then(() => process.exit());
  } else {
    ctx.channel.send('❌ You have enough knownledge to avoid the help!');
  }
};

exports.conf = {
  name: 'bot',
  aliases: [],
  public: false,
};
