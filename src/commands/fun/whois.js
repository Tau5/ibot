exports.execute = async (client, ctx) => {
  const numbers = client.numbers.keyArray();
  const guilds = client.numbers.array();
  const list = [];

  for (let i = 0; i < numbers.length; i++) {
    const config = client.servers.get(guilds[i]);
    if (config.switch_phonebook === 1) {
      list.push({
        name: client.guilds.get(guilds[i]).name,
        number: numbers[i],
      });
    }
  }

  const search = ctx.args.join(' ');
  if (!search) return ctx.channel.send(client.I18n.translate`❌ You must include something to search!`);

  if (search === 'switch' && ctx.member.hasPermission('MANAGE_GUILD')) {
    const config = client.servers.get(ctx.guild.id);
    if (config.switch_phonebook === 0) {
      config.switch_phonebook = 1;
      client.servers.set(ctx.guild.id, config);
      ctx.channel.send(client.I18n.translate`🔖 You will now appear on the phonebook.`);
    } else {
      config.switch_phonebook = 0;
      client.servers.set(ctx.guild.id, config);
      ctx.channel.send(client.I18n.translate`🔖 You won\'t appear on the phonebook anymore.`);
    }
  } else {
    const found = list.filter(entry => entry.name.toLowerCase().includes(search.toLowerCase()) || entry.number.includes(search));
    if (found.length === 0) return ctx.channel.send(client.I18n.translate`❌ Nothing found for \`${search}\`.`);

    const message = [];
    message.push(client.I18n.translate`🔖 Phonebook - Results for \`${search}\` :`);
    found.forEach((entry) => {
      message.push(`- **${entry.name}** : ${entry.number} (lang: ${client.servers.get(client.guilds.find('name', entry.name)).locale})`);
    });

    ctx.channel.send(message.join('\n'));
  }
};

exports.conf = {
  name: 'whois',
  aliases: ['phonebook', 'yellowpages'],
  public: true,
};
