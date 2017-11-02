exports.execute = async (client, ctx) => {
  const text = ctx.args.join(' ');
  if (!text) return ctx.channel.send('❌ The announcement cannot be empty.');
  if (text.length > 1024) return ctx.channel.send('❌ The announcement length cannot exceed 1024 characters.');

  client.numbers.filter(g => g !== '302208427797643266').forEach((guildID) => {
    const guild = client.guilds.get(guildID);
    const config = client.servers.get(guildID);
    const phoneChannel = guild.channels.get(config.channel_phone);
    if (phoneChannel) {
      const message = [
        '📡 This is an automatic announcement sent from the support (`1-000-000`).',
        `\`\`\`${text}\`\`\``,
        'ℹ The support is available at 1-000-000. Use it only when needed (help using iBot, reporting bugs, etc).',
      ];

      phoneChannel.send(message.join('\n'));
    }
  });

  ctx.channel.send('👌 Announcement sent!');
};

exports.conf = {
  name: 'phannounce',
  aliases: ['announcement'],
  public: false,
};
