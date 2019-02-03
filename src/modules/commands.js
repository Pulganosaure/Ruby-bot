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

    state: message => {
      bot.bgsMonitoring.StateInfo(message);
    },
    conflitReport: message => {
      bot.bgsMonitoring.conflitReport(message);
    },
    bgsReport: message => {
      bot.bgsMonitoring.getInfluences(message);
    },
    remove: message => {
      bot.jukebox.remove(message);
    },
    clearqueue: message => {
      bot.jukebox.clearQueue();
      message.reply("queue cleared");
    },
    dc: message => {
      bot.client.channels.get(message.member.voiceChannelID).leave();
      bot.jukebox.queue.queue = [];
    },
    bgs: message => {
      bot.bgsMonitoring.checkBGS(message);
    },
    expansion: message => {
      bot.bgsMonitoring.predictExpansion(message);
    },
    resume: message => {
      bot.jukebox.resume(message);
    },
    queue: message => {
      console.log(bot.jukebox.queue.queue);
      if (bot.jukebox.queue.queue.length == 0) message.reply("queue is empty");
      else
        message.reply(
          "\n<" + bot.jukebox.queue.queue.slice(0, 4).join(">\n<") + ">"
        );
    },
    pause: message => {
      bot.jukebox.pause(message);
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
      if (message.args[0])
        bot.riotAPI.getGameData(message.args.join(" "), message);
      else message.reply("Invalid username : !game username");
    },
    profil: message => {
      if (message.args[0] && message.args[0] !== "")
        bot.riotAPI.getSummonerProfil(message.args.join(" "), message);
    },

    champion: message => {
      if (message.args && message.args[0] !== "")
        bot.riotAPI.getChampionDetails(
          toTitleCase(message.args.join(" ")),
          message
        );
    },
    play: message => {
      if (message.args) bot.jukebox.play(message);
      else message.reply("merci de précisé un url valide");
    },
    volume: message => {
      bot.jukebox.volume(message);
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
    skip: message => {
      bot.jukebox.skip(message);
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
    add: message => {
      bot.jukebox.add(message);
      message.reply(
        "Musiques Added to the queue, new queue lenght : " +
          bot.jukebox.queue.queue.length
      );
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
