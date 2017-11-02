exports.execute = async (client, ctx) => {
  const config = client.servers.get(ctx.guild.id);

  if (!client.calls[ctx.guild.id]) return ctx.channel.send(client.I18n.translate`❌ You are not in-call with someone!`);
  if (config.channel_phone !== ctx.channel.id) return ctx.channel.send(client.I18n.translate`❌ You are not in the phone channel!`);
  const number = client.numbers.findKey(k => k === ctx.guild.id);
  let caller;

  Object.keys(client.calls).forEach((id) => {
    if (client.calls[id].state === 1 && client.calls[id].calling === number) {
      caller = client.guilds.get(id);
    }
  });

  if (!caller) return ctx.channel.send(client.I18n.translate`☎ Nobody is calling you or the provided number is invalid!`);

  const nums = {
    sender: ((client.calls[ctx.guild.id].type === 0) ? client.calls[ctx.guild.id].calling : client.calls[caller.id].calling),
    receiver: ((client.calls[ctx.guild.id].type === 1) ? client.calls[ctx.guild.id].calling : client.calls[caller.id].calling),
  };

  require('fs').appendFile(`./logs/calls/${nums.sender}_${nums.receiver}.txt`, `[${require('moment-timezone')().tz('UTC').format('HH:mm:ss')}] - =====CONNECTION  ENDED=====\n\n`, () => {});

  delete client.calls[ctx.guild.id];
  delete client.calls[caller.id];

  ctx.channel.send(client.I18n.translate`☎ Connection terminated!`);

  client.I18n.use(client.servers.get(caller.id).locale);
  client.channels.get(client.servers.get(caller.id).channel_phone).send(client.I18n.translate`☎ Connection terminated!`);
};

exports.conf = {
  name: 'hangup',
  aliases: [],
  public: true,
};
