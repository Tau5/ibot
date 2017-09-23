exports.execute = async (client, ctx) => {
  const location = encodeURIComponent(ctx.args.join(' '));
  if (!location) return ctx.channel.send(client.I18n.translate`❌ You must specify a city to look for!`);
  if (location.length > 1024) return ctx.channel.send(client.I18n.translate`❌ The city length may not exceed 1024 caracters.`);

  const request = require('request');
  request(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${client.config.weather_api}&units=metric`, (err, http, body) => {
    if (err && http.statusCode !== 200) throw err;

    const content = JSON.parse(body);
    if (content.cod !== 200) return ctx.channel.send(client.I18n.translate`❌ The specified city was not found!`);

    const sunset = new Date(content.sys.sunset * 1000);
    const sunrise = new Date(content.sys.sunrise * 1000);

    const { MessageEmbed } = require('discord.js');
    const embed = new MessageEmbed()
      .addField(client.I18n.translate`Weather`, `${content.weather[0].main}\n(${content.weather[0].description})`, true)
      .addField(client.I18n.translate`Miscallenous`, client.I18n.translate`**Clouds:** ${content.clouds.all}%`, true)
      .addField(client.I18n.translate`Temperatures`, client.I18n.translate`**Current:** ${content.main.temp}°C\n**Min:** ${content.main.temp_min}°C - **Max:** ${content.main.temp_max}°C`, true)
      .addField(client.I18n.translate`Daytime (UTC)`, client.I18n.translate`**Sunrise:** ${sunrise.getUTCHours()}:${sunrise.getUTCMinutes()} - **Sunset:** ${sunset.getUTCHours()}:${sunset.getUTCMinutes()}`, true)
      .setColor(ctx.guild.me.displayHexColor)
      .setFooter(client.I18n.translate`All information provided by Open Weather Map`, 'https://upload.wikimedia.org/wikipedia/commons/1/15/OpenWeatherMap_logo.png')
      .setThumbnail(`https://persoidroid.000webhostapp.com/img/${content.weather[0].icon}.png`);

    return ctx.channel.send(client.I18n.translate`☀ Weather for **${content.name}** (${content.sys.country}) :`, { embed });
  });
};

exports.conf = {
  name: 'weather',
  aliases: ['forecast'],
  public: true,
};
