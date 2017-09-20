exports.execute = async (client, ctx) => {
  ctx.channel.send(client.I18n.translate`📚 Commands list :\n\`\`\`${client.commands.filter(c => c.conf.public).keyArray().join(', ')}.\`\`\``);
};

exports.conf = {
  name: 'help',
  aliases: [],
  public: true,
};
