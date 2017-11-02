exports.execute = async (client, ctx) => {
  const config = client.servers.get(ctx.guild.id);

  if (client.calls[ctx.guild.id]) return ctx.channel.send(client.I18n.translate`❌ You are already in-call with someone!`);
  if (config.channel_phone !== ctx.channel.id) return ctx.channel.send(client.I18n.translate`❌ You are not in the phone channel!`);
  const number = client.numbers.findKey(k => k === ctx.guild.id);
  let caller;

  const calls = Object.keys(client.calls);
  if (calls.filter(c => client.calls[c].calling === number).length > 1 && !ctx.args[0]) return ctx.channel.send(client.I18n.translate`❌ You have ${calls.filter(c => client.calls[c].calling === number).length} who are trying to call you. Please select one using \`i:pickup [number]\`.`);

  calls.forEach((id) => {
    if (client.calls[id].type === 0 && client.calls[id].state === 0 && client.calls[id].calling === number) {
      if (ctx.args[0]) {
        if (client.numbers.findKey(k => k === id) === ctx.args[0]) caller = client.guilds.get(id);
      } else {
        caller = client.guilds.get(id);
      }
    }
  });

  if (!caller) return ctx.channel.send(client.I18n.translate`☎ Nobody is calling you or the provided number is invalid!`);
  client.calls[ctx.guild.id] = {
    type: 1,
    state: 1,
    calling: client.numbers.findKey(k => k === caller.id),
  };

  client.calls[caller.id] = {
    type: 0,
    state: 1,
    calling: number,
  };

  const nums = {
    sender: ((client.calls[ctx.guild.id].type === 0) ? client.calls[ctx.guild.id].calling : client.calls[caller.id].calling),
    receiver: ((client.calls[ctx.guild.id].type === 1) ? client.calls[ctx.guild.id].calling : client.calls[caller.id].calling),
  };

  require('fs').appendFile(`./logs/calls/${nums.sender}_${nums.receiver}.txt`, `[${require('moment-timezone')().tz('UTC').format('HH:mm:ss')}] - ======CONNECTION MADE======\n`, () => {});

  ctx.channel.send(client.I18n.translate`☎ Connection made. Say hello!`);

  const distConf = client.servers.get(caller.id);
  client.I18n.use(distConf.locale);
  client.channels.get(distConf.channel_phone).send(client.I18n.translate`☎ They picked-up the phone. Say hello!`);
};

exports.conf = {
  name: 'pickup',
  aliases: [],
  public: true,
};
