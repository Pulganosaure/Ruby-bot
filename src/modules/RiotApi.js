const Discord = require("discord.js");
const ApiKey = require("../../config.js").RiotApiKey;
const axios = require("axios");
const champs = require("../ressources/champions.js").champions;
module.exports = {
  commands: {
    game: message => {
      if (message.args[0])
        bot.riotAPI.getGameData(message.args.join(" "), message);
      else message.reply("Invalid username : !game username");
    },
    profil: message => {
      console.log(ApiKey);
      if (message.args[0] && message.args[0] !== "")
        bot.RiotApi.getSummonerProfil(message.args.join(" "), message);
    },
    champion: message => {
      if (message.args && message.args[0] !== "")
        bot.RiotApi.getChampionDetails(
          toTitleCase(message.args.join(" ")),
          message
        );
    }
  },
  functions: {
    getGameData: async function(username, message) {
      const UserData = await getAccountDataByUsername(username, message);
      if (!UserData) return false;
      const GameData = await getGameDataByAccountId(UserData.id, message);
      if (!GameData) return false;
      RespondMessage(
        message,
        await GameInfoInArray(GameData.participants),
        getBanList(GameData.bannedChampions),
        username
      );
    },
    getSummonerProfil: async function(username, message) {
      const profil = await getAccountDataByUsername(username, message);
      if (!profil) return true;
      console.log(profil);
      const ranks = await axios
        .get(
          `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${
            profil.id
          }?api_key=${ApiKey}`
        )
        .then(res => res.data)
        .catch(error => {
          console.log("rank error " + error.response.status);
        });
      ProfilRespond(message, profil, ranks);
    },
    getChampionDetails: async function(championName, message) {
      const champion = await axios
        .get(
          `http://ddragon.leagueoflegends.com/cdn/6.24.1/data/fr_FR/champion/${championName}.json`
        )
        .catch(err => message.reply("Incorrect champion name"))
        .then(res => res.data);
      if (champion)
        ChampionRespond(message, champion.data[Object.keys(champion.data)[0]]);
    }
  }
};
//Return the Account informations From the Riot API (require the username and the DevApi)
async function getAccountDataByUsername(username, message) {
  const User = await axios
    .get(
      `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
        username
      )}?api_key=${ApiKey}`
    )
    .catch(err => message.reply("User not found" + err));
  return await User.data;
}

//Return the Game informations From the Riot API (require the account id of the player and the DevApi)
async function getGameDataByAccountId(accountId, message) {
  const GameData = await axios
    .get(
      `https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${accountId}?api_key=${ApiKey}`
    )
    .catch(err => message.reply("Player isn't playing."));

  return await GameData.data;
}

function getBanList(bans) {
  return bans.map(ban => getChampNameById(ban.championId));
}
//return the champ name from his id
function getChampNameById(id) {
  let result = "null";

  Object.keys(champs.data).map(key => {
    if (champs.data[key].id === id) result = champs.data[key].name;
  });

  return result;
}

//Generate the discord Embed for the reply
async function RespondMessage(message, gameData, banlist, GivedplayerName) {
  const embed = new Discord.RichEmbed()
    .setTitle("Game of " + GivedplayerName)
    .setColor(0x00ae86)
    .addField("Player :", "**" + gameData.summonerNames.join("\n") + "**", true)
    .addField("Champion :", gameData.championIds.join("\n"), true)
    .addField("League", gameData.ranks.join("\n"), true)
    .addBlankField(true)
    .addField("bans", banlist.join("\t"));
  message.reply({ embed });
}

function ProfilRespond(message, ProfilData, ranks) {
  const embed = new Discord.RichEmbed()
    .setTitle(ProfilData.name)
    .setColor(0x00ae86)
    .setThumbnail(
      `https://ddragon.leagueoflegends.com/cdn/7.12.1/img/profileicon/${
        ProfilData.profileIconId
      }.png`
    );
  for (let i = 0; i < ranks.length; i++) {
    embed.addField(
      ranks[i].queueType,
      "**" +
        ranks[i].tier +
        " " +
        ranks[i].rank +
        "\t\t**" +
        ranks[i].leaguePoints +
        "lp \n\t " +
        (ranks[i].wins + ranks[i].losses) +
        " games (" +
        ((ranks[i].wins / (ranks[i].wins + ranks[i].losses)) * 100).toFixed(0) +
        "%)"
    );
  }
  message.reply({ embed });
}

function ChampionRespond(message, Champion) {
  const embed = new Discord.RichEmbed()
    .setTitle(Champion.name)
    .setDescription(Champion.title)
    .setColor(0x00ae86)
    .setThumbnail(
      `http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/${
        Champion.name
      }.png`
    );
  for (let i = 0; i < Champion.spells.length; i++) {
    embed.addField(Champion.spells[i].name, Champion.spells[i].description);
  }
  message.reply({ embed });
}

async function GameInfoInArray(players) {
  return await Promise.all(
    players.map(async player => {
      const summonerName = player.summonerName;
      const championId = player.championId;
      const rank = await getRankinSolo(player.summonerId);
      return { summonerName, championId, rank };
    })
  ).then(results => transformresult(results));
}

function transformresult(result) {
  newResults = { summonerNames: [], championIds: [], ranks: [] };
  for (i = 0; i < result.length; i++) {
    newResults.summonerNames.push(result[i].summonerName);
    newResults.championIds.push(getChampNameById(result[i].championId));
    newResults.ranks.push(result[i].rank);
  }
  return newResults;
}
//get the Rank List of the players
async function getRanksListById(player) {
  const data = await Promise.all(
    player.map(async player => {
      const res = await axios
        .get(
          `https://euw1.api.riotgames.com/lol/league/v4/positions/by-summoner/${
            player.summonerId
          }?api_key=${ApiKey}`
        )
        .then(res => res.data)
        .catch(error => {
          console.log(error.response.status);
        });
      console.log(res);
      if (res) {
        return getRankinSolo(res);
      }
    })
  );
  return await data;
}

//
async function getRankinSolo(summonerId) {
  let solorank = " - ";
  const res = await axios
    .get(
      `https://euw1.api.riotgames.com/lol/league/v4/positions/by-summoner/${summonerId}?api_key=${ApiKey}`
    )
    .catch(error => {
      console.log(error.response.status);
    })
    .then(res => res.data);

  ranks = res;
  for (let i = 0; i < ranks.length; i++) {
    let alpha = getObjectBykeyValue(ranks[i], "queueType", "RANKED_SOLO_5x5");
    if (alpha && alpha !== null) {
      solorank = alpha.tier + " " + alpha.rank;
      break;
    }
  }
  return solorank;
}
function getObjectBykeyValue(object, key, value) {
  if (object[key] === value) return object;
  return null;
}
