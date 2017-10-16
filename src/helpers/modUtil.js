const modUtils = {
  Serverlog(client, guild, message, options) {
    try {
      const config = client.servers.get(guild.id);
      if (config.switch_serverlog === 0) return;
      const channel = guild.channels.get(config.channel_serverlog);
      if (!channel) throw new Error('NO_SERVERLOG_CHANNEL');

      const msg = `\`[${require('moment-timezone')().tz(config.timezone).format('HH:mm:ss')}]\` ${message}`;
      channel.send(msg, options);
    } catch (e) {}
  },

  Modlog(client, guild, message, reason, attachments = []) {
    try {
      const config = client.servers.get(guild.id);
      if (config.switch_modlog === 0) return;
      const channel = guild.channels.get(config.channel_modlog);
      if (!channel) throw new Error('NO_MODLOG_CHANNEL');

      const msg = client.I18n.translate`\`[${require('moment-timezone')().tz(config.timezone).format('HH:mm:ss')}]\` \`[${config.moderation.length}]\` ${message}\n\`[ Reason ]\` ${reason}`;
      channel.send(msg, { files: attachments.map(v => v) });
    } catch (e) {}
  },
};

module.exports = modUtils;
