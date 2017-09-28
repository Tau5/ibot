exports.execute = async (client, ctx) => {
  /* const choices = ctx.args;
  if (choices.length < 2) return ctx.channel.send(client.I18n.translate`❌ You must include two choices or more!`);
  const chosen = choices[Math.random() * choices.length];

  ctx.channel.send(client.I18n.translate`🤔 Let me choose... **${chosen}**!`); */

  ctx.channel.send('❌ Command disabled due to some weird bugs... Sorry!');
};

exports.conf = {
  name: 'choose',
  aliases: ['select'],
  public: true,
};
