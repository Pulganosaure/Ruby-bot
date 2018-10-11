const EventCommands = require('./commands/Event.js')
const server = require('./server.js')


const ruby = require('./config').discordToken
const commandRegex = /^![a-z]/
const Discord = require('discord.js')
const bot = new Discord.Client()

function blabla()
{
  //setInterval(function() {bot.channels.get("422173451474960386").send("hello") }, 10000)
  //setInterval(function() {bot.channels.get("422173451474960386").send("there") }, 3000)
}

function check_command(request, message)
{
  switch (request[0]) {
    case "!salut":
    message.reply('tg')
    break;

    case "!test":
    message.reply("<@" +message.author.id + ">")
    break;
    case "!clear":
    console.log(request[1])
    message.channel.fetchMessages({ limit: request[1]})
    .then(res => res.map(message => message.delete()))
    break;

    case "!event":
      EventCommands.check_NextEvent(message)
    break;

    default:
    message.reply("no command")
    break;

  }
}


bot.on('ready', function () {
  server.connectToDataBase()
  bot.guilds.map(server => console.log(server.name))

  console.log('Bot is Connected')
})

bot.on('message', message => {
  if (commandRegex.exec(message.content)) {
    command = message.content.split(" ")
    check_command(command, message)
  }
})


bot.login(ruby.token).then()
