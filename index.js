/* PROCESS */
process.on('uncaughtException', err => console.error(err));
process.on('unhandledRejection', err => console.error(err));

/* MODULES */
const Discord = require('discord.js');
const Enmap = require('enmap');
const { readdir } = require('fs');

/* CLIENT INITIALIZATION */
const client = new Discord.Client({
  disableEveryone: true,
  fetchAllMembers: true,
});
client.config = require('./src/config.json');
client.I18n = require('node-i18n');

client.languages = {};

/* CLEVERBOT */
client.cleverbot = true;
client.cs = {};

/* DATABASE */
client.servers = new Enmap({ name: 'servers', persistent: true });
client.tags = new Enmap({ name: 'tags', persistent: true });
client.lastactive = new Enmap({ name: 'lastactive', persistent: true });
client.afk = new Enmap();

/* COMMANDS */
client.commands = new Enmap();
client.aliases = new Enmap();

/* HANDLER */
// Helpers
readdir('./src/helpers/', (err, files) => {
  if (err) throw err;
  console.log(`[Helpers] Loading ${files.length} modules...`);

  files.forEach((f) => {
    const helper = require(`./src/helpers/${f}`);
    client[f.split('.')[0]] = helper;
  });
});

// Translations
readdir('./src/translations/', (err, files) => {
  if (err) throw err;
  console.log(`[Translations] Loading ${files.length} translations...`);

  files.forEach((f) => {
    const translation = require(`./src/translations/${f}`);
    client.languages[f.split('.')[0]] = translation;
  });

  client.I18n.init({ bundles: client.languages, defaultCurrency: 'EUR' });
});

// Commands
const categories = ['owner', 'moderation', 'utility', 'fun'];
categories.forEach((c) => {
  readdir(`./src/commands/${c}/`, (err, files) => {
    if (err) throw err;
    console.log(`[Commands] Loading ${files.length} commands...`);

    files.forEach((f) => {
      const command = require(`./src/commands/${c}/${f}`);
      client.commands.set(command.conf.name, command);
      command.conf.aliases.forEach(a => client.aliases.set(a, command.conf.name));
    });
  });
});

// Events
readdir('./src/events/', (err, files) => {
  if (err) throw err;
  console.log(`[Events] Loading ${files.length} events...`);

  files.forEach((f) => {
    const event = require(`./src/events/${f}`);
    const eventName = f.split('.')[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./src/events/${f}`)];
  });
});

// Login to Discord
client.login(client.config.token)
  .then(() => console.log('[Discord] Connected to the WebSocket!'))
  .catch(console.error);
