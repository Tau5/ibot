exports.execute = async (client, ctx) => {
  let afk = ctx.args.join(' ');
  if (!afk) afk = client.I18n.translate`No reason`;

  client.afk.set(ctx.author.id, afk);
  ctx.channel.send(client.I18n.translate`👌 You're now **AFK**! See you soon™.`);
};

exports.conf = {
  name: 'afk',
  aliases: [],
  public: true,
};
