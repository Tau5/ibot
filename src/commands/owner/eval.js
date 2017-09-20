exports.execute = async (client, ctx) => {
  try {
    const code = ctx.args.join(' ');
    let evaled = await eval(code); // eslint-disable-line no-eval

    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
    evaled = evaled.replace(/client.token/g, 'TOKEN');

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
