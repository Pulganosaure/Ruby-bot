//const discordToken = require("../../config").discordToken;
module.exports = function(bot) {
  bot.admin = {
    check_ConnectedServers: message => {
      let server_list = [];
      bot.client.guilds.map(server => {
        server_list.push(server.name);
      });
      message.reply(
        "total :" + server_list.length + "\n" + server_list.join(", ")
      );
    },
    disconnect: message => {
      message.reply("Stopping bot process...");
      bot.client.destroy();
    },
    restart: message => {
      message.reply("Restarting bot process...");
      bot.client.destroy();
      //bot.client.login(discordToken.token);
    }
  };
};
