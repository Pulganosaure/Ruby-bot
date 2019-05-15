const BGSStates = require("../ressources/bgsStates");
const Discord = require("discord.js");
const axios = require("axios");
const moderationChannelId = "571341510197379092";
module.exports = function(bot) {
  bot.moderation = {
    kick: async message => {
      let user = message.mentions.members.first();
      if (!user.user.dmChannel) await user.createDM();
      let reason = message.args[1];
      message.reply(reason);
      user.user.dmChannel
        .send(
          "you have been kicked from the " +
            message.guild.name +
            " server for " +
            reason
        )
        .catch(err => console.log(err));
      user.kick(reason);
    },
    ban: async message => {
      let user = message.mentions.members.first();
      if (!user.user.dmChannel) await user.createDM();
      let reason = message.args[1];
      user.user.dmChannel
        .send(
          "you have been banned from the " +
            message.guild.name +
            " server for " +
            reason
        )
        .catch(err => console.log(err));
      user.ban(reason);
    },
    mute: message => {
      let muted = "";
      message.guild.roles.map(role => {
        if (role.name == "Muted") muted = role;
      });
      message.mentions.members
        .first()
        .addRole(muted)
        .then(
          message.reply(
            message.mentions.members.first().user.username + " has been muted"
          )
        )
        .catch(err => console.log(err));
    },
    unmute: message => {
      let muted = "";
      message.guild.roles.map(role => {
        if (role.name == "Muted") muted = role;
      });
      message.mentions.members
        .first()
        .removeRole(muted)
        .then(
          message.reply(
            message.mentions.members.first().user.username + " has been unmuted"
          )
        )
        .catch(err => console.log(err));
    }
  };
};

function writeModerationLog(action, player, time) {
  const embed = new Discord.RichEmbed()
    .setColor(000000)
    .addField(details.title, details.description)
    .addField(
      "horaires :",
      "le: " +
        details.startDate.getDate() +
        "/" +
        details.startDate.getMonth() +
        "/" +
        details.startDate.getFullYear()
    );
  bot.client.channels.get(moderationChannelId).send();
}
