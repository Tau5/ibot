exports.execute = async (client, ctx) => { // eslint-disable-line consistent-return
  const first = ctx.args[0];

  if (first === 'create') {
    const tagName = ctx.args[1];
    const tagContent = ctx.args.slice(2).join(' ');
    if (!tagName || !tagContent) return ctx.channel.send(client.I18n.translate`❌ To create a tag you must put its name and its content!`);
    if (client.tags.has(tagName)) return ctx.channel.send(client.I18n.translate`❌ The tag \`${tagName}\` already exist!`);

    const tag = {
      content: tagContent,
      creation: new Date().toUTCString(),
      author: ctx.author.id,
    };
    client.tags.set(tagName, tag);

    ctx.channel.send(client.I18n.translate`✍ Tag \`${tagName}\` created!`);
  } else if (first === 'delete') {
    const tagName = ctx.args[1];
    if (!tagName) return ctx.channel.send(client.I18n.translate`❌ To delete a tag you must put its name!`);
    const tag = client.tags.get(tagName);
    if (!tag) return ctx.channel.send(client.I18n.translate`❌ The tag \`${tagName}\` does not exist!`);
    if (tag.author !== ctx.author.id && ctx.author.id !== client.config.ownerId) return ctx.channel.send(client.I18n.translate`❌ You cannot delete a tag you don't own!`);

    client.tags.delete(tagName);
    ctx.channel.send(client.I18n.translate`✍ Tag \`${tagName}\` deleted!`);
  } else if (first === 'owner') {
    const tagName = ctx.args[1];
    if (!tagName) return ctx.channel.send(client.I18n.translate`❌ To know who made a tag you must put its name!`);
    const tag = client.tags.get(tagName);
    const author = await client.users.fetch(tag.author);
    ctx.channel.send(client.I18n.translate`✍ **${author.tag}** made the tag \`${tagName}\`.`);
  } else if (first === 'import') {
    if (!ctx.member.hasPermission('MANAGE_GUILD')) return ctx.channel.send(client.I18n.translate`❌ You must have the \`MANAGE_GUILD\` permission to import a tag as a command!`);
    const tagName = ctx.args[1];
    if (!tagName) return ctx.channel.send(client.I18n.translate`❌ To import a tag you must put its name!`);
    if (!client.tags.has(tagName)) return ctx.channel.send(client.I18n.translate`❌ The tag \`${tagName}\` does not exist!`);
    const config = client.servers.get(ctx.guild.id);
    if (config.imported_tags.indexOf(tagName) === -1) {
      config.imported_tags.push(tagName);
      ctx.channel.send(client.I18n.translate`✍ Tag \`${tagName}\` imported as a custom command!`);
    } else {
      config.imported_tags.splice(config.imported_tags.indexOf(tagName), 1);
      ctx.channel.send(client.I18n.translate`✍ Tag \`${tagName}\` removed from imported tags!`);
    }
  } else if (first === 'list') {
    /* MEMBERS FINDER */
    const search = ctx.args.join(' ');
    let { member } = ctx;
    if (ctx.mentions.members.size > 0) member = ctx.mentions.members.first();
    else if (search) {
      member = client.findersUtil.findMember(ctx.guild, search);
      if (member.size === 0) return ctx.channel.send(client.I18n.translate`❌ Nobody found matching \`${search}\`!`);
      else if (member.size === 1) member = member.first();
      else return ctx.channel.send(client.findersUtil.formatMembers(client, member));
    }

    const filtered = client.tags.filter(t => t.author === member.id);
    if (filtered.size === 0) ctx.channel.send(client.I18n.translate`✍ **${member.user.tag}** does not have created any tag!`);
    else ctx.channel.send(client.I18n.translate`✍ Tags made by **${member.user.tag}** :\n${filtered.keyArray().map(t => `\`${t}\``).join(', ')}.`);
  } else {
    const tagName = ctx.args[0];
    const args = ctx.args.slice(1).join(' ');
    if (!tagName) return ctx.channel.send(client.I18n.translate`❌ You must put a tag name!`);
    const tag = client.tags.get(tagName);
    if (!tag) return ctx.channel.send(client.I18n.translate`❌ The tag \`${tagName}\` does not exist!`);

    const content = tag.content
      .replace(/{args}/g, args)
      .replace(/{randomuser}/g, ctx.guild.members.random().user.username)
      .replace(/{range1-100}/g, Math.floor(Math.random() * 1000))
      .replace(/{guildname}/g, ctx.guild.name)
      .replace(/{guildcount}/g, ctx.guild.memberCount);
    ctx.channel.send(content);
  }
};

exports.conf = {
  name: 'tag',
  aliases: ['t'],
  public: true,
};
