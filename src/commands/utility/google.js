exports.execute = async (client, ctx) => {
  const search = ctx.args.join(' ');
  const query = encodeURIComponent(search);
  if (!search) return ctx.channel.send(client.I18n.translate`❌ You must include something to search!`);
  if (query.length > 1024) return ctx.channel.send(client.I18n.translate`❌ The city length may not exceed 1024 caracters.`);

  const request = require('request');
  request(`https://www.googleapis.com/customsearch/v1?key=${client.config.api.google}&cx=007191231086761736718:poe5qffl1uq&num=1&lr=lang_en&filter=0&fields=queries(request(totalResults,searchTerms)),items(title,snippet,link,pagemap(cse_image))&q=${query}`, (err, http, body) => {
    if (err && http.statusCode !== 200) throw err;
    const content = JSON.parse(body);

    if (!content.queries) return ctx.channel.send(client.I18n.translate`❌ An unknown error has occured with the Google API!`);
    if (content.queries.request[0].totalResults === '0') return ctx.channel.send(client.I18n.translate`❌ Google did not find anything matching \`${search}\`!`);

    let image = 'https://cdn.pixabay.com/photo/2015/12/11/11/43/google-1088004_960_720.png';
    if (content.items[0].pagemap) image = content.items[0].pagemap.cse_image[0].src;

    const { MessageEmbed } = require('discord.js');
    const embed = new MessageEmbed()
      .addField(client.I18n.translate`Title`, content.items[0].title)
      .addField(client.I18n.translate`Description`, content.items[0].snippet)
      .addField(client.I18n.translate`Link`, content.items[0].link)
      .setColor(ctx.guild.me.displayHexColor)
      .setThumbnail(image)
      .setFooter(client.I18n.translate`All information provided by Google Search API.`, 'https://cdn.pixabay.com/photo/2015/12/11/11/43/google-1088004_960_720.png');

    return ctx.channel.send(client.I18n.translate`<:google:328635570614173698> Result for \`${search}\` :`, { embed });
  });
};

exports.conf = {
  name: 'google',
  aliases: ['g'],
  public: true,
};
