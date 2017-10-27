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
  let out = {
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
          if (!out[currentFlag].raw) out[currentFlag].raw = [];
          out[currentFlag].raw.push(args.rawArgs[i]);
        } else {
          if (args[i] === '') return;
          out._.push(args[i]);
          out._.raw.push(args.rawArgs[i]);
        }
      }
    }
  }

  const inspected = require('util').inspect(out);
  ctx.channel.send(inspected, { code: 'js' });
};

exports.conf = {
  name: 'poll',
  aliases: [],
  public: false,
};
