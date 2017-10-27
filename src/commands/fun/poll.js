exports.execute = async (client, ctx) => {
  const flags = [
    {
      flag: '-t',
      name: 'time',
    },
    {
      flag: '-e',
      name: 'emotes',
    },
    {
      flag: '-c',
      name: 'color',
    },
  ];

  const args = ctx.args;

  /* let out = {
    _: [],
  };
  let currentFlag = '';
  for (let i = 0; i < args.length; i++) {
    let pFlag = true;
    if (args[i].startsWith('--')) {
      const parser = flags.filter(f => f.name === args[i].substring(2).toLowerCase());
      if (parser.length > 0) {
        currentFlag = parser[0].flag;
        out[currentFlag] = [];
        pFlag = false;
      }
    } else if (args[i].startsWith('-')) {
      const temp = args[i].substring(1);
      const parser = flags.map(f => f.flag);
      const oldFlag = currentFlag;
      const oldOutput = out;
      pFlag = false;

      for (const character of temp) {
        if (parser.indexOf(character) !== -1) {
          currentFlag = character;
          out[currentFlag] = [];
        } else {
          out = oldOutput;
          currentFlag = oldFlag;
          pFlag = true;
          break;
        }
      }
      if (pFlag) {
        if (currentFlag !== '') {
          out[currentFlag].push(args[i]);
        } else {
          if (args[i] === '') return;
          out._.push(args[i]);
        }
      }
    }
  } */

  const options = [];
  let finishedTitle = false;
  let title = '';
  for (const entry of args) {
    console.log('Processing... ' + entry);
    if (entry.startsWith('-')) {
      finishedTitle = true;
      const filter = flags.filter(f => f.flag === entry.substring(1).toLowerCase());
      if (filter.length > 0) {
        const current = filter[0].flag;
        options.push({
          flag: current,
        });
      } else {
        ctx.channel.send('Error!');
        break;
      }
    } else {
      if (options.length === 0 && finishedTitle === false) { // eslint-disable-line no-lonely-if
        if (title.length === 0) title = entry;
        else title += ` ${entry}`;
      } else {
        const index = options.length - 1;
        if (!options[index].value) {
          options[index].value = entry;
        } else {
          options[index].value += ` ${entry}`;
        }
      }
    }
  }

  console.log(title);
  console.log(options);
  const inspected = require('util').inspect(options);
  ctx.channel.send(inspected, { code: 'js' });
};

exports.conf = {
  name: 'poll',
  aliases: [],
  public: false,
};
