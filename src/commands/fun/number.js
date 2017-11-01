exports.execute = async (client, ctx) => {
  const config = client.servers.get(ctx.guild.id);
  if (config.channel_phone !== ctx.channel.id) return ctx.channel.send(client.I18n.translate`❌ You are not in the phone channel!`);
  if (!client.numbers.findKey(k => k === ctx.guild.id)) return ctx.channel.send(client.I18n.translate`❌ This server does not have a phone number.`);

  const number = client.numbers.findKey(k => k === ctx.guild.id);
  ctx.channel.send(`☎ \`${number}\``);
};

exports.conf = {
  name: 'number',
  aliases: [],
  public: true,
};
