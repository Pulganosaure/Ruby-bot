const Event = require("../models/EventModel.js");
const User = require("../models/User.js");
const Discord = require("discord.js");
const ytdl = require("ytdl-core");

module.exports = function(bot) {
  bot.voice = {
    play: message => {
      if (message.member.voiceChannelID !== "") {
        bot.client.channels
          .get(message.member.voiceChannelID)
          .join()
          .then(function(connection) {
            stream = ytdl(message.args[0], { audioonly: true });
            stream.on("error", function() {
              message.reply("Impossible de lire cette vidéo ");
              connection.disconnect();
            });
            connection
              .playStream(stream, { seek: 0, volume: 0.4 })
              .on("end", function() {
                setTimeout(function(isplaying) {
                  if (!isplaying) connection.disconnect();
                }, 300);
              });
          })
          .catch(err => console.log(err));
      } else {
        message.reply("Please Join vocal channel first");
      }
    },
    pause: message => {
      message.guild.voiceConnection.dispatcher.pause();
    },
    resume: message => {
      message.guild.voiceConnection.dispatcher.resume();
    },
    volume: message => {
      if (!isNaN(message.args[0])) {
        volume = message.args[0] / 100;
        if (volume > 100 || volume < 0) {
          message.reply(volume + " is a incorrect value : `!volume: 0-100`");
          return 0;
        }
        message.guild.voiceConnection.dispatcher.setVolume(volume);
        message.reply("volume set at " + volume + "%");
      } else {
        message.reply("Syntax error : !volume 0-100");
      }
    }
  };
};
