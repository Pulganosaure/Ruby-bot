const Discord = require('discord.js')
const ApiKey = require('../config.js').RiotApiKey
const axios = require('axios')
const champs = require('./champions.js').champions
module.exports = {
  getGameData: async function(username, message)
  {
    const UserData = await getAccountIdByUsername(username, message)
    if(!UserData)
     return true
    const GameData = await getGameDataByAccountId(UserData.id, message)
    if(!GameData)
      return true
    RespondMessage(message, getUsernameList(GameData.participants), getChampionList(GameData.participants), getBanList(GameData.bannedChampions), GameData.participants, username)
  }
}
//Return the Account informations From the Riot API (require the username and the DevApi)
 async function getAccountIdByUsername(username, message) {
  const User = await axios.get(`https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${username}?api_key=${ApiKey}`).catch(err => message.reply("User not found."))
  return await User.data
}

//Return the Game informations From the Riot API (require the account id of the player and the DevApi)
async function getGameDataByAccountId(accountId, message) {
  const User = await axios.get(`https://euw1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/${accountId}?api_key=${ApiKey}`).catch(err => message.reply("Player isn't playing."))
 return await User.data
}

//return an array with the list of the Username of the game (require the participants objects)
function getUsernameList(participants) {
  return participants.map(player => player.summonerName)
}
//return an array with the list of the players champions (require the participants objects)
function getChampionList(champions) {
  return champions.map(champion => getChampNameById(champion.championId))
}
//return an array with the list of the banned champ
function getBanList(bans) {
  return bans.map(ban => getChampNameById(ban.championId))
}
//return the champ name from his id
function getChampNameById(id) {
  let result = "null"

  Object.keys(champs.data).map(key => {
    if(champs.data[key].id === id)
     result = champs.data[key].name
   })

  return result
}

//Generate the discord Embed for the reply
async function RespondMessage(message, players, champions, bans, ids, GivedplayerName)
{
  const ranks = await getRanksListById(ids)
  const embed = new Discord.RichEmbed()
  .setTitle("Game of " + GivedplayerName)
  .setColor(0x00AE86)
  .addField("Player :", "**"+players.join("\n")+"**", true)
  .addField("Champion :", champions.join("\n"), true)
  .addField("League", ranks.join("\n"), true)
  .addBlankField(true)
  .addField("bans", bans.join("\t"))
  message.reply({embed})
}

//get the Rank List of the players
async function getRanksListById(player) {
  const data = await Promise.all(player.map(async (player) => {
    const res = await axios.get(`https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/${player.summonerId}?api_key=${ApiKey}`)
      if(res.data) {
        return getRankinSolo(res.data)
    }
  }))
  return await data
}


//
function getRankinSolo(ranks)
{
  let rank = " - "
  for(let i = 0; i< ranks.length; i++)
  {
    let alpha = getObjectBykeyValue(ranks[i], "queueType" , "RANKED_SOLO_5x5")
    if(alpha && alpha !== null) {
      console.log(alpha.queueType)
      rank = alpha.tier + " " + alpha.rank
      break
    }
  }
  return rank
}
function getObjectBykeyValue(object, key, value) {
  if(object[key] === value)
    return object
  return null
}
