const mongoose = require('mongoose')

const db = require('./config.js').keys
// CONNECT to Mongodb

module.exports = {
  connectToDataBase: function()  {
  mongoose
    .connect(db.mongo.url(), db.mongo.options)
    .then(() => console.log('Mongodb Connected'))
    .catch(err => console.error(err))
  }
};
