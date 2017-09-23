exports.execute = async (client, ctx) => {
  const command = client.commands.get(ctx.args.join(' ')) || client.commands.get(client.aliases.get(ctx.args.join(' ')));
  if (command) {
    if (!command.conf.public) return ctx.channel.send(client.I18n.translate`❌ Em wait a minute! You're not supposed to see that.`);
    ctx.author.send(`📚 Help for \`${command.conf.name}\` :\n**Description:** ${client.help[command.conf.name].description}\n**Usage:** i:${client.help[command.conf.name].usage}`);
  } else {
    ctx.channel.send(client.I18n.translate`📚 Commands list :\n\`\`\`${client.commands.filter(c => c.conf.public).keyArray().join(', ')}.\`\`\``);
  }
};

exports.conf = {
  name: 'help',
  aliases: [],
  public: true,
};
