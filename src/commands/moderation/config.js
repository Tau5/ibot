exports.execute = async (client, ctx) => {
  const config = client.servers.get(ctx.guild.id);
  const type = ctx.args[0];
  const subType = ctx.args[1];
  const value = ctx.args.slice(2).join(' ');

  if (type === 'channel') {
    const validTypes = ['welcome', 'serverlog', 'modlog', 'phone'];
    if (validTypes.indexOf(subType) === -1) return ctx.channel.send(client.I18n.translate`❌ The channel type you provided isn't valid! It must be welcome, serverlog or modlog.`);

    /* CHANNELS FINDER */
    let channel;
    if (ctx.mentions.channels.size > 0) channel = ctx.mentions.channels.first();
    else {
      channel = client.findersUtil.findTextChannels(ctx.guild, value);
      if (channel.size === 0) return ctx.channel.send(client.I18n.translate`❌ No channel found matching \`${value}\`!`);
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
      if (channel.size === 0) return ctx.channel.send(client.I18n.translate`❌ No channel found matching \`${subType}\`!`);
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
  } else if (type === 'autorole') {
    const search = ctx.args.slice(1).join(' ');
    if (!search) return ctx.channel.send(client.I18n.translate`❌ You must specify a role to search!`);

    let role;
    if (ctx.mentions.roles.size > 0) role = ctx.mentions.roles.first();
    else {
      role = client.findersUtil.findRoles(ctx.guild, search);
      if (role.size === 0) return ctx.channel.send(client.I18n.translate`❌ No role found matching \`${search}\`!`);
      else role = role.first();
    }

    if (config.auto_role_join.indexOf(role.id) === -1) {
      config.auto_role_join.push(role.id);
      client.servers.set(ctx.guild.id, config);
      ctx.channel.send(client.I18n.translate`✅ Role **${role.name}** added!`);
    } else {
      config.auto_role_join.splice(config.auto_role_join.indexOf(role.id), 1);
      client.servers.set(ctx.guild.id, config);
      ctx.channel.send(client.I18n.translate`✅ Role **${role.name}** removed!`);
    }
  } else if (type === 'roleme') {
    const search = ctx.args.slice(1).join(' ');
    if (!search) return ctx.channel.send(client.I18n.translate`❌ You must specify a role to search!`);

    let role;
    if (ctx.mentions.roles.size > 0) role = ctx.mentions.roles.first();
    else {
      role = client.findersUtil.findRoles(ctx.guild, search);
      if (role.size === 0) return ctx.channel.send(client.I18n.translate`❌ No role found matching \`${search}\`!`);
      else role = role.first();
    }

    if (config.roleme.indexOf(role.id) === -1) {
      config.roleme.push(role.id);
      client.servers.set(ctx.guild.id, config);
      ctx.channel.send(client.I18n.translate`✅ Role **${role.name}** added!`);
    } else {
      config.roleme.splice(config.roleme.indexOf(role.id), 1);
      client.servers.set(ctx.guild.id, config);
      ctx.channel.send(client.I18n.translate`✅ Role **${role.name}** removed!`);
    }
  } else if (type === 'filter') {
    if (subType === 'action') {
      const validActions = ['BAN', 'KICK', 'DELETE'];
      let action = ctx.args[2];
      if (!action) return ctx.channel.send(client.I18n.translate`❌ You must specify an action to do!\n**Valid actions:** ${validActions.map(a => `\`${a}\``)}`);
      action = action.toUpperCase();
      config.action_bannedword = action;
      client.servers.set(ctx.guild.id, config);
      ctx.channel.send(client.I18n.translate`✅ Action \`${action}\` will now be executed when a banned word is detected.`);
    } else {
      const word = ctx.args.slice(1).join(' ');
      if (config.banned_words.indexOf(word) === -1) {
        config.banned_words.push(word);
        client.servers.set(ctx.guild.id, config);
        ctx.channel.send(client.I18n.translate`🤐 Messages containing \`${word}\` will now be \`${config.action_bannedword}\`!`);
      } else {
        config.banned_words.splice(config.banned_words.indexOf(word), 1);
        client.servers.set(ctx.guild.id, config);
        ctx.channel.send(client.I18n.translate`😮 Messages containing \`${word}\` won't trigger the filter anymore.`);
      }
    }
  } else if (type === 'phoneblacklist') {
    if (subType) {
      const number = subType;
      if (!client.numbers.has(number)) return ctx.channel.send(client.I18n.translate`❌ The number \`${number}\` is not assigned!`);
      if (config.blacklisted_numbers.indexOf(number) === -1) {
        config.blacklisted_numbers.push(number);
        client.servers.set(ctx.guild.id, config);
        ctx.channel.send(client.I18n.translate`✅ Number \`${number}\` added to the blacklist!`);
      } else {
        config.blacklisted_numbers.splice(config.blacklisted_numbers.indexOf(number), 1);
        client.servers.set(ctx.guild.id, config);
        ctx.channel.send(client.I18n.translate`✅ Number \`${number}\` removed from the blacklist!`);
      }
    }
  } else {
    const { MessageEmbed } = require('discord.js');
    const embed = new MessageEmbed()
      .addField(
        client.I18n.translate`Channels`,
        `**Welcome:** ${client.channels.has(config.channel_welcome) ? client.channels.get(config.channel_welcome).toString() : 'None'}\n
**Serverlog:** ${client.channels.has(config.channel_serverlog) ? client.channels.get(config.channel_serverlog).toString() : 'None'}\n
**Modlog:** ${client.channels.has(config.channel_modlog) ? client.channels.get(config.channel_modlog).toString() : 'None'}\n
**Phone:** ${client.channels.has(config.channel_phone) ? client.channels.get(config.channel_phone).toString() : 'None'}`,
        true,
      )
      .addField(
        client.I18n.translate`Switches`,
        `**Welcome:** ${config.switch_welcome === 0 ? 'Disabled' : 'Enabled'}\n
**Serverlog:** ${config.switch_serverlog === 0 ? 'Disabled' : 'Enabled'}\n
**Modlog:** ${config.switch_modlog === 0 ? 'Disabled' : 'Enabled'}\n
**Phonebook:** ${config.switch_phonebook === 0 ? 'Disabled' : 'Enabled'}`,
        true,
      )
      .addField(
        client.I18n.translate`Messages`,
        `**Welcome:** \`\`\`${config.message_welcome === 'NOT_SET' ? 'No message set' : config.message_welcome}\`\`\`\n
**Leaving:** \`\`\`${config.message_leaving === 'NOT_SET' ? 'No message set' : config.message_leaving}\`\`\``,
        true,
      )
      .addField(
        client.I18n.translate`Roleme list`,
        config.roleme.length === 0 ? 'None' : config.roleme.map(r => `\`${ctx.guild.roles.get(r).name}\``),
        true,
      )
      .addField(
        client.I18n.translate`Auto-role join`,
        config.auto_role_join.length === 0 ? 'None' : config.auto_role_join.map(r => `\`${ctx.guild.roles.get(r).name}\``),
        true,
      )
      .addField(
        client.I18n.translate`Phonebook blacklist`,
        config.blacklisted_numbers.length === 0 ? 'None' : config.blacklisted_numbers.map(m => `\`${m}\``),
        true,
      )
      .setColor(ctx.guild.me.displayHexColor)
      .setThumbnail(ctx.guild.iconURL({ format: 'png', size: 512 }));

    ctx.channel.send(`🛠 Configuration for **${ctx.guild.name}** :`, { embed });
  }
};

exports.conf = {
  name: 'config',
  aliases: [],
  public: true,
  user_permission: 'MANAGE_GUILD',
};
