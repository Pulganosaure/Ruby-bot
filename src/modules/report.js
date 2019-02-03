module.exports = function(bot) {
  bot.report = {
    report: message => {
      //addToBDD
      message.reply("player has been added to the BDD");
    }
  };
};
