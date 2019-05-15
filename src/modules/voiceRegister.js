//const discordToken = require("../../config").discordToken;
const fs = require("fs");

let voiceConnection;
module.exports = function(bot) {
  bot.voiceRegister = {
    VRstart: message => {
      if (!message.guild.voiceConnection) {
        message.member.voiceChannel
          .join()
          .then(voiceConnection => {
            let receiver = voiceConnection.createReceiver();
            voiceConnection.on("speaking", (user, speaking) => {
              message.channel.sendMessage(`I'm listening to ${user}`);
              // this creates a 16-bit signed PCM, stereo 48KHz PCM stream.
              const audioStream = receiver.createPCMStream(user);
              // create an output stream so we can dump our data in a file
              const outputStream = generateOutputFile("blabla", user);
              // pipe our audio data into the file stream
              audioStream.pipe(outputStream);
              outputStream.on("data", console.log);
              // when the stream ends (the user stopped talking) tell the user
              audioStream.on("end", () => {
                message.channel.sendMessage(
                  `I'm no longer listening to ${user}`
                );
              });
            });
          })
          .catch(console.log);
      }
    },
    VRStop: message => {
      message.reply("Stopped listening voice chat.");
    }
  };
};

function generateOutputFile(channel, member) {
  // use IDs instead of username cause some people have stupid emojis in their name
  const fileName = `./test/${Date.now()}.pcm`;
  return fs.createWriteStream(fileName);
}
