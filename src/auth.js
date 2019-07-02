module.exports = {
  connect: function() {
    return bot.client.login(require("../config.js").tokens.discordToken);
  },
  disconnect: function() {
    return bot.client.destroy();
  }
};
