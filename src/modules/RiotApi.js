const Discord = require("discord.js");
const ApiKey = require("../../config.js").RiotApiKey;
const axios = require("axios");
const champs = require("../ressources/champions.js").champions;
module.exports = function(bot) {
  bot.riotAPI = {
    getGameData: async function(username, message) {
      const UserData = await getAccountDataByUsername(username, message);
      if (!UserData) return true;
      const GameData = await getGameDataByAccountId(UserData.id, message);
      if (!GameData) return true;
      RespondMessage(
        message,
        GameInfoInArray(GameData.participants),
        getBanList(GameData.bannedChampions),
        username
      );
    },
    getSummonerProfil: async function(username, message) {
      const profil = await getAccountDataByUsername(username, message);
      if (!profil) return true;
      const ranks = await axios
        .get(
          `https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/${
            profil.id
          }?api_key=${ApiKey}`
        )
        .then(res => res.data);
      ProfilRespond(message, profil, ranks);
    },
    getChampionDetails: async function(championName, message) {
      const champion = await axios
        .get(
          `http://ddragon.leagueoflegends.com/cdn/6.24.1/data/fr_FR/champion/${championName}.json`
        )
        .then(res => res.data);

      ChampionRespond(message, champion.data[Object.keys(champion.data)[0]]);
    }
  };
};
//Return the Account informations From the Riot API (require the username and the DevApi)
async function getAccountDataByUsername(username, message) {
  const User = await axios
    .get(
      `https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${username}?api_key=${ApiKey}`
    )
    .catch(err => message.reply("User not found."));
  return await User.data;
}

//Return the Game informations From the Riot API (require the account id of the player and the DevApi)
async function getGameDataByAccountId(accountId, message) {
  const User = await axios
    .get(
      `https://euw1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/${accountId}?api_key=${ApiKey}`
    )
    .catch(err => message.reply("Player isn't playing."));
  return await User.data;
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
  console.log(gameData);
  const embed = new Discord.RichEmbed()
    .setTitle("Game of " + GivedplayerName)
    .setColor(0x00ae86)
    .addField("Player :", "**" + gameData.playerName.join("\n") + "**", true)
    .addField("Champion :", gameData.champion.join("\n") + " ", true)
    .addField("League", gameData.rank.join("\n") + "f", true)
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
        '\t\t"' +
        ranks[i].leagueName +
        '"**'
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

function GameInfoInArray(players) {
  GameInfo = { playerName: [], champion: [], rank: [] };
  players.forEach(async function(player) {
    const rank = await getRankinSolo(player.summonerId);
    GameInfo.playerName.push(player.summonerName);
    GameInfo.champion.push(player.championId);
    GameInfo.rank.push(rank);
  });
  return GameInfo;
}

//get the Rank List of the players
async function getRanksListById(player) {
  const data = await Promise.all(
    player.map(async player => {
      const res = await axios.get(
        `https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/${
          player.summonerId
        }?api_key=${ApiKey}`
      );
      if (res.data) {
        return getRankinSolo(res.data);
      }
    })
  );
  return await data;
}

//
async function getRankinSolo(summonerId) {
  let solorank = " - ";
  const res = await axios.get(
    `https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerId}?api_key=${ApiKey}`
  );
  ranks = res.data;
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
