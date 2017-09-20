exports.execute = async (client, ctx) => { // eslint-disable-line consistent-return
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
