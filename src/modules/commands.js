module.exports = function(bot) {
  bot.commands = {
    clear: message => {
      if (message.args[0] && !isNaN(message.args[0]))
        message.channel
          .fetchMessages({ limit: message.args[0] })
          .then(res => res.map(message => message.delete()));
    },
    find: message => {
      bot.findPOI(message.args[0], arguments[2], message);
    },
    permcheck: message => {
      bot.client.channels.get("500415668890370048").send("!stop");
    },
    vc: message => {
      console.log(message.guild.voiceConnection);
    },
    vcs: message => {
      console.log(message.guild.voiceConnection.speaking);

      console.log(bot.audioflux);
    },
    dc: message => {
      bot.client.channels.get(message.member.voiceChannelID).leave();
    },
    resume: message => {
      bot.voice.resume(message);
    },
    pause: message => {
      bot.voice.pause(message);
    },
    events: message => {
      bot.event.displayEventList(message);
    },
    event: message => {
      bot.event.displayEventDetails(message, arguments);
    },
    gw2: message => {
      message.reply("c'est buggé !");
    },
    ael: message => {
      message.reply("2 choses : le placement ! le placement ! le placement !");
    },
    game: message => {
      if (message.args[0] && message.args[0] !== "")
        bot.riotAPI.getGameData(message.args[0], message);
      else message.reply("Invalid username : !game username");
    },
    profil: message => {
      if (message.args[0] && message.args[0] !== "")
        bot.riotAPI.getSummonerProfil(message.args[0], message);
    },

    champion: message => {
      if (message.args && message.args[0] !== "")
        bot.riotAPI.getChampionDetails(toTitleCase(message.args[0]), message);
    },
    play: message => {
      console.log(message.command);

      if (message.args) bot.voice.play(message);
      else message.reply("merci de précisé un url valide");
    },
    volume: message => {
      bot.voice.volume(message);
    },
    join: message => {
      bot.event.joinEventById(message, arguments);
    },
    leave: message => {
      bot.event.leaveEventById(message, arguments);
    },
    presence: message => {
      bot.presence.updatePresence(message, arguments, bot);
    },
    stop: message => {
      if (message.author.id == "173772645404377088")
        bot.admin.disconnect(message);
      else message.reply("you don't have the permissions for this command");
    },
    servers: message => {
      if (message.author.id == "173772645404377088")
        bot.admin.check_ConnectedServers(message);
      else message.reply("you don't have the permissions for this command");
    },
    restart: message => {
      if (message.author.id == "173772645404377088") bot.admin.restart(message);
      else message.reply("you don't have the permissions for this command");
    },
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
    },
    help: message => {
      bot.help.helpMessage(message);
    }
  };
};

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
