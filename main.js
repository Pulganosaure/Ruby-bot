const EventCommands = require('./commands/Event.js')
const VoiceCommands = require ('./commands/Voice.js')
const PresenceCommands = require('./commands/presence.js')
const HelpCommands = require('./commands/help.js')
const server = require('./server.js')
const Parser = require('rss-parser');


const discordToken = require('./config').discordToken
const commandRegex = /^![a-z]/
const Discord = require('discord.js')
const bot = new Discord.Client()

function checkRSSFlux() {
  console.log("Flux Checker Initialized")
  setInterval(function() {getRSSFlux(3, "https://www.guildwars2.com/fr/feed/")}, 3 * 60000)
  setInterval(function() {getRSSFlux(3, "https://en-forum.guildwars2.com/discussions/feed.rss")}, 3 * 60000)
  setInterval(function() {getRSSFlux(3, "https://fr-forum.guildwars2.com/discussions/feed.rss")}, 3 * 60000)
}

function postRSSEmbed(post) {
  bot.channels.get("501126898815074324").send(post.link)
}


async function getRSSFlux(delay, url) {
  let parser = new Parser();
  let feed = await parser.parseURL(url);

  feed.items.map(entry => {
    let pub = new Date() - new Date(entry.pubDate)
    if((Math.round((new Date() - new Date(entry.pubDate)) / 60000)) < delay) {
      console.log(Math.round(pub / 60000))
      console.log(entry.pubDate)
      postRSSEmbed(entry)
    }
  })
  console.log("rss checked : " + url + " at " + new Date().toString())
}


function check_command(request, message) {
  switch (request[0]) {
    case "!clear":
    message.channel.fetchMessages({ limit: request[1]})
    .then(res => res.map(message => message.delete()))
    break;
    case "!events":
    EventCommands.displayEventList(message)
    break;
    case "!event":
    EventCommands.displayEventDetails(message, request)
    break;
    case "!gw2":
    message.reply("c'est buggé !")
    break;
    case "!ael":
    message.reply("2 choses : le placement ! le placement ! le placement !")
    break;
    case "!play":
    if(request[1])
      VoiceCommands.play(message, request[1], bot)
    else
      message.reply('merci de précisé un url valide')
    break;
    case "!volume":
    VoiceCommands.volume(request[1], message)
    break;
    case "!join":
      EventCommands.joinEventById(message, request)
    break;
    case "!leave":
      EventCommands.leaveEventById(message, request)
    break;
    case "!presence":
      PresenceCommands.updatePresence(message, request, bot)
    break;
    case "!uptime":
      message.reply(Math.floor((bot.uptime / 1000) / 3600*24) + " days " + Math.floor((bot.uptime / 1000) / 3600)+ " hours " + Math.floor(((bot.uptime / 1000) / 60) % 60) + " minutes " + Math.floor((bot.uptime / 1000) % 60) + " secondes")
    break
    case "!help":
      HelpCommands.help(message)
    break;
    default:
    message.reply("no command found need !help ?")
    break;
  }
}

bot.on('ready', function () {
  server.connectToDataBase()
  check_ConnectedServers()
  checkRSSFlux()
  console.log('All services Initialized')
})

bot.on('message', message => {
  if (commandRegex.exec(message.content)) {
    command = message.content.split(" ")
    check_command(command, message)
  }
})

bot.on("error", (err) => {
  console.error(`An error occurred. The error was: ${err}.`)
  console.log(err)
});


function check_ConnectedServers() {
  let server_list = []
  bot.guilds.map(server => {
    server_list.push(server.name)
  })
  console.log("bot connected to :")

  console.log(server_list)
}

bot.login(discordToken.token)
