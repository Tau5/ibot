exports.execute = async (client, ctx) => {
  const Discord = require('discord.js');
  const fs = require('fs');

  try {
    const code = ctx.args.join(' ');
    let evaled = await eval(code);

    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
    evaled = evaled.replace(new RegExp(client.token, 'g'), 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');

    if (evaled.length > 1900) return ctx.channel.send('❌ The output length exceeds Kyle2000 characters!');

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
