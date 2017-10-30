exports.execute = async (client, ctx) => {
  const text = ctx.args.join(' ');

  if (text) {
    const feedbackChannel = client.channels.get('373425072477569025');
    if (feedbackChannel) {
      const { MessageEmbed } = require('discord.js');
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL())
        .setTimestamp(new Date())
        .setDescription(`Sent by **${ctx.author.username}** in #${ctx.channel.name} (ID:${ctx.channel.id}) on ${ctx.guild.name} (ID:${ctx.guild.id})\n\`\`\`${text}\`\`\``);
      feedbackChannel.send({ embed });
    }
  }
};

exports.conf = {
  name: 'feedback',
  aliases: ['issue', 'suggest', 'suggestion', 'report'],
  public: true,
};
