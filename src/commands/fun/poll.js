exports.execute = async (client, ctx) => {
  const flags = [
    {
      flag: 't',
      name: 'time',
    },
    {
      flag: 'd',
      name: 'description',
    },
    {
      flag: 'c',
      name: 'color',
    },
  ];

  const args = ctx.args;

  const options = [];
  let finishedTitle = false;
  let title = '';
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('-')) {
      const filter = flags.filter(f => f.flag === args[i].substring(1).toLowerCase());
      if (filter.length > 0) {
        finishedTitle = true;
        const current = filter[0].flag;
        options.push({
          flag: current,
          value: '',
        });
      } else {
        if (finishedTitle === true) { // eslint-disable-line no-lonely-if
          ctx.channel.send(`❌ Unknown argument detected: ${args[i]}.`);
          break;
        }
      }
    } else {
      if (options.length === 0 && finishedTitle === false) { // eslint-disable-line no-lonely-if
        if (title.length === 0) title += args[i];
        else title += ` ${args[i]}`;
      } else {
        const index = options.length - 1;
        if (options[index].value.length === 0) {
          options[index].value = args[i];
        } else {
          options[index].value += ` ${args[i]}`;
        }
      }
    }
  }

  if (!title) return ctx.channel.send(client.I18n.translate`❌ You must put a title for your poll!`);

  const durationParser = require('parse-duration');
  const pollWillExpire = client.I18n.translate`The poll expires on `;
  let timeout = durationParser('60s');
  const emojis = ['👍', '👎'];

  const { MessageEmbed } = require('discord.js');
  const newPollEmbed = new MessageEmbed()
    .setTitle(title)
    .setAuthor(ctx.author.username, ctx.author.displayAvatarURL())
    .setTimestamp(new Date());

  for (const option of options) {
    if (option.flag === 't') {
      timeout = durationParser(option.value);
    }

    if (option.flag === 'd') {
      newPollEmbed.setDescription(option.value);
    }

    if (option.flag === 'c') {
      const color = option.value.toUpperCase();
      newPollEmbed.setColor(color);
    }
  }

  newPollEmbed.setFooter(`${pollWillExpire}${new Date(Date.now() + timeout).toISOString()}`);

  const msg = await ctx.channel.send({ embed: newPollEmbed });
  for (const emoji of emojis) { await msg.react(emoji); } // eslint-disable-line no-await-in-loop

  setTimeout(async () => {
    ctx.channel.messages.fetch(msg.id).then((newMsg) => {
      const bestVote = newMsg.reactions.sort((a, b) => b.users.size - a.users.size);
      if (bestVote.size === 0) return;

      let description = client.I18n.translate`${bestVote.first().emoji.toString()} won with ${bestVote.first().users.size - 1} votes!`;

      const ties = bestVote.filter(reaction => reaction.users.size === bestVote.first().users.size);
      if (ties.size > 1) {
        description = client.I18n.translate`It was a tie between ${ties.map(r => r.emoji.toString()).join(' - ')}! Each got ${bestVote.first().users.size - 1} votes.`;
      }

      const finishedPollEmbed = new MessageEmbed()
        .setTitle(title)
        .setColor(newMsg.embeds[0].hexColor)
        .setDescription(description)
        .setTimestamp(new Date())
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL());
      ctx.channel.send({ embed: finishedPollEmbed });
    }).catch(() => ctx.channel.send(client.I18n.translate`❌ Unable to display poll results! Poll message got deleted (ID:${msg.id})`));
  }, timeout);
};

exports.conf = {
  name: 'poll',
  aliases: [],
  public: true,
};
