const Discord = require("discord.js");
const ytdl = require("ytdl-core");

module.exports = function(bot) {
  bot.jukebox = {
    queue: {
      isplaying: false,
      queue: []
    },
    add: message => {
      bot.jukebox.queue.queue.push(message.args[0]);
    },
    skip: message => {
      bot.jukebox.queue.dispatcher.end();
      message.reply("Musique Skipped");
    },
    clearQueue: message => {
      bot.jukebox.queue.queue = [];
    },
    remove: message => {
      if (message.args[0] && !isNaN(message.args[0])) {
        bot.jukebox.queue.queue.slice(message.args[0] - 1, 1);
        message.reply("musique removed from the list");
      } else {
        message.reply("incorect value ");
      }
    },

    volume: message => {
      if (!isNaN(message.args[0])) {
        volume = message.args[0] / 100;
        if (volume > 100 || volume < 0) {
          message.reply(volume + " is a incorrect value : `!volume: 0-100`");
          return 0;
        }
        message.guild.voiceConnection.dispatcher.setVolume(volume);
        message.reply("volume set at " + volume * 100 + "%");
      } else {
        message.reply("Syntax error : !volume 0-100");
      }
    },

    play: message => {
      if (bot.jukebox.queue.queue.length == 0)
        return message.reply("Add musique to the queue first : !add *url* ");
      bot.jukebox.queue.isplaying = true;

      bot.jukebox.queue.dispatcher = createDispatcher(message, bot);
      if (bot.jukebox.queue.dispatcher) {
        bot.jukebox.queue.dispatcher.on("end", () => {
          if (bot.jukebox.queue.isplaying) {
            bot.jukebox.queue.isplaying = false;
            bot.jukebox.queue.queue.shift();
            bot.jukebox.play(message);
            setTimeout(() => {
              bot.jukebox.queue.dispatcher = null;
            }, 100);
          }
        });
      }
    },
    pause: message => {
      message.guild.voiceConnection.dispatcher.pause();
    },
    resume: async message => {
      message.guild.voiceConnection.dispatcher.resume();
    }
  };
};

function createDispatcher(message, bot) {
  if (!message.guild.voiceConnection) joinVoiceChannel(message);
  return message.guild.voiceConnection.playStream(
    ytdl(bot.jukebox.queue.queue[0], {
      audioonly: true
    }),
    { seek: 0, passes: 0, volume: 0.1 }
  );
}

function joinVoiceChannel(message) {
  if (message.member.voiceChannel) message.member.voiceChannel.join();
  else message.reply("join voice channel first");
}
