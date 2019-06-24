const Ruby = require("./src/Ruby.js");
const blabla = require("./src/Ruby.js");
const Discord = require("discord.js");
bot = {};
bot.client = new Discord.Client();
bot.client.auth = require("./src/auth.js");

bot.client.auth.connect();

bot.client.on("ready", () => console.log("bot ready"));

bot.client.on("message", message => {
  if (message.author.username != "Ruby") message.reply("00ۗۗۗ");
});
