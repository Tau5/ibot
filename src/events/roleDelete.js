module.exports = async (client, role) => {
  const config = client.servers.get(role.guild.id);

  if (config.auto_role_join.indexOf(role.id) !== -1) {
    config.auto_role_join.splice(config.auto_role_join.indexOf(role.id), 1);
  }

  if (config.roleme.indexOf(role.id) !== -1) {
    config.roleme.splice(config.roleme.indexOf(role.id), 1);
  }

  client.servers.set(role.guild.id, config);
};
