const __ = require("iterate-js");
const discordToken =
  process.env.DISCORDTOKEN || require("../config").discordToken;

const init = require("./Load.js");

module.exports = __.class(
  function(cfg) {
    init(this, cfg);
  },
  {
    connect: function() {
      console.log(discordToken);
      return this.client.login(discordToken.token);
    },
    disconnect: function() {
      return this.client.destroy();
    }
  }
);
