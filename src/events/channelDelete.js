module.exports = async (client, channel) => {
  const config = client.servers.get(channel.guild.id);

  if (channel.id === config.channel_welcome) {
    config.channel_welcome = 'NOT_SET';
    config.switch_welcome = 0;
  }

  if (channel.id === config.channel_serverlog) {
    config.channel_serverlog = 'NOT_SET';
    config.switch_serverlog = 0;
  }

  if (channel.id === config.channel_modlog) {
    config.channel_modlog = 'NOT_SET';
    config.switch_modlog = 0;
  }

  client.servers.set(channel.guild.id);
};