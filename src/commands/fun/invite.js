exports.execute = async (client, ctx) => {
  ctx.channel.send('👍 <https://ibot.idroid.me> => Login => Invite');
};

exports.conf = {
  name: 'invite',
  aliases: [],
  public: true,
};
