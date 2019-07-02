module.exports = {
  commands: {
    //do not use cap letter in the function name or the command will not be detected
    commandtest: message => {
      //message is the object message who trigered this command.
      message.reply("this is the commandTest o/");
    }
  },
  functions: {
    functionTest: () => {
      // bot.[module].functionTest
      return null;
    }
  }
};
