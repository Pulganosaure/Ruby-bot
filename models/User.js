const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

// Create UserSchema
const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'email required'],
  },
  name: {
    type: String,
  },
  passwordHash: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
})

UserSchema.plugin(uniqueValidator)

module.exports = User = mongoose.model('users', UserSchema)
