module.exports = {
  //Boom
  boom: {
    name: "Boom",
    minDuration: 3,
    maxDuration: 28,
    preparation: 2,
    cooldown: 2,
    priority: 0
  },
  //faillite
  bust: {
    name: "Bust",
    minDuration: 2,
    maxDuration: 3,
    preparation: 28,
    cooldown: 2,
    priority: 0
  },
  //troubles civile
  civilUnrest: {
    maxDuration: 7,
    name: "Civil Unrest",
    minDuration: 3,
    preparation: 1,
    cooldown: 3,
    priority: 0
  },
  //guerre civile
  civilWar: {
    name: "Civil War",
    minDuration: 4,
    maxDuration: 28,
    preparation: 3,
    cooldown: 0,
    priority: 2
  },
  //election
  election: {
    name: "Election",
    minDuration: 4,
    maxDuration: 5,
    preparation: 3,
    cooldown: 2,
    priority: 1
  },
  //expansion
  expansion: {
    name: "",
    minDuration: 3,
    maxDuration: 7,
    preparation: 5,
    cooldown: 2,
    priority: 1
  },
  //famine
  famine: {
    name: "Famine",
    minDuration: 3,
    maxDuration: 28,
    preparation: 3,
    cooldown: 25,
    priority: 0
  },
  //investment
  investment: {
    name: "",
    minDuration: 5,
    maxDuration: 5,
    preparation: 0,
    cooldown: 0,
    priority: 1
  },
  //lockdown
  lockdown: {
    name: "Lockdown",
    minDuration: 3,
    maxDuration: 14,
    preparation: 1,
    cooldown: 1,
    priority: 1
  },
  //Epidémie
  outbreak: {
    name: "OutBreak",
    minDuration: 3,
    maxDuration: 28,
    preparation: 4,
    cooldown: 7,
    priority: 0
  },
  //retreat
  retreat: {
    name: "Retreat",
    minDuration: 5,
    maxDuration: 5,
    preparation: 1,
    cooldown: 0,
    priority: 1
  },
  //war
  war: {
    name: "War",
    minDuration: 4,
    maxDuration: 28,
    preparation: 3,
    cooldown: 0,
    priority: 2
  },
  //civilLiberty
  civilLiberty: {
    name: "Civil Liberty",
    minDuration: 0,
    maxDuration: 0,
    preparation: 0,
    cooldown: 0,
    priority: 0
  },
  //default:
  default: {
    name: "Unknown Please Report it",
    minDuration: 0,
    maxDuration: 0,
    preparation: 0,
    cooldown: 0,
    priority: 0
  }
};
