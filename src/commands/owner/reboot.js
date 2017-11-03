exports.execute = async (client, ctx) => {
  client.app.close(async () => {
    await ctx.channel.send('Rebooting...');
    await client.destroy();
    process.exit(1);
  });
};

exports.conf = {
  name: 'reboot',
  aliases: [],
  public: false,
};
