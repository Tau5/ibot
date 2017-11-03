module.exports = (client) => {
  const express = require('express');
  const router = express.Router();

  router.post('/updateConfig', (req, res) => {
    if (req.isAuthenticated()) {
      req.body = JSON.parse(decodeURIComponent(Object.keys(req.body)[0]));
      const guild = client.guilds.get(req.body.guildID);
      if (!guild) return res.header('Access-Control-Allow-Origin', '*').status(404).json({ message: 'UNKNOWN_GUILD_ID' });

      if (!guild.members.get(req.user.id).hasPermission('MANAGE_GUILD') && req.user.id !== '205427654042583040') return res.header('Access-Control-Allow-Origin', '*').status(403).json({ message: 'UNAUTHORIZED' });

      const config = client.servers.get(req.body.guildID);
      const newConfig = {
        channel_welcome: req.body.channel_welcome,
        channel_serverlog: req.body.channel_serverlog,
        channel_modlog: req.body.channel_modlog,
        channel_phone: req.body.channel_phone,
        message_welcome: req.body.message_welcome === '' ? 'NOT_SET' : req.body.message_welcome,
        message_leaving: req.body.message_leaving === '' ? 'NOT_SET' : req.body.message_leaving,
        action_bannedword: config.action_bannedword,
        switch_welcome: ((req.body.channel_welcome !== 'NOT_SET' && req.body.message_welcome !== 'NOT_SET') ? parseInt(req.body.switch_welcome) : 0),
        switch_leaving: ((req.body.channel_welcome !== 'NOT_SET' && req.body.message_leaving !== 'NOT_SET') ? parseInt(req.body.switch_leaving) : 0),
        switch_serverlog: (req.body.channel_serverlog !== 'NOT_SET' ? parseInt(req.body.switch_serverlog) : 0),
        switch_modlog: (req.body.channel_modlog !== 'NOT_SET' ? parseInt(req.body.switch_modlog) : 0),
        switch_clearbackup: parseInt(req.body.switch_clearbackup),
        switch_phonebook: parseInt(req.body.switch_phonebook),
        roleme: config.roleme,
        custom_prefixes: config.custom_prefixes,
        moderation: config.moderation,
        imported_tags: config.imported_tags,
        ignored_channels: config.ignored_channels,
        banned_words: config.banned_words,
        timezone: req.body.timezone,
        locale: req.body.locale,
      };

      client.servers.set(req.body.guildID, newConfig);
      return res.header('Access-Control-Allow-Origin', '*').status(200).json({
        message: 'SUCCESS',
        config: newConfig,
      });
    } else {
      res.header('Access-Control-Allow-Origin', '*').status(401).json({
        message: 'NOT_LOGGED_IN',
      });
    }
  });

  router.post('/modAction', async (req, res) => {
    if (req.isAuthenticated()) {
      req.body = JSON.parse(decodeURIComponent(Object.keys(req.body)[0]));
      const guild = client.guilds.get(req.body.guildID);
      if (!guild) return res.header('Access-Control-Allow-Origin', '*').status(404).json({ message: 'UNKNOWN_GUILD_ID' });
      const author = guild.members.get(req.user.id);

      switch (req.body.actionToDo) {
        case 'ban':
          if (!author.hasPermission('BAN_MEMBERS')) return res.header('Access-Control-Allow-Origin', '*').status(403).json({ message: 'You do not have the permission to ban a member!' });
          break;
        case 'kick':
          if (!author.hasPermission('KICK_MEMBERS')) return res.header('Access-Control-Allow-Origin', '*').status(403).json({ message: 'You do not have the permission to kick a member!' });
          break;
        case 'warn':
          if (!author.hasPermission('KICK_MEMBERS')) return res.header('Access-Control-Allow-Origin', '*').status(403).json({ message: 'You do not have the permission to warn a member!' });
          break;
        case 'unwarn':
          if (!author.hasPermission('KICK_MEMBERS')) return res.header('Access-Control-Allow-Origin', '*').status(403).json({ message: 'You do not have the permission to unwarn a member!' });
          break;
        default:
          break;
      }

      let member = client.findersUtil.findMember(guild, req.body.user);
      if (member.size === 0) return res.header('Access-Control-Allow-Origin', '*').status(404).json({ message: 'The specified user was not found!' });
      else if (member.size > 1) return res.header('Access-Control-Allow-Origin', '*').status(696).json({ message: client.findersUtil.formatMembers(client, member) });
      else member = member.first();

      if (req.body.actionToDo === 'ban') {
        member.ban(req.body.reason).then(() => {
          client.modUtil.Modlog(client, guild, `🔨 **${author.user.tag}** banned **${member.user.tag}** (ID:${member.id}).`, req.body.reason);
          return res.header('Access-Control-Allow-Origin', '*').status(200).json({ message: `🔨 <b>${member.user.tag}</b> has been banned for ${req.body.reason} successfully!` });
        }).catch(e => res.header('Access-Control-Allow-Origin', '*').status(500).json({ message: e }));
      } else if (req.body.actionToDo === 'kick') {
        member.kick(req.body.reason).then(() => {
          client.modUtil.Modlog(client, guild, `👢 **${author.user.tag}** kicked **${member.user.tag}** (ID:${member.id}).`, req.body.reason);
          return res.header('Access-Control-Allow-Origin', '*').status(200).json({ message: `👢 <b>${member.user.tag}</b> has been kicked for ${req.body.reason} successfully!` });
        }).catch(e => res.header('Access-Control-Allow-Origin', '*').status(500).json({ message: e }));
      }
    } else {
      res.header('Access-Control-Allow-Origin', '*').status(401).json({
        message: 'NOT_LOGGED_IN',
      });
    }
  });

  router.post('/requestNumber', async (req, res) => {
    if (req.isAuthenticated()) {
      req.body = JSON.parse(decodeURIComponent(Object.keys(req.body)[0]));
      const guild = client.guilds.get(req.body.guildID);
      if (!guild) return res.header('Access-Control-Allow-Origin', '*').status(404).json({ message: 'UNKNOWN_GUILD_ID' });

      const number = client.numbers.find(id => id === guild.id);
      if (!number) {
        const random = Math.random().toString();
        const generated = `1-${random[2]}${random[4]}${random[3]}-${random[5]}${random[7]}${random[6]}`;
        if (client.numbers.has(generated)) return res.header('Access-Control-Allow-Origin', '*').status(500).json({ message: 'The generated number is already owned! Please refresh and retry requesting a number.' });
        client.numbers.set(generated, guild.id);

        res.header('Access-Control-Allow-Origin', '*').status(200).json({ number: generated });
      }
    } else {
      res.header('Access-Control-Allow-Origin', '*').status(401).json({
        message: 'NOT_LOGGED_IN',
      });
    }
  });

  return router;
};
