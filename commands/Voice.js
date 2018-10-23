const Event = require('../models/EventModel.js')
const User = require('../models/User.js')
const Discord = require('discord.js')
let volume = 0.4;
const ytdl = require('ytdl-core');

module.exports = {

  play: function(message, url, bot) {
    let isplaying = false
    if(message.member.voiceChannelID !== '')
    {
      bot.channels.get(message.member.voiceChannelID).join()
      .then(function (connection) {
        // On démarre un stream à partir de la vidéo youtube
          isplaying = true
          let stream = ytdl(url, { audioonly: true })
          stream.on('error', function () {
            isplaying = false
            message.reply("Impossible de lire cette vidéo ")
            console.log("trying to play \"" + url + "\" on channel " + message.member.voiceChannelID + "but url was invalid")

            connection.disconnect()
          })
          connection
          .playStream(stream, { seek: 0, volume: volume })
          .on('end', function () {
            isplaying = false
            setTimeout(function(isplaying){ if(!isplaying) connection.disconnect() }, 30000);
          })
      })
      .catch(err => message.reply("oups! it seem I can't join this channel, check if I have the permissions."))
    }
    else
    {
      message.reply("Please Join vocal first")
      console.log("trying to play \"" + url + "\" on channel " + message.member.voiceChannelID + "but player was not in a voice channel")

    }
  },
  volume: function(vol, message)
  {
    //console.log(message)
    if(!isNaN(vol))
    {
      volume = vol
      volume = ((vol % 100 ) / 100) / 2
      message.reply("volume set at " + (vol % 100 ) + "%")
    }
    else {
      message.reply("Syntax error : !volume 0-100")
    }
    //bot.channel.sendVoiceStateUpdate({seek:0, volume: volume})
  }
}
