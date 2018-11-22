const Parser = require("rss-parser");

module.exports = function(bot) {
  bot.rss = {
    rssList: [
      {
        timer: 3,
        url: "https://www.guildwars2.com/fr/feed/",
        name: "frPatchNoteGW2"
      },
      {
        timer: 3,
        url: "https://en-forum.guildwars2.com/discussions/feed.rss",
        name: "enForumGW2"
      },
      {
        timer: 3,
        url: "https://fr-forum.guildwars2.com/discussions/feed.rss",
        name: "frForumGW2"
      }
    ],

    readRSS: false,
    addRSS: (name, url, bot) => {
      bot.RSSList.push({ timer: 3, url: url, name: name });
    },
    listRSS: () => {
      console.log(bot.rss.rssList);
    },
    checkRSS: () => {
      setInterval(function() {
        bot.rss.rssList.forEach(function(flux) {
          if (bot.rss.readRSS) ParseRSS(flux.timer, flux.url, bot);
          bot.logManager.publishLog("RSSCheck", "bot", flux.name);
        });
      }, 3 * 60000);
    }
  };
};

async function ParseRSS(delay, url, bot) {
  let parser = new Parser();
  let feed = await parser.parseURL(url);
  let total = 0;
  feed.items.map(entry => {
    let pub = new Date() - new Date(entry.pubDate);
    if (Math.round((new Date() - new Date(entry.pubDate)) / 60000) < delay) {
      total++;
      postRSSEmbed(entry, bot);
    }
  });
}
function postRSSEmbed(post, bot) {
  bot.client.channels.get("501126898815074324").send(post.link);
}
