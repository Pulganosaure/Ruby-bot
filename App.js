const Discord = require("discord.js");
const fs = require("fs");

bot = { commands: {}, config: {} };
initBot();
initModule();

bot.client.auth.connect();

bot.client.on("ready", () => {
  bot.logManager.publishLog("start", "bot", "bot ready", true);
});

bot.client.on("message", message => {
  if (bot.utils.isACommand(message)) {
    message = bot.utils.parseCommand(message);
    try {
      cmd = bot.commands[message.command.toLowerCase()];
      if (isFunction(cmd)) {
        cmd(message);
      } else {
        message.reply("command not found, check the command list with `!help`");
      }
    } catch (err) {
      bot.logManager.publishLog(
        "exec command",
        message.author.username,
        err,
        true
      );
    }
  }
});

function initBot() {
  bot.client = new Discord.Client();
  bot.client.auth = require("./src/auth.js");
}
function initModule() {
  try {
    fs.readdirSync("./src/modules").map(mod => {
      module = require(`./src/modules/${mod}`);
      if (validModule(module)) {
        bot[/\w+/g.exec(mod)] = module.functions;
        bot.commands = Object.assign(bot.commands, module.commands);
      }
    });
  } catch (error) {
    bot.logManager.publishLog("Module Initialisation", "Bot", error, false);
    throw error;
  }
}

function validModule(module) {
  return module.commands && module.functions;
}

function isFunction(functionToCheck) {
  return typeof functionToCheck === "function";
}
