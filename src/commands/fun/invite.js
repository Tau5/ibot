exports.execute = async (client, ctx) => {
  ctx.channel.send('👍 <https://discordapp.com/oauth2/authorize?client_id=305277118105911296&scope=bot&permissions=470150390>');
};

exports.conf = {
  name: 'invite',
  aliases: [],
  public: true,
};
