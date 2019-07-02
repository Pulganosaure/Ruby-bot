const Discord = require("discord.js");
const fs = require("fs");

bot = { commands: {}, config: {} };
initBot();
initModule();

try {
  bot.client.auth.connect();
} catch (error) {
  throw error;
}

bot.client.on("error", error => {
  bot.logManager.publishLog("error", "bot", error, false);
});

bot.client.on("ready", () => {
  //console.log(bot.client.options);
  if (!process.arvO == false)
    bot.logManager.publishLog("start", "bot", "bot ready", true);
  console.log(
    Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100
  );
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
    bot.config = require("./config.js").config;
    fs.readdirSync("./src/modules").map(mod => {
      module = require(`./src/modules/${mod}`);
      if (validModule(module)) {
        bot[/\w+/g.exec(mod)] = module.functions;
        bot.commands = Object.assign(bot.commands, module.commands);
      }
    });
  } catch (error) {
    console.log(bot.logManager);
    //bot.logManager.publishLog("Module Initialisation", "Bot", error, false);
    throw error;
  }
}

function validModule(module) {
  return module.commands && module.functions;
}

function isFunction(functionToCheck) {
  return typeof functionToCheck === "function";
}
