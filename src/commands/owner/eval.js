/* eslint-disable no-unused-vars */
exports.execute = async (client, ctx) => {
  const Discord = require('discord.js');
  const fs = require('fs');

  try {
    const code = ctx.args.join(' ');
    let evaled = await eval(code); // eslint-disable-line no-eval

    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
    evaled = evaled.replace(/client.token/g, 'TOKEN');

    if (evaled.length > 1900) return ctx.channel.send('❌ The output length exceeds 1024 caracters!');

    return ctx.channel.send(evaled, { code: 'js' });
  } catch (e) {
    return ctx.channel.send(e, { code: 'js' });
  }
};

exports.conf = {
  name: 'eval',
  aliases: [],
  public: false,
};
