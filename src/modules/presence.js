module.exports = function(bot) {
  bot.presence = {
    updatePresence: function(message, args, bot) {
      args[0] = "";
      text = args.join(" ");
      console.log(text);
      bot.user.setPresence({ game: { name: text } });
      message.reply("the presence text has been updated");
    }
  };
};
