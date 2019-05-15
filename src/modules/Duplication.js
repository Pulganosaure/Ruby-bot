module.exports = function(bot) {
  bot.duplication = {
    clone: message => {
      message.args[0] = "315446311157497856";
      currentServer = bot.client.guilds.get(message.args[0]);
      targetServer = message.guild;
      fetchRoles(currentServer, targetServer);
      //fetchChannels(currentServer, targetServer);
    }
  };
};

function fetchRoles(currentServer, targetServer) {
  console.log(currentServer.roles.size);
  currentServer.roles.delete(currentServer.roles.firstKey(1)[0]);
  console.log(currentServer.roles.size);

  currentServer.roles.map(role => {
    console.log(role);
    return;
    if (fetchPresentRole(targetServer.roles, role)) {
      console.log("create role" + role.name);
      console.log(role.name);
      //targetServer.createRole(role).catch(err => console.log);
    } else {
      console.log("role already present");
    }
  });
}

function fetchPresentRole(roleList, role) {
  const rolekeys = roleList.keyArray();
  for (let i = 0; i < rolekeys.length; i++) {
    console.log(roleList.get(roleList[i])["name"] + " | " + role.name);
    if (roleList.get(roleList[i])["name"] == role.name) return true;
  }
  return false;
}
function fetchChannels(currentServer, targetServer) {
  currentServer.channels.map(channel => {
    if (!targetServer.channels.has(channel))
      targetServer
        .createChannel(channel.name, channel.type, channel.permissionOverwrites)
        .catch(err => console.log);
  });
}
