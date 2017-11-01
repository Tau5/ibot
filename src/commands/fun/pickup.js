exports.execute = async (client, ctx) => {
  const config = client.servers.get(ctx.guild.id);

  if (client.calls[ctx.guild.id]) return ctx.channel.send(client.I18n.translate`❌ You are already in-call with someone!`);
  if (config.channel_phone !== ctx.channel.id) return ctx.channel.send(client.I18n.translate`❌ You are not in the phone channel!`);
  const number = client.numbers.get(ctx.guild.id);
  let caller;

  Object.keys(client.calls).forEach((id) => {
    if (client.calls[id].type === 0 && client.calls[id].state === 0 && client.calls[id].calling === ctx.guild.id) {
      caller = client.guilds.get(id);
    }
  });

  if (!caller) return ctx.channel.send(client.I18n.translate`☎ Nobody is calling you!`);
  client.calls[ctx.guild.id] = {
    type: 1,
    state: 1,
    calling: caller,
  };

  client.calls[caller.id] = {
    type: 0,
    state: 1,
    calling: number,
  };
};

exports.conf = {
  name: 'call',
  aliases: [],
  public: false,
};
