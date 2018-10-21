const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

// Create UserSchema
const ProfilSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  userId: {
    type: String,
  },
  discordId: {
    type: String,
  },
  Informations: {
    gw2ApiKey: String,
    archivementPoints: Number,
  },
  Permissions: {
    event_manager: Boolean,
    event_creator: Boolean,
    user_manager: Boolean,
    permissions_manager: Boolean,
    ressources_manager: Boolean,
    ressources_creator: Boolean,
  },
  Statistiques: {
    eventCreated: Number,
    eventParticipated: Number,
    picturePosted: Number,
    messagePosted: Number,
  },
})

ProfilSchema.plugin(uniqueValidator)



module.exports = Profil = mongoose.model('profil', ProfilSchema)
