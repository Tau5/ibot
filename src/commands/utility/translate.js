exports.execute = async (client, ctx) => { // eslint-disable-line consistent-return
  const target = ctx.args[0];
  const text = ctx.args.slice(1).join(' ');
  if (!target || !text) return ctx.channel.send(client.I18n.translate`❌ You must specify a **target language** (ISO 639-1 format) and a **text to translate**.`);

  const translator = require('google-translate-api');
  translator(text, { to: target }).then((res) => {
    const { MessageEmbed } = require('discord.js');
    const embed = new MessageEmbed()
      .addField(client.I18n.translate`Original text (${res.from.language.iso})`, text)
      .addField(client.I18n.translate`Translated text (${target})`, res.text)
      .setColor(ctx.guild.me.displayHexColor)
      .setFooter(client.I18n.translate`All information provided by Google Translate API.`, 'https://lh3.googleusercontent.com/ZrNeuKthBirZN7rrXPN1JmUbaG8ICy3kZSHt-WgSnREsJzo2txzCzjIoChlevMIQEA=w300');

    ctx.channel.send(client.I18n.translate`<:translate:329193279595741185> Translation finished!`, { embed });
  }).catch(() => ctx.channel.send(client.I18n.translate`❌ An error occured while translating! Please check you are using a good language code.`));
};

exports.conf = {
  name: 'translate',
  aliases: [],
  public: true,
};
