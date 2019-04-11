const Ruby = require("./src/ruby.js");

const discordToken = require("./config").discordToken;
const commandRegex = /^![a-z]\w+/;
const bot = new Ruby();

bot.connect();
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
    text = message.content.split(" ");
    message.command = text.shift().replace("!", "");
    message.args = text.slice(0);
    bot.logManager.publishLog(
      message.command,
      message.author.username + "#" + message.author.discriminator,
      message.content
    );
    try {
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
