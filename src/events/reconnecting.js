module.exports = async () => {
  console.log(`[${require('moment-timezone')().tz('UTC').format('DD/MM/YYYY HH:mm:ss')}] [WS] Reconnecting...`);
};
