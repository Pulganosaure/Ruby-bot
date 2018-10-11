const Event = require('../models/EventModel.js')
const Discord = require('discord.js')
//check if a event is starting in the next 10 minutes
module.exports = {

  check_Event: async function(delay = 600000) {
    const result = await Event.find()
    console.log(result);
  },

  check_NextEvent: async function(channel) {
    const newDate = new Date()
    const results = await Event.find().where('startDate').gte(newDate)
    results.sort()
    console.log(results)
    this.eventRender(channel, results[results.length-1])
  },

  eventRender: function(message, details)
  {
    const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .addField(details.title, details.description)
    .addField("horaires :", "le: " + details.startDate.getDate() + "/" + details.startDate.getMonth() + "/" + details.startDate.getFullYear())
    .addBlankField(true)
    .addField("participants",details.participants.join('\n') )
    message.reply({embed})
  }
}
