exports.execute = async (client, ctx) => {
  const config = client.servers.get(ctx.guild.id);

  if (client.calls[ctx.guild.id]) return ctx.channel.send(client.I18n.translate`❌ You are already in-call with someone!`);
  if (config.channel_phone !== ctx.channel.id) return ctx.channel.send(client.I18n.translate`❌ You are not in the phone channel!`);
  if (!client.numbers.findKey(k => k === ctx.guild.id)) return ctx.channel.send(client.I18n.translate`❌ This server does not have a phone number.`);

  const number = ctx.args.join(' ');
  if (!number) return ctx.channel.send(client.I18n.translate`❌ You must specify a number to call!`);

  if (client.numbers.has(number)) {
    const guildToCall = client.guilds.get(client.numbers.get(number));
    const distConfig = client.servers.get(guildToCall.id);
    if (ctx.guild.id === guildToCall.id) return ctx.channel.send(client.I18n.translate`❌ You cannot call your own number!`);
    if (!client.channels.has(distConfig.channel_phone)) return ctx.channel.send(client.I18n.translate`☎ Impossible to join \`${number}\` because their phone is not connected... (channel not set)`);
    if (client.calls[guildToCall.id]) return ctx.channel.send(client.I18n.translate`☎ Sounds like they're already in-call with someone!`);

    ctx.channel.send(client.I18n.translate`☎ Calling \`${number}\`...`);
    client.calls[ctx.guild.id] = {
      type: 0,
      state: 0,
      calling: number,
    };

    if (number === '1-000-000') {
      client.channels.get('375395137741783050').send(`☎ Support call | \`${client.numbers.findKey(k => k === ctx.guild.id)}\` | i:pickup to answer`);
    } else {
      client.I18n.use(distConfig.locale);
      client.channels.get(distConfig.channel_phone).send(client.I18n.translate`☎ You get a call from \`${client.numbers.findKey(k => k === ctx.guild.id)}\`! Use \`i:pickup\` to answer.`);
    }

    setTimeout(() => {
      if (client.calls[ctx.guild.id] && client.calls[ctx.guild.id].state === 0) {
        ctx.channel.send(client.I18n.translate`☎ No answer from \`${number}\`! Cancelling...`);
        delete client.calls[ctx.guild.id];
      }
    }, 30000);
  } else {
    ctx.channel.send(client.I18n.translate`☎ The provided number is not assigned!`);
  }
};

exports.conf = {
  name: 'call',
  aliases: [],
  public: true,
};
