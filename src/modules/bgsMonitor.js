const BGSStates = require("../ressources/bgsStates");
const Discord = require("discord.js");
const axios = require("axios");
module.exports = function(bot) {
  bot.bgsMonitoring = {
    checkSystem: message => {},
    StateInfo: message => {
      if (bgsStates[message.args.join(" ")])
        if ((bgsStates[message.args.join(" ")] = !"list"))
          message.reply(
            "boom, bust, civilUnrest, civilWar, election, expansion, famine, investment, lockdown, outbreak, retreat, war, civilLiberty"
          );
        else StateEmbed(message, BGSStates[message.args.join(" ")]);
    },
    conflitReport: async message => {
      const args = message.args.join(" ").split(";");
      systemName = args[0];
      faction1 = args[1];
      faction2 = args[2];
      const stations = orderStationByPriority(await getStationList(systemName));
      conflitReportEmbed(
        message,
        findStationByOwnerName(faction1, stations),
        findStationByOwnerName(faction2, stations)
      );
    },

    checkBGS: async message => {
      systemName = message.args.join(" ");
      const factions = await axios
        .get(
          `https://www.edsm.net/api-system-v1/factions?systemName=${systemName}&showHistory=1`
        )
        .then(res => res.data.factions);
      warReportembed(message, factions);
    },
    getInfluences: async message => {
      systemName = message.args.join(" ");
      const factions = await axios
        .get(
          `https://www.edsm.net/api-system-v1/factions?systemName=${systemName}`
        )
        .then(res => res.data.factions);
      influenceEmbed(message, factions, systemName);
    },
    predictExpansion: message => {
      message.args = message.args.join(" ").split(";");
      predictExpansion(message.args[0], message.args[1], message);
    }
  };
};

function findStationByOwnerName(factionName, stationList) {
  for (let i = 0; i < stationList.length; i++) {
    if (stationList[i].controllingFaction.name == factionName)
      return stationList[i];
  }
  return { controllingFaction: { name: factionName } };
}
function StateEmbed(message, state) {
  const embed = new Discord.RichEmbed()
    .setColor(0x00ae86)
    .setTitle(state.name)
    .addField(
      "Informations : ",
      "**Countdown : **" +
        "\n**Min Duration : **" +
        "\n**Max Duration : **" +
        "\n**Cooldown : **",
      true
    )
    .addField(
      "Duration : ",
      state.preparation +
        "\n" +
        state.minDuration +
        "\n" +
        state.maxDuration +
        "\n" +
        state.cooldown,
      true
    );
  message.reply({ embed });
}
function conflitReportEmbed(message, station1, station2) {
  const embed = new Discord.RichEmbed()
    .setColor(0x00ae86)
    .setTitle("Conflit Report");
  if (station1.name) {
    embed.addField(
      station1.controllingFaction.name,
      "**Station**: " +
        station1.name +
        "\n" +
        "**Type**: " +
        station1.type +
        "\n" +
        "**Distance**: " +
        station1.distanceToArrival,

      true
    );
  } else {
    embed.addField(station1.controllingFaction.name, "**NO STATIONS**", true);
  }
  if (station2.name) {
    embed.addField(
      station2.controllingFaction.name,
      "**Station**: " +
        station2.name +
        "\n" +
        "**Type**: " +
        station2.type +
        "\n" +
        "**Distance**: " +
        station2.distanceToArrival,
      true
    );
  } else {
    embed.addField(station2.controllingFaction.name, "**NO STATIONS**", true);
  }
  message.reply({ embed });
}

function influenceEmbed(message, faction, systemName) {
  const embed = new Discord.RichEmbed();

  if (faction) {
    embed.setTitle(systemName);
    faction.map(faction => {
      embed.addField(
        faction.name,
        "**Influence :** :" +
          faction.influence * 100 +
          "\n" +
          "**Current State** :" +
          faction.state +
          "\n\t"
      );
    });
    message.reply({ embed });
  } else message.reply("no faction found in this system");
}
async function getStationList(systemName) {
  return await axios
    .get(`https://www.edsm.net/api-system-v1/stations?systemName=${systemName}`)
    .then(res => res.data.stations);
}

function warReportembed(message, factions) {
  const embed = new Discord.RichEmbed();

  factions.map(faction => {
    if (isInConflitState(faction.state)) {
      let countDay = getCountDaysofWar(faction);
      embed.addField(
        faction.name,
        "influence : " + influencevariation(faction),
        true
      );
    }
  });
  message.reply({ embed });
}

function isInConflitState(state) {
  return state == "Civil war" || state == "War" || state == "Election";
}

function influencevariation(faction) {
  newinfluence = faction.influence;
  lastinfluence = getLastInfluence(faction.influenceHistory);
  if (newinfluence > lastinfluence)
    return (
      (newinfluence * 100).toFixed(1) +
      "%(" +
      ((newinfluence - lastinfluence) * 100).toFixed(1) +
      ")"
    );
  else if (newinfluence < lastinfluence)
    return (
      (newinfluence * 100).toFixed(1) +
      "%(" +
      ((newinfluence - lastinfluence) * 100).toFixed(1) +
      ")"
    );
  else newinfluence > lastinfluence;
  return (newinfluence * 100).toFixed(1) + "%( 0 ) - ";
}

function getLastInfluence(object) {
  values = Object.keys(object);
  return object[values[values.length - 2]];
}
function getCountDaysofWar(faction) {
  countday = 0;
  values = Object.keys(faction.stateHistory);
  size = values.length;

  for (let i = 0; i < values.length || i <= 28; i++) {
    if (isInConflitState(faction.stateHistory[values[size - i - 1]])) {
      countday++;
    } else {
      break;
    }
  }
  return countday;
}

function orderStationByPriority(stationList) {
  while (!isFiltered(stationList)) {
    for (let i = 0; i < stationList.length - 1; i++) {
      if (
        stationTypeToId(stationList[i]) == stationTypeToId(stationList[i + 1])
      ) {
        if (stationList[i].distanceToArrival > stationList[i + 1]) {
          let temp = stationList[i];
          stationList[i] = stationList[i + 1];
          stationList[i + 1] = temp;
        }
      }
      if (
        stationTypeToId(stationList[i]) > stationTypeToId(stationList[i + 1])
      ) {
        let temp = stationList[i];
        stationList[i] = stationList[i + 1];
        stationList[i + 1] = temp;
      }
    }
  }
  return stationList;
}

function isFiltered(stationList) {
  for (let i = 0; i < stationList.length - 1; i++) {
    if (
      stationTypeToId(stationList[i]) == stationTypeToId(stationList[i + 1])
    ) {
      if (stationList[i].distanceToArrival > stationList[i + 1]) {
        return false;
      }
    } else if (
      stationTypeToId(stationList[i]) > stationTypeToId(stationList[i + 1])
    ) {
      return false;
    }
  }
  return true;
}
function stationTypeToId(station) {
  switch (station.type) {
    case "Coriolis Starport":
    case "Orbis Starport":
    case "Ocellus Starport":
      return 0;
    case "Outpost":
      return 1;
    case "Planetary settlement":
    case "Planetary Port":
      return 2;
    default:
      return 3;
  }
}

async function predictExpansion(systemName, faction, message) {
  radius = 10;

  const systemList = await axios
    .get(
      `https://www.edsm.net/api-v1/sphere-systems?radius=${radius}&systemName=${systemName}`
    )
    .then(res => res.data);
  console.log(systemList);
  const opensystems = await checkSystem(systemList, faction);
  message.reply(opensystems);
}

async function checkSystem(systemList, factionName) {
  systemList.sort(function(a, b) {
    return a.distance - b.distance;
  });

  for (let i = 0; i < systemList.length; i++) {
    let systemDetails = await axios
      .get(
        `https://www.edsm.net/api-system-v1/factions?systemName=${
          systemList[i].name
        }`
      )
      .then(res => {
        return res.data;
      });
    console.log(factionisPresent(systemDetails.factions, factionName));
    console.log(slotisFree(totalPresentFactions(systemDetails.factions)));
    console.log("\n");
    if (
      slotisFree(totalPresentFactions(systemDetails.factions)) &&
      !factionisPresent(systemDetails.factions, factionName)
    ) {
      return systemDetails.name;
    }
  }
}

async function checkSystems(systemList, factionName) {
  systemList.sort(function(a, b) {
    return a.distance - b.distance;
  });
  systems = [];
  totalSystemFound = 0;
  for (let i = 0; i < systemList.length || totalSystemFound < 5; i++) {
    console.log(totalSystemFound);
    let systemDetails = await axios
      .get(
        `https://www.edsm.net/api-system-v1/factions?systemName=${
          systemList[i].name
        }`
      )
      .then(
        res => {
          return res.data;
        },
        error => {
          console.log(error);
        }
      );
    if (
      systemDetails &&
      systemDetails.factions.length < 6 &&
      systemDetails.factions.length > 0 &&
      !factionisPresent(systemDetails.factions, factionName)
    ) {
      console.log("yes");
      return systemList[i];
      //totalSystemFound++;
      //systems.push(systemList[i]);
    }
  }
  return systems;
}

function factionisPresent(factions, factionName) {
  for (let i = 0; i < factions.length; i++) {
    if (factions[i].name == factionName && factions[i].influence != 0)
      return true;
  }
  return false;
}

function totalPresentFactions(factions) {
  let total = 0;
  for (let i = 0; i < factions.length; i++) {
    if (factions[i].influence != 0) total++;
  }
  return total;
}
function slotisFree(count) {
  return count > 0 && count < 7;
}
