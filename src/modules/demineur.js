module.exports = {
  commands: {
    //do not use cap letter in the function name or the command will not be detected
    demineur: message => {
      let args = message.args.join(" ").split(" ");
      if (parseInt(args[0]) <= 0) return message.reply("tié un bonobo toi");
      if (parseInt(args[0]) >= 15) return message.reply("14 max");

      if (Number.isInteger(parseInt(args[0])) && parseInt(args[0]) < 15)
        message.reply(
          "mines = " +
            Math.floor(args[0] * 2.5) +
            "\n" +
            generateGame(args[0], args[0])
        );
      else message.reply("incorrect number");
      //message is the object message who trigered this command.
    }
  },
  functions: {
    functionTest: () => {
      // bot.[module].functionTest
      return null;
    }
  }
};

function generateGame(size, bombs) {
  map = [];
  map.length = size;
  for (let i = 0; i < map.length; i++) {
    let row = [];
    row.length = size;
    map[i] = row;
  }
  map = generateBombs(map, bombs, size);
  map = fillMap(map);

  return formateMapToText(map);
}

function formateMapToText(map) {
  for (let i = 0; i < map.length; i++) {
    map[i] = "||" + map[i].join("|| ||") + "||";
  }
  return map.join("\n");
}
function generateBombs(map, bombs, size) {
  for (let i = 0; i < bombs; i++) {
    let coords = { x: 0, y: 0 };
    do coords = getCoords(size);
    while (map[coords.x][coords.y] == "💣");
    map[coords.x][coords.y] = "💣";
  }

  return map;
}

function getCoords(size) {
  return { x: getRandomInt(size), y: getRandomInt(size) };
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function calculateBombsAround(map, x, y, size) {
  let count = 0;
  let minus = { x: 0, y: 0 };
  let bonus = { x: 0, y: 0 };
  if (x == 0) {
    minus.x = +1;
  } else if (x == size - 1) {
    bonus.x = -1;
  }
  if (y == 0) {
    minus.y = +1;
  } else if (y == size - 1) {
    bonus.y = -1;
  }

  for (let i = x - 1 + minus.x; i <= x + 1 + bonus.x; i++) {
    for (let j = y - 1 + minus.y; j <= y + 1 + bonus.y; j++) {
      if (map[i][j] == "💣") count++;
    }
  }
  return count;
}

function getEmoteNumber(number) {
  emoteList = ["0⃣", "1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"];
  return emoteList[number];
}

function fillMap(map) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] != "💣") {
        map[i][j] = getEmoteNumber(calculateBombsAround(map, i, j, map.length));
      }
    }
  }
  return map;
}
