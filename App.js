const Discord = require("discord.js");
const fs = require("fs");

bot = {};
bot.commands = {};
bot.config = {};
initBot(bot);
initModule(bot);

bot.client.auth.connect();

bot.client.on("ready", () => console.log("bot ready"));

bot.client.on("message", message => {
  if (bot.utils.isACommand(message)) {
    message.reply("command detected");
    message.args = message.content.replace(/(\s)*(;)(\s)*/g, ";").split(";");
    message.command = message.args[0]
      .replace(/\s+/, " ")
      .split(" ")
      .shift()
      .slice(1);
    message.args[0] = message.args[0].replace(/^!([A-z])+\s+/, "");
    try {
      cmd = bot.commands[message.command.toLowerCase()];
      if (isFunction(cmd)) {
        cmd(message);
      } else {
        message.reply("command not found, check the command list with `!help`");
      }
    } catch (err) {
      console.log(err);
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
    writeLog("Module Initialisation", "Bot", "failed", error);
    throw error;
  }
}

function validModule(module) {
  return module.commands && module.functions;
}

function writeLog(command, user, result, error = "none") {
  console.log(command + ";" + user + ";" + result + ";" + error);
}

function isFunction(functionToCheck) {
  return typeof functionToCheck === "function";
}
