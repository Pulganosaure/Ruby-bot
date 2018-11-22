const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

// Create UserSchema
const EDPOIShema = new Schema({
  category: {
    name: {
      type: String
    },
    id: {
      type: Number
    }
  },
  poidetails: {},
  systemName: {
    type: String
  },
  coords: {
    system_X: {
      type: Number,
      default: 0.0
    },
    system_Y: {
      type: Number,
      default: 0.0
    },
    system_Z: {
      type: Number,
      default: 0.0
    }
  }
});

EDPOIShema.plugin(uniqueValidator);

module.exports = Edpoi = mongoose.model("edpoi", EDPOIShema);
