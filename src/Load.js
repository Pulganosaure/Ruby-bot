const __ = require("iterate-js");
const fs = require("fs");
const Discord = require("discord.js");
const MongoDB = require("../MongoDB.js");

const modules = __.map(fs.readdirSync("./src/modules"), mod =>
  require(`./modules/${mod}`)
);

module.exports = function(bot, cfg) {
  bot.dir = __dirname;
  bot.client = new Discord.Client();
  bot.bdd = MongoDB.connectToDataBase();
  bot.audioFlux = {};
  //config(bot, cfg);
  __.all(modules, mod => mod(bot));
};
