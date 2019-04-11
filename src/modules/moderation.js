const BGSStates = require("../ressources/bgsStates");
const Discord = require("discord.js");
const axios = require("axios");
module.exports = function(bot) {
  bot.moderation = {
    kick: async message => {
      let user = message.mentions.users.first();
      //console.log(user.username);
      //console.log(user);
      if (!user.dmChannel) await user.createDM();

      message.args = message.args.join(" ").split(";");
      reason = message.args[1];
      user.dmChannel
        .send(
          "you have been kicked from the " +
            message.guild.name +
            " server for " +
            reason
        )
        .catch(err => console.log(err));
      console.log(reason);
      console.log(details);
    },
    ban: async message => {
      let user = message.mentions.users.first();
      if (!user.dmChannel) await user.createDM();
      message.args = message.args.join(" ").split(";");
      reason = message.args[1];
      user.dmChannel
        .send(
          "you have been banned from the " +
            message.guild.name +
            " server for " +
            reason
        )
        .catch(err => console.log(err));
    },
    mute: message => {
      let muted = "";
      message.guild.roles.map(role => {
        console.log(role.name);
        if (role.name == "Muted") muted = role;
      });
      message.mentions.members
        .first()
        .addRole(muted)
        .catch(err => console.log(err));
    }
  };
};
