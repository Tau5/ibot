exports.execute = async (client, ctx) => {
  const config = client.servers.get(ctx.guild.id);
  const type = ctx.args[0];
  const subType = ctx.args[1];
  const value = ctx.args.slice(2).join(' ');
  if ((!type || !subType) && type !== 'ignore') return ctx.channel.send(client.I18n.translate`❌ Syntax example: \`i:config channel welcome #my_channel\`.`);

  if (type === 'channel') {
    const validTypes = ['welcome', 'serverlog', 'modlog'];
    if (validTypes.indexOf(subType) === -1) return ctx.channel.send(client.I18n.translate`❌ The channel type you provided isn't valid! It must be welcome, serverlog or modlog.`);

    /* CHANNELS FINDER */
    let channel;
    if (ctx.mentions.channels.size > 0) channel = ctx.mentions.channels.first();
    else {
      channel = client.findersUtil.findTextChannels(ctx.guild, value);
      if (channel.size === 0) ctx.channel.send(client.I18n.translate`❌ No channel found matching \`${value}\`!`);
      else channel = channel.first();
    }

    config[`channel_${subType}`] = channel.id;
    client.servers.set(ctx.guild.id, config);

    ctx.channel.send(client.I18n.translate`✅ Channel \`${subType}\` set to ${channel.toString()}!`);
  } else if (type === 'message') {
    const validTypes = ['welcome', 'leaving'];
    if (validTypes.indexOf(subType) === -1) return ctx.channel.send(client.I18n.translate`❌ The message type you provided isn't valid! It must be welcome.`);
    if (value.length > 1500) return ctx.channel.send(client.I18n.translate`❌ The length of the value may not exceed 1500 caracters!`);

    config[`message_${subType}`] = value;
    client.servers.set(ctx.guild.id, config);

    ctx.channel.send(client.I18n.translate`✅ Message \`${subType}\` set to \`\`\`${value}\`\`\``);
  } else if (type === 'switch') {
    const validTypes = ['welcome', 'leaving', 'serverlog', 'modlog', 'clearbackup'];
    if (validTypes.indexOf(subType) === -1) return ctx.channel.send(client.I18n.translate`❌ The switch type you provided isn't valid! It must be welcome, serverlog, modlog or clearbackup.`);

    if (subType !== 'clearbackup' && !ctx.guild.channels.has(config[`channel_${subType}`])) return ctx.channel.send(client.I18n.translate`❌ Before switching it you must define its channel!`);

    const prop = config[`switch_${subType}`];
    if (prop === 0) {
      config[`switch_${subType}`] = 1;
      ctx.channel.send(client.I18n.translate`✅ Switch \`${subType}\` enabled!`);
    } else {
      config[`switch_${subType}`] = 0;
      ctx.channel.send(client.I18n.translate`✅ Switch \`${subType}\` disabled!`);
    }
    client.servers.set(ctx.guild.id, config);
  } else if (type === 'prefix') {
    const prefix = ctx.args[2];
    if (!subType || !prefix) return ctx.channel.send(client.I18n.translate`❌ You must put a prefix and a sub type! (example: \`i:config prefix add/remove //\`)`);
    if (subType === 'add') {
      if (config.custom_prefixes.includes(prefix)) return ctx.channel.send(client.I18n.translate`❌ The prefix \`${prefix}\` is already in the custom prefixes list!`);
      config.custom_prefixes.push(prefix);
      client.servers.set(ctx.guild.id, config);
      ctx.channel.send(client.I18n.translate`✅ Custom prefix \`${prefix}\` added!`);
    } else if (subType === 'remove') {
      if (!config.custom_prefixes.includes(prefix)) return ctx.channel.send(client.I18n.translate`❌ The prefix \`${prefix}\` is not in the custom prefixes list!`);
      config.custom_prefixes.splice(config.custom_prefixes.indexOf(prefix), 1);
      client.servers.set(ctx.guild.id, config);
      ctx.channel.send(client.I18n.translate`✅ Custom prefix \`${prefix}\` removed!`);
    }
  } else if (type === 'timezone') {
    if (require('moment-timezone').tz.names().indexOf(subType) === -1) return ctx.channel.send(client.I18n.translate`❌ Wrong timezone! See the dashboard for a full list of valid timezones.`);
    config.timezone = subType;
    client.servers.set(ctx.guild.id, config);
    ctx.channel.send(client.I18n.translate`✅ Timezone set to **${subType}**!\n*Note: if you have set a wrong timezone, the UTC time will be shown instead*`);
  } else if (type === 'locale') {
    const availableLanguages = Object.keys(client.languages);
    if (availableLanguages.indexOf(subType) === -1) return ctx.channel.send(client.I18n.translate`❌ \`${subType}\` is not a valid language or it has not been translated yet, be the first!`);
    config.locale = subType;
    client.servers.set(ctx.guild.id, config);
    client.I18n.use(config.locale);
    ctx.channel.send(client.I18n.translate`✅ Locale set to \`${config.locale}\`!`);
  } else if (type === 'ignore') {
    /* CHANNELS FINDER */
    let channel;
    if (ctx.mentions.channels.size > 0) channel = ctx.mentions.channels.first();
    else if (!subType) channel = ctx.channel;
    else {
      channel = client.findersUtil.findTextChannels(ctx.guild, subType);
      if (channel.size === 0) ctx.channel.send(client.I18n.translate`❌ No channel found matching \`${subType}\`!`);
      else channel = channel.first();
    }

    if (config.ignored_channels.indexOf(channel.id) === -1) {
      config.ignored_channels.push(channel.id);
      client.servers.set(ctx.guild.id, config);
      ctx.channel.send(client.I18n.translate`✅ ${channel.toString()} will now be ignored!`);
    } else {
      config.ignored_channels.splice(config.ignored_channels.indexOf(channel.id), 1);
      client.servers.set(ctx.guild.id, config);
      ctx.channel.send(client.I18n.translate`✅ ${channel.toString()} will now be listened!`);
    }
  }
};

exports.conf = {
  name: 'config',
  aliases: [],
  public: true,
  user_permission: 'MANAGE_GUILD',
};
