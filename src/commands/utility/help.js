exports.execute = async (client, ctx) => {
  ctx.channel.send('🔗 https://github.com/iDroid27210/ibot/wiki/Commands');
};

exports.conf = {
  name: 'help',
  aliases: [],
  public: true,
};
