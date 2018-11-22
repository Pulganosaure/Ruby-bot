const Edpoi = require("../models/EDPOI");
const axios = require("axios");
const Discord = require("discord.js");
module.exports = function(bot) {
  bot.eliteDangerous = {
    findPOI: async (poi, playerSystem, message) => {
      if (!poi || !playerSystem) {
        message.reply("Incorrect Command syntaxe `!find poitype : position`");
        return 1;
      }
      poi = poi.toUpperCase();
      const PlayerSystem = await axios.get(
        `https://www.edsm.net/api-v1/system/systemName=${playerSystem}&showCoordinates=1`
      );
      if (PlayerSystem === {}) {
        message.reply("Player system not found");
        return 1;
      }
      let systemList = [];
      let system = {};
      switch (poi) {
        case "THARGOIDSITE":
          systemList = await GetPoiList(poi);
          if (!systemList) return 1;
          system = findCloserSystem(systemList, message);
          replytemplate(system, message);
          break;
        case "THARGOIDSCOUTCRASH":
          systemList = await GetPoiList(poi);
          system = findCloserSystem(systemList, message);
          replytemplate(system, message);
          break;
        case "GUARDIANRUIN":
          systemList = await GetPoiList(poi);
          system = findCloserSystem(systemList, message);
          replytemplate(system, message);
          break;
        case "GUARDIANSTRUCTURE":
          systemList = await GetPoiList(poi);
          system = findCloserSystem(systemList, message);
          replytemplate(system, message);
          break;
        default:
          message.reply(
            "Incorrect POI type : `thargoidsite`, `thargoidscoutcrash`, `guardianruin`, `guardianstructure`"
          );
      }
    }
  };

  async function GetPoiList(type) {
    console.log(type);
    //const PoiList = await Edpoi.find({ "category.name": type });
    const PoiList = await Edpoi.find();
    console.log(PoiList);
  }

  function findCloserSystem(systemList) {
    if (!systemList) return {};
    let result = {};
    systemList.map(system => {
      const distance = result.distance > calculDistance(system.Coords);
      if (result === {} || distance < result.distance) {
        result = { distance: distance, system: system };
      }
    });
    return result.system;
  }

  // calcul distance between 2 points in R3
  function calculDistance(playerCoords, systemCoords) {
    let distanceX = systemCoords.System_X - playerCoords.System_X;
    let distanceY = systemCoords.System_Y - playerCoords.System_Y;
    let distanceZ = systemCoords.System_Z - playerCoords.System_Z;
    return Math.sqrt(distanceX + distanceY + distanceZ);
  }

  function replytemplate(system, message) {
    const embed = new Discord.RichEmbed()
      .setColor(0x00ae86)
      .setTitle(system.systemName + system.Body)
      .addField(
        "Coordinates: ",
        system.Coords.System_X +
          "/" +
          system.Coords.System_Y +
          "/" +
          system.Coords.System_Z
      );
    message.reply({ embed });
  }
};
