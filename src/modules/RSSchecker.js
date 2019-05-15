const Parser = require("rss-parser");
const fs = require("fs");
const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

module.exports = function(bot) {
  bot.rss = {
    add: async message => {
      const rssName = message.args[0],
        url = message.args[1],
        timer = message.args[2];
      if (!rssName || !url || !timer)
        return message.reply("invalide arguments");
      if (await nameAvailable(rssName))
        return message.reply("name already used, please select another name.");
      if (await urlAvailable(url))
        return message.reply("RSS flux already active.");
      if (!(await urlRegex.exec(url))) return message.reply("invalid URL");
      addFluxTolist(rssName, url, timer);
      message.reply("RSS added to the list");
    },
    rssList: async () => {
      console.log(await getRSSFileContent());
      return JSON.parse(await getRSSFileContent());
    },
    readRSS: false,
    listRSS: async message => {
      message.reply(await bot.rss.rssList());
    },
    countFlux: async message => {
      message.reply(await bot.rss.rssList().then(data => data.length));
    },
    checkRSS: () => {
      setInterval(async function() {
        return;
        await bot.rss.rssList().forEach(function(flux) {
          console.log("check");
          if (bot.rss.readRSS) ParseRSS(flux.timer, flux.url, bot);
          bot.logManager.publishLog("RSSCheck", "bot", flux.name);
        });
      }, 3 * 1000);
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

function getRSSList() {
  return getRSSFileContent();
}

async function getRSSFileContent() {
  return await fs.readFileSync("./src/ressources/rss.list", "UTF-8");
}
async function editRSSFileCOntent(data) {
  data = JSON.stringify(data);
  return await fs.writeFileSync("./src/ressources/rss.list", data);
}
async function nameAvailable(name) {
  let data = await getRSSFileContent();
  data = JSON.parse(data);
  for (let index = 0; index < data.lenght; index++) {
    if (data[index].name == name) return true;
  }
  return false;
}

async function urlAvailable(url) {
  let data = await getRSSFileContent();
  data = JSON.parse(data);
  for (let index = 0; index < data.lenght; index++) {
    if (data[index].url == url) return true;
  }
  return false;
}

async function addFluxTolist(name, url, timer) {
  const newEntry = { name: name, url: url, timer: timer };
  let data = await getRSSFileContent();
  data = JSON.parse(data);
  data = Array.from(data);
  data.push(newEntry);
  editRSSFileCOntent(data);
}
