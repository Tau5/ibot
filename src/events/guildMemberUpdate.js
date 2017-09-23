module.exports = async (client, oldMember, newMember) => {
  const config = client.servers.get(oldMember.guild.id);
  client.I18n.use(config.locale);

  if (config.switch_serverlog === 0) return 1;

  if (oldMember.nickname !== newMember.nickname) {
    client.modUtil.Serverlog(client, oldMember.guild, client.I18n.translate`✏ **${oldMember.user.tag}**'s nickname changed from [${oldMember.nickname ? oldMember.nickname : 'None'}] to [${newMember.nickname ? newMember.nickname : 'None'}].`);
  }

  if (oldMember.user.avatar !== newMember.user.avatar) {
    const date = Date.now();
    const downloader = require('download-file');
    const paths = {
      image1: {
        directory: '../../tmp/',
        filename: `${date}_${oldMember.id}_old.jpg`,
      },
      image2: {
        directory: '../../tmp/',
        filename: `${date}_${oldMember.id}_new.jpg`,
      },
    };
    await downloader(oldMember.user.displayAvatarURL({ format: 'png', size: 512 }), paths.image1, err => console.error(err));
    await downloader(newMember.user.displayAvatarURL({ format: 'png', size: 512 }), paths.image2, err => console.error(err));

    const merger = require('merge-images');
    merger([
      { src: `../../tmp/${paths.image1.filename}`, x: 0, y: 0 },
      { src: `../../tmp/${paths.image2.filename}`, x: 512, y: 0 },
    ]).then((b64) => {
      client.modUtil.Serverlog(client, oldMember.guild, client.I18n.translate`🖼 **${oldMember.user.tag}** changed their avatar.`, { files:[b64] });
    }).catch(() => {});
  }
};
