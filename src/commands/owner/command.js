/* eslint-disable consistent-return */
exports.execute = async (client, ctx) => {
  const fs = require('fs');
  const action = ctx.args[0];
  const category = ctx.args[1];
  const command = ctx.args[2];
  if (!action || !command) return;

  if (action === 'load') {
    if (client.commands.has(command)) return ctx.channel.send(`❌ The command \`${command}\` is already loaded!`);
    if (!fs.existsSync(`./${command}.js`)) return ctx.channel.send('❌ The file was not found!');

    try {
      const cmd = require(`../${category}/${command}.js`);
      client.commands.set(cmd.conf.name, cmd);
      cmd.conf.aliases.forEach(a => client.aliases.set(a, cmd.conf.name));
      ctx.channel.send('✅ Loaded!');
    } catch (e) {
      ctx.channel.send(`❌ An error has occured while loading the command!\n\`\`\`js\n${e}\`\`\``);
    }
  } else if (action === 'reload') {
    if (!client.commands.has(command)) return ctx.channel.send(`❌ The command \`${command}\` is not loaded!`);

    client.commands.delete(command);
    client.aliases.filter(a => command === a).forEach((a, index) => client.aliases.delete(index));
    delete require.cache[require.resolve(`./${command}.js`)];

    try {
      const cmd = require(`../${category}/${command}.js`);
      client.commands.set(cmd.conf.name, cmd);
      cmd.conf.aliases.forEach(a => client.aliases.set(a, cmd.conf.name));
      ctx.channel.send('✅ Reloaded!');
    } catch (e) {
      ctx.channel.send(`❌ An error has occured while loading the command!\n\`\`\`js\n${e}\`\`\``);
    }
  } else if (action === 'unload') {
    if (!client.commands.has(command)) return ctx.channel.send(`❌ The command \`${command}\` is not loaded!`);

    client.commands.delete(command);
    client.aliases.filter(a => command === a).forEach((a, index) => client.aliases.delete(index));
    delete require.cache[require.resolve(`../${category}/${command}.js`)];

    ctx.channel.send('✅ Unloaded!');
  }
};

exports.conf = {
  name: 'command',
  aliases: [],
  public: true,
};
