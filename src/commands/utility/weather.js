exports.execute = async (client, ctx) => {
  const location = encodeURIComponent(ctx.args.join(' '));
  if (!location) return ctx.channel.send(client.I18n.translate`❌ You must specify a city to look for!`);
  if (location.length > 1024) return ctx.channel.send(client.I18n.translate`❌ The city length may not exceed 1024 caracters.`);

  const request = require('request');
  request(`https://api.apixu.com/v1/forecast.json?key=${client.config.weather_api}&q=${location}`, (err, http, body) => {
    if (err && http.statusCode !== 200) throw err;

    const content = JSON.parse(body);
    if (content.error && content.error.code === 1006) return ctx.channel.send(client.I18n.translate`❌ The specified city was not found!`);

    const { MessageEmbed } = require('discord.js');
    const embed = new MessageEmbed()
      .addField(client.I18n.translate`Weather`, content.current.condition.text, true)
      .addField(client.I18n.translate`Miscallenous`, client.I18n.translate`**Clouds:** ${content.current.cloud}%`, true)
      .addField(client.I18n.translate`Temperatures`, client.I18n.translate`**Current:** ${content.current.temp_c}°C (${content.current.temp_f}°F)\n**Min:** ${content.forecast.forecastday[0].day.mintemp_c}°C (${content.forecast.forecastday[0].day.mintemp_f}°F) - **Max:** ${content.forecast.forecastday[0].day.maxtemp_c}°C (${content.forecast.forecastday[0].day.maxtemp_f}°F)`, true)
      .addField(client.I18n.translate`Daytime (UTC)`, client.I18n.translate`**Sunrise:** ${content.forecast.forecastday[0].astro.sunrise} - **Sunset:** ${content.forecast.forecastday[0].astro.sunset}`, true)
      .setColor(ctx.guild.me.displayHexColor)
      .setFooter(client.I18n.translate`All information provided by Apixu`, 'https://pbs.twimg.com/profile_images/761439376433971200/ljkftqN4.jpg')
      .setThumbnail(`https:${content.current.condition.icon}`);

    return ctx.channel.send(client.I18n.translate`☀ Weather for **${content.location.name}** (${content.location.region} - ${content.location.country}) :`, { embed });
  });
};

exports.conf = {
  name: 'weather',
  aliases: ['forecast'],
  public: true,
};
