const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

// Create UserSchema
const EventSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  ownerId: {
    type: String,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: Date.now,
  },
  participants: [],
})

EventSchema.plugin(uniqueValidator)



module.exports = Event = mongoose.model('event', EventSchema)
