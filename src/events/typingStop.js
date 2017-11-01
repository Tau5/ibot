module.exports = async (client) => {
  Object.keys(client.calls).forEach((id) => {
    const callObj = client.calls[id];
    if (callObj.state === 1) {
      const callingGuild = client.guilds.get(client.numbers.get(callObj.calling));
      const phoneChannel = client.channels.get(client.servers.get(callingGuild.id).channel_phone);
      if (!client.user.typingIn(phoneChannel)) return;
      phoneChannel.stopTyping(true);
    }
  });
};
