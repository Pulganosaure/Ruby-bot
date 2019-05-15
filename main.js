const Ruby = require("./src/Ruby.js");

const commandRegex = /^![a-z]\w+/;

const bot = new Ruby();

bot.connect();

bot.client.on("raw", function(event) {
  bot.eventLister.eventManager(event);
});

bot.client.on("ready", function() {
  console.log("All services Initialized");
  if (!bot.rss.readRSS) {
    bot.rss.readRSS = true;
    bot.rss.checkRSS();
  }
  bot.logManager.publishLog("ServiceInit", "bot", "All services Initialized");
});

bot.client.on("message", message => {
  if (commandRegex.exec(message.content)) {
    message.args = message.content.replace(/(\s)*(;)(\s)*/g, ";").split(";");
    message.command = message.args[0]
      .replace(/\s+/, " ")
      .split(" ")
      .shift()
      .slice(1);
    message.args[0] = message.args[0].replace(/^!([A-z])+\s+/, "");
    bot.logManager.publishLog(
      message.command,
      message.author.username + "#" + message.author.discriminator,
      message.content
    );
    try {
      console.log(message.command);
      console.log(message.args);
      cmd = bot.commands[message.command];
      if (isFunction(cmd)) {
        cmd(message);
      } else {
        message.reply("command not found, check the command list with `!help`");
      }
    } catch (error) {
      bot.logManager.publishLog(
        "error",
        message.author.username + "#" + message.author.discriminator,
        error
      );
    }
  }
});

bot.client.on("error", err => {
  null;
});

function isFunction(functionToCheck) {
  return typeof functionToCheck === "function";
}
