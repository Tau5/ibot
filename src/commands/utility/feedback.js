exports.execute = async (client, ctx) => {
  const text = ctx.args.join(' ');

  if (text) {
    const feedbackChannel = client.channels.get('373425072477569025');
    if (feedbackChannel) {
      const colors = ['red', 'orange', 'blue', 'green', 'purple', 'yellow', 'brown', 'white', 'grey', 'black'];
      const { MessageEmbed } = require('discord.js');
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL())
        .setTimestamp(new Date())
        .setColor(colors[Math.floor(Math.random() * colors.length)])
        .setDescription(`Sent by **${ctx.author.username}** in **#${ctx.channel.name}** (ID:${ctx.channel.id}) on **${ctx.guild.name}** (ID:${ctx.guild.id})\n\`\`\`${text}\`\`\``);
      feedbackChannel.send({ embed });

      ctx.channel.send('👌');
    }
  }
};

exports.conf = {
  name: 'feedback',
  aliases: ['issue', 'suggest', 'suggestion', 'report'],
  public: true,
};
