module.exports = function(bot) {
  bot.eventLister = {
    eventManager: event => {
      //console.log(event.t);
      if (!["GUILD_MEMBER_REMOVE", "GUILD_MEMBER_BANNED"].includes(event.t))
        switch (event.t) {
          case "GUILD_MEMBER_BANNED":
            banEmbed();
            break;
        }
      return;
    }
  };
};

function banEmbed(event) {
  const embed = new Discord.RichEmbed()
    .setColor("ff0000")
    .addField(details.title, details.description)
    .addField(
      "horaires :",
      "le: " +
        details.startDate.getDate() +
        "/" +
        details.startDate.getMonth() +
        "/" +
        details.startDate.getFullYear()
    );
  bot.client.channels.get(moderationChannelId).send();
}
function kickEmbed() {}
function unbanEmbed() {}
function muteEmbed() {}
function unmuteEmbed() {}
