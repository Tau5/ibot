exports.execute = async (client, ctx) => {
  const search = ctx.args.join(' ');
  if (!search) return ctx.channel.send(client.I18n.translate`❌ You must include something to search!`);
  const query = encodeURIComponent(search);
  const request = require('request');

  request(`http://api.giphy.com/v1/gifs/search?q=${query}&api_key=${client.config.api.giphy}&limit=1`, (err, http, body) => {
    if (err && http.statusCode !== 200) throw err;

    body = JSON.parse(body);
    if (body.data.length === 0) return ctx.channel.send(client.I18n.translate`❌ No GIF found matching \`${search}\`!`);

    return ctx.channel.send(`<:giphy:350993483084988417> Service powered by Giphy\n${body.data[0].images.original.url}`);
  });
};

exports.conf = {
  name: 'giphy',
  aliases: ['gif'],
  public: true,
};
