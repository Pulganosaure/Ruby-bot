const EventCommands = require('./commands/Event.js')
const server = require('./server.js')
const Parser = require('rss-parser');


const ruby = require('./config').discordToken
const commandRegex = /^![a-z]/
const Discord = require('discord.js')
const bot = new Discord.Client()

function blabla()
{
  //setInterval(function() {bot.channels.get("422173451474960386").send("hello") }, 10000)
  //setInterval(function() {bot.channels.get("422173451474960386").send("there") }, 3000)
}

function checkRSSFlux()
{
  console.log("Flux Checker Initialized")
  setInterval(function() {getRSSFlux(10, "https://www.guildwars2.com/fr/feed/")}, 10 * 60000)
  setInterval(function() {getRSSFlux(10, "https://en-forum.guildwars2.com/discussions/feed.rss")}, 10 * 60000)
  setInterval(function() {getRSSFlux(10, "https://fr-forum.guildwars2.com/discussions/feed.rss")}, 10 * 60000)
}

function postRSSEmbed(post)
{
  bot.channels.get("422173451474960386").send(post.link)
}


async function getRSSFlux(delay, url)
{
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
  console.log("rss checked")
}


function check_command(request, message)
{
  switch (request[0]) {
    case "!clear":
    console.log(request[1])
    message.channel.fetchMessages({ limit: request[1]+1})
    .then(res => res.map(message => message.delete()))
    break;
    case "!event":
    EventCommands.check_NextEvent(message)
    break;
    case "!gw2":
    message.reply("c'est buggé !")
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
});

function check_ConnectedServers()
{
  let server_list = []
  bot.guilds.map(server => {
    server_list.push(server.name)
  })
  console.log("bot connected to :")
  console.log(server_list)
}

bot.login(ruby.token)
