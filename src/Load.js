const __ = require("iterate-js");
const fs = require("fs");
const Discord = require("discord.js");
//const MongoDB = require("../mongoDB.js");

const modules = __.map(fs.readdirSync("./src/modules"), mod =>
  require(`./modules/${mod}`)
);

module.exports = function(bot, cfg) {
  bot.client = new Discord.Client();
  //bot.bdd = MongoDB.connectToDataBase();
  __.all(modules, mod => mod(bot));
};
