module.exports = async (client, event) => {
  console.log(`[${require('moment-timezone')().tz('UTC').format('DD/MM/YYYY HH:mm:ss')}] [WS] Lost connection - Code: ${event.code}`);
};
