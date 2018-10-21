
module.exports = function(bot)
{
  bot.commands = {
    help: msg => {
      msg.channel.sendMessage("this is the text help message");
      
    },
  }
}
