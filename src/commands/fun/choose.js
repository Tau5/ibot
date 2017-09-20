exports.execute = async (client, ctx) => {
  const choices = ctx.args;
  if (choices.length < 2) return ctx.channel.send(client.I18n.translate`❌ You must include two choices or more!`);

  ctx.channel.send(client.I18n.translate`🤔 Let me choose... **${choices[Math.random() * choices.length]}**!`);
};

exports.conf = {
  name: 'choose',
  aliases: ['select'],
  public: true,
};
