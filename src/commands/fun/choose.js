exports.execute = async (client, ctx) => {
  const choices = ctx.args;
  if (choices.length < 2) return ctx.channel.send(client.I18n.translate`❌ You must include two or more choices!`);
  const chosen = choices[Math.floor(Math.random() * choices.length)];

  ctx.channel.send(client.I18n.translate`🤔 Let me choose... **${chosen}**!`);
};

exports.conf = {
  name: 'choose',
  aliases: ['select'],
  public: true,
};
