const modUtils = {
  Serverlog(client, guild, message, options) {
    const config = client.servers.get(guild.id);
    if (config.switch_serverlog === 0) return;
    const channel = guild.channels.get(config.channel_serverlog);
    if (!channel) throw new Error('NO_SERVERLOG_CHANNEL');

    let time = require('moment-timezone')().tz('UTC').format('HH:mm:ss');
    if (config.timezone.includes('UTC+') || config.timezone.includes('UTC-') || (!config.timezone.includes('Europe/')
      && !config.timezone.includes('America/')
      && !config.timezone.includes('Oceania/')
      && !config.timezone.includes('Africa/')
      && !config.timezone.includes('Asia/'))) {

      time = require('moment-timezone')().tz(config.timezone).format('HH:mm:ss');
    }

    const msg = `\`[${time}]\` ${message}`;
    channel.send(msg, options);
  },

  Modlog(client, guild, message, reason, attachments = []) {
    const config = client.servers.get(guild.id);
    if (config.switch_modlog === 0) return;
    const channel = guild.channels.get(config.channel_modlog);
    if (!channel) throw new Error('NO_MODLOG_CHANNEL');

    let time = require('moment-timezone')().tz('UTC').format('HH:mm:ss');
    if (config.timezone.includes('UTC+') || config.timezone.includes('UTC-') || (!config.timezone.includes('Europe/')
      && !config.timezone.includes('America/')
      && !config.timezone.includes('Oceania/')
      && !config.timezone.includes('Africa/')
      && !config.timezone.includes('Asia/'))) {

      time = require('moment-timezone')().tz(config.timezone).format('HH:mm:ss');
    }

    const msg = client.I18n.translate`\`[${time}]\` \`[${config.moderation.length}]\` ${message}\n\`[ Reason ]\` ${reason}`;
    channel.send(msg, { files: attachments.map(v => v) });
  },
};

module.exports = modUtils;
