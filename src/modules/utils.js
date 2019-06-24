module.exports = {
  commands: {
    uptime: message => {
      message.reply(
        Math.floor(bot.client.uptime / 1000 / (3600 * 24)) +
          " days " +
          Math.floor((bot.client.uptime / 1000 / 3600) % 24) +
          " hours " +
          Math.floor((bot.client.uptime / 1000 / 60) % 60) +
          " minutes " +
          Math.floor((bot.client.uptime / 1000) % 60) +
          " secondes"
      );
    }
  },
  functions: {
    isACommand: message => {
      bot.config.commandPrefix = "!";
      console.log(message.content);
      return message.content.startsWith(bot.config.commandPrefix);
    },
    iGuildOwner: message => {
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
