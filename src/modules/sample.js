const Discord = require("discord.js");

module.exports = function(bot) {
  bot.sampleplayer = {
    sampleplay: function(message) {
      const sampleName = message.args[0];
    }
  };
};
