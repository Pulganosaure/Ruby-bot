const Event = require("../models/EventModel.js");
const User = require("../models/User.js");
const Profil = require("../models/Profil.js");
const Discord = require("discord.js");

module.exports = function(bot) {
  bot.event = {
    displayEventList: async message => {
      const Events = await getFuturEvents();
      const embed = new Discord.RichEmbed().setColor(0x00ae86);
      Events.slice(0, 10).map(event => {
        embed.addField(event.title, event._id);
      });
      message.reply({ embed });
    },
    displayEventDetails: async message => {
      if (!message.args) {
        message.reply("merci de précisé un Id valide");
        return 0;
      }
      const Event = await getEventById(message.args.shift());
      if (Event == null) {
        message.reply("aucun évenement ne correspond a cet id");
        return 0;
      }
      let names = [];
      if (Event.participants.length != 0)
        names = await GetNameList(Event.participants);
      renderEventEmbed(message, Event, names);
    },

    joinEventById: async (message, details) => {
      if (!details[1]) {
        message.reply("Merci de précisé un id d'événement.");
        return false;
      }
      const Event = await getEventById(details[1]);
      if (Event) {
        const UserId = await getUserIdByDiscordUsername(
          message.author.username + "#" + message.author.discriminator
        );
        if (!UserId || UserId === "") {
          message.reply(
            "Impossible de trouver votre profil, merci de vérifier que le pseudo discord est correct"
          );
          return false;
        }
        if (Event.participants.includes(UserId.userId)) {
          message.reply(
            "Vous participez déjà à l'événement, utilisez !leave :eventId: pour vous désinscrire"
          );
          return false;
        }

        AddUserToEvent(details[1], UserId.userId);
        message.reply(
          "votre participation a l'évenement \"" +
            Event.title +
            '" a bien été enregistré'
        );
      } else {
        message.reply("no event found for this Event");
      }
    },
    leaveEventById: async (message, details) => {
      if (!details[1]) {
        message.reply("Merci de précisé un id d'événement.");
        return false;
      }
      const Event = await getEventById(details[1]);
      if (Event) {
        const UserId = await getUserIdByDiscordUsername(
          message.author.username + "#" + message.author.discriminator
        );
        if (!UserId.discordId || UserId.discordId === "") {
          message.reply(
            "Impossible de trouver votre profil, merci de vérifier que le pseudo discord est correct"
          );
          return false;
        }
        if (!Event.participants.includes(UserId.userId)) {
          message.reply(
            "Vous ne participez pas à cet événement, utilisez !join :eventId: pour vous inscrire"
          );
          return false;
        }
        removeUserToEvent(details[1], UserId.userId);
        message.reply(
          "votre participation a l'évenement \"" +
            Event.title +
            '" a bien été enregistré'
        );
      } else {
        message.reply("no event found for this Event");
      }
    }
  };
  async function GetNameList(userIds) {
    let listName = [];
    await Promise.all(
      userIds.map(async userId => {
        const response = await get_username(userId);
        const user = await response;
        listName.push(user.name);
      })
    );
    return listName;
  }

  function renderEventEmbed(message, details, users) {
    if (!users.length) {
      users.push("aucun");
    }
    const embed = new Discord.RichEmbed()
      .setColor(0x00ae86)
      .addField(details.title, details.description)
      .addField(
        "horaires :",
        "le: " +
          details.startDate.getDate() +
          "/" +
          details.startDate.getMonth() +
          "/" +
          details.startDate.getFullYear()
      )
      .addBlankField(true)
      .addField("participants", users.join("\n"));
    message.reply({ embed });
  }

  async function get_username(userID) {
    return await User.findOne({ _id: userID }).then(res => (user = res));
  }

  async function AddUserToEvent(eventId, userId) {
    const blabla = await Event.findById({ _id: eventId }, function(err, event) {
      event.participants.push(userId);
      event.save();
    });
  }

  async function removeUserToEvent(eventId, userId) {
    const blabla = await Event.findById({ _id: eventId }, function(err, event) {
      index = event.participants.indexOf(userId);
      event.participants.splice(index, 1);
      event.save();
    });
  }
};

async function getEventById(eventId) {
  return await Event.findOne({ _id: eventId });
}

async function getUserIdByDiscordUsername(discordUsernamme) {
  return await Profil.findOne({ discordId: discordUsernamme });
}

async function getFuturEvents(channel) {
  const newDate = new Date();
  return (results = await Event.find()
    .where("startDate")
    .gte(newDate));
}
