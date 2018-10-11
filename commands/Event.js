const Event = require('../models/EventModel.js')
const User = require('../models/User.js')
const Discord = require('discord.js')
//check if a event is starting in the next 10 minutes
module.exports = {

  check_NextEvent: async function(channel) {
    const newDate = new Date()
    const results = await Event.find().where('startDate').gte(newDate)
    results.sort()
    console.log(results)
    this.eventRender(channel, results[results.length-1])
  },

  eventRender: function(message, details)
  {
    let participants = []
    details.participants.map(userID =>{
      participants.push(get_username(userID))
      console.log(participants)
    })

    const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .addField(details.title, details.description)
    .addField("horaires :", "le: " + details.startDate.getDate() + "/" + details.startDate.getMonth() + "/" + details.startDate.getFullYear())
    .addBlankField(true)
    .addField("participants",participants.join('\n') )
    message.reply({embed})
  }
}


async function get_username(userID)
{
  const user = await User.findOne({_id: userID })
  console.log("username:" +user.name)
  return user.name
}
