exports.execute = async (client, ctx) => {
  const text = ctx.args.join(' ');
  let messageToSend;

  if (text) {
    if (text.includes('@everyone') || text.includes('@here')) return ctx.channel.send(client.I18n.translate`❌ Please do not mention @everyone or @here through the bot!`);
    if (ctx.mentions.users.size > 0) return ctx.channel.send(client.I18n.translate`❌ Please do not mention anyone through the bot!`);
    messageToSend = text;
  } else {
    messageToSend = client.I18n.translate`❌ You have missing arguments! You must include text to repeat.`;
  }

  return ctx.channel.send(messageToSend);
};

exports.conf = {
  name: 'say',
  aliases: [],
  public: true,
};
