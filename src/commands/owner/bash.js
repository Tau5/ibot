exports.execute = async (client, ctx) => { // eslint-disable-line consistent-return
  const code = ctx.args.join(' ');
  if (!code) return ctx.channel.send('❌ You must include a code!');

  const { exec } = require('child_process');
  exec(code, (err, stdout, stderr) => {
    if (err) ctx.channel.send(err, { code: 'xl' });
    if (stderr) ctx.channel.send(stderr, { code: 'xl' });
    if (stdout) ctx.channel.send(stdout, { code: 'xl' });
    if (!stderr && !stdout) ctx.channel.send('✅ Done (no output)');
  });
};

exports.conf = {
  name: 'bash',
  aliases: ['cmd'],
  public: false,
};
