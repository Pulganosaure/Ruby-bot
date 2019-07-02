const Discord = require("discord.js");
module.exports = {
  commands: {
    uptime: message => {
      const uptime = getUptime();
      message.reply(
        uptime.days +
          " days " +
          uptime.hours +
          " hours " +
          uptime.minutes +
          " minutes " +
          uptime.secondes +
          " secondes"
      );
    },
    stats: message => {
      const embed = new Discord.RichEmbed();
      embed.addField(
        "Memory :",
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100 +
          " Mo",
        true
      );
      embed.addField(
        "Channels :",
        bot.client.channels.size + "\n" + bot.client.guilds.size,
        true
      );
      const uptime = getUptime();
      embed.addField(
        "Uptime :",
        uptime.days +
          "d " +
          uptime.hours +
          "h " +
          uptime.minutes +
          "m " +
          uptime.secondes +
          "s",
        true
      );
      message.reply({ embed });
    },
    modulelist: message => {
      message.reply("\n- " + Object.keys(bot).join("\n- "));
    }
  },
  functions: {
    isACommand: message => {
      console.log(message.content);
      return message.content.startsWith(bot.config.commandPrefix);
    },
    isGuildOwner: message => {
      return message.author.id == message.guild.ownerID;
    },
    isBotOwner: message => {
      message.author.id == bot.config.OwnerId;
    },
    parseCommand: message => {
      message.args = message.content.replace(/(\s)*(;)(\s)*/g, ";").split(";");
      message.command = message.args[0]
        .replace(/\s+/, " ")
        .split(" ")
        .shift()
        .slice(1);
      message.args[0] = message.args[0].replace(/^!([A-z])+\s+/, "");
      return message;
    }
  }
};

function getUptime() {
  return {
    days: Math.floor(bot.client.uptime / 1000 / (3600 * 24)),
    hours: Math.floor((bot.client.uptime / 1000 / 3600) % 24),
    minutes: Math.floor((bot.client.uptime / 1000 / 60) % 60),
    secondes: Math.floor((bot.client.uptime / 1000) % 60)
  };
}
