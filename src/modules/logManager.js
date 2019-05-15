const fs = require("fs");

module.exports = function(bot) {
  bot.logManager = {
    publishLog: (event, author, result) => {
      let dateFile = new Date();
      let logObject = {
        date: dateFile.toISOString(),
        event: event,
        author: author,
        result: result
      };
      console.log(logObject);
      return;
      fs.appendFile("../../log.log", JSON.stringify(logObject) + "\n", function(
        err
      ) {
        if (err) console.log(err);
      });
    }
  };
};
