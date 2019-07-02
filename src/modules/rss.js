const fs = require("fs");
module.exports = {
  commands: {
    //do not use cap letter in the function name or the command will not be detected
    rsslist: message => {
      //message is the object message who trigered this command.
      message.reply("this is the commandTest o/");
    },
    rssadd: message => {}
  },
  functions: {
    functionTest: () => {
      // bot.[module].functionTest
      return null;
    }
  }
};

function addRss(name, url) {
  if (name != null || url != null) return "incorrect name or url";
}

async function openFile() {
  fs.access("./src/ressources/rssList.json", err => {
    if (err) {
      console.log(err);
      bot.config.rssList = [];
    }
  });
  try {
    bot.config.rssList = require("../ressources/rssList.json");
    console.log(typeof Object.values(bot.config.rssList.flux));
    console.log("type : " + typeof Object.values(bot.config.rssList.flux));
    if (typeof bot.config.rssList != Array) throw "incorrect array values";
  } catch (error) {
    bot.logManager.publishLog("init RSS", "bot", error, false);
    console.log(error);
  }
}
bot.client.on("ready", () => openFile());
