const webUtil = {
  init(client) {
    const app = require('express')();

    const templates = '../web';

    app.get('/', (request, response) => {
      response.render(`${templates}/index.html`);
    });

    app.get('/server/:id', (request, response) => {
      if (!request.params.id) response.render(`${templates}/404.ejs`);
      const guild = client.guilds.get(request.params.id);
      if (!guild) response.render(`${templates}/404.ejs`);

      response.render(`${templates}/server.ejs`, { s: guild });
    });

    app.get('/servers', (request, response) => {
      response.render(`${templates}/servers.ejs`, { servers: client.guilds });
    });

    app.get('/lookup/:id', (request, response) => {
      if (!request.params.id) response.render(`${templates}/404.ejs`);
      else {
        client.users.fetch(request.params.id).then((user) => {
          response.render(`${templates}/lookup.ejs`, { user });
        }).catch((e) => {
          response.write(e);
          response.end();
        });
      }
    });

    app.listen(8080);
  },
};

module.exports = webUtil;
