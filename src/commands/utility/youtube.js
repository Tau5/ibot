exports.execute = async (client, ctx) => {
  const search = ctx.args.join(' ');
  const query = encodeURIComponent(search);
  if (!search) return ctx.channel.send(client.I18n.translate`❌ You must search something!`);
  if (query.length > 1024) return ctx.channel.send(client.I18n.translate`❌ The query length may not exceed 1024 caracters.`);

  const request = require('request');
  request(`https://www.googleapis.com/youtube/v3/search?part=snippet&regionCode=GB&maxResults=1&q=${query}&key=${client.config.youtube_api}`, (err, http, body) => {
    if (err && http.statusCode !== 200) throw err;
    const content = JSON.parse(body);

    if (content.items === undefined) return ctx.channel.send(client.I18n.translate`❌ An unknown error has occured!`);
    if (content.pageInfo.totalResults === 0) return ctx.channel.send(client.I18n.translate`❌ No result matching \`${search}\`!`);

    let result;
    if (content.items[0].id.kind === 'youtube#channel') result = `📺 https://www.youtube.com/channel/${content.items[0].id.channelId}`;
    else if (content.items[0].id.kind === 'youtube#playlist') result = `📁 https://www.youtube.com/playlist?list=${content.items[0].id.playlistId}`;
    else if (content.items[0].id.kind === 'youtube#video') {
      if (content.items[0].snippet.liveBroadcastContent === 'live') result = `🔴 https://www.youtube.com/watch?v=${content.items[0].id.videoId}`;
      else result = `📹 https://www.youtube.com/watch?v=${content.items[0].id.videoId}`;
    }

    return ctx.channel.send(client.I18n.translate`<:youtube:328635613861380106> Result for \`${search}\` :\n${result}`);
  });
};

exports.conf = {
  name: 'youtube',
  aliases: [],
  public: true,
};
