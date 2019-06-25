const fs = require("fs");

module.exports = {
  commands: {},
  functions: {
    publishLog: (event, author, result, ondiscord = false) => {
      let dateFile = new Date();
      let logObject = {
        date: dateFile.toISOString(),
        event: event,
        author: author,
        result: result
      };
      console.log(logObject);

      fs.appendFile("../../log.log", JSON.stringify(logObject) + "\n", function(
        err
      ) {
        if (err) console.log(err);
      });
      if (ondiscord) {
        publishOnDiscord(bot, dateFile, event, result);
      }
    }
  }
};
function publishOnDiscord(bot, date, event, result) {
  bot.client.channels
    .get("591322028984762369")
    .send("`" + date.toUTCString() + "` : **" + event + "**\n" + result)
    .catch(error => console.log(error.message));
}
