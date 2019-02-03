const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

// Create PlayerReportSchema
const PlayerReportSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
    default: "Undefined"
  },
  plateform: {
    type: String,
    default: "none"
  },
  Wanted: {
    type: Boolean,
    default: false
  }
});

PlayerReportSchema.plugin(uniqueValidator);

module.exports = PlayerReport = mongoose.model(
  "playerReport",
  PlayerReportSchema
);
