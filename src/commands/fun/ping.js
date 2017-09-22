exports.execute = async (client, ctx) => {
  ctx.channel.send('Ping...').then(m => m.edit(`Pong! Discord API: **${Math.round(client.ping)}ms** - Local: **${(m.createdTimestamp - ctx.createdTimestamp)}ms**`));
};

exports.conf = {
  name: 'ping',
  aliases: [],
  public: true,
};
