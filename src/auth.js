module.exports = {
  connect: function() {
    return bot.client.login(
      "NDk1MjAyOTg4MTU2MTI1MTg0.Do-pbQ.jqkHeVDG8plKsmSAGtVbfCvs0Z0"
    );
  },
  disconnect: function() {
    return bot.client.destroy();
  }
};
