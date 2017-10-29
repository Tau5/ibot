exports.execute = async (client, ctx) => {
  ctx.channel.send('💻 https://ibot.idroid.me');
};

exports.conf = {
  name: 'website',
  aliases: [],
  public: true,
};
