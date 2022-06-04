let period = 2000;
let phase = 0;
let isOver = false;

const commandDict = {
  "防御": "X",
  "溜め": "C",
  "攻撃": "V"
}

const message = new class {
  constructor() {
    this.dom = document.getElementById("message");
  }

  send(message) {
    this.dom.innerText = message;
  }
}

const opponent = new class {
  constructor() {
    this.command = document.getElementById("opponent-command");
    this.charge = document.getElementById("opponent-charge");
    this.chargeCount = 0;
  }

  chioceCommand() {
    let options = Object.keys(commandDict);
    if (player.chargeCount === 0) {
      options = options.filter(option => option !== "防御");
    }
    if (this.chargeCount === 0) {
      options = options.filter(option => option !== "攻撃");
    }
    if (this.chargeCount === 3) {
      options = options.filter(option => option === "攻撃");
    }
    const chioced = options[Math.floor(Math.random() * options.length)];
    this.command.innerText = chioced;
  }

  clearCommand() {
    this.command.innerText = "";
  }
}

const player = new class {
  constructor() {
    this.command = document.getElementById("player-command");
    this.charge = document.getElementById("opponent-charge");
    this.entry = document.getElementById("entry");
    this.chargeCount = 0;
  }

  sendCommand() {
    this.command.innerText = entry.innerText;
    this.entry.innerText = "";
  }

  clearCommand() {
    this.command.innerText = "";
  }
}

const signal = new class {
  constructor() {
    this.dom = document.getElementById("signal");
    this.turnOffAll();
  }

  turnOn(index) {
    this.dom.children[index].style.visibility = "visible";
  }

  turnOffAll() {
    for (let i = 0; i < 3; i++) {
      this.dom.children[i].style.visibility = "hidden";
    }
  }
}

document.getElementById("commands").onclick = (e) => {
  const input = e.target.textContent;
  const key = commandDict[input];
  const keyDownEvent = new KeyboardEvent("keydown", { "key": key });
  document.dispatchEvent(keyDownEvent);
}

document.onkeydown = (e) => {
  entry.innerText = Object.keys(commandDict).filter(k => {
    return commandDict[k] === e.key.toUpperCase();}
  );
}

const startButton = document.getElementById("start-button");
startButton.onclick = () => {
  update();
  startButton.style.visibility = "hidden";
}

const update = () => {
  if (phase === 0) {
    signal.turnOn(0);

  } else if (phase === 1) {
    signal.turnOn(1);

  } else if (phase === 2) {
    signal.turnOn(2);
    if (entry.innerText === "") {
      isOver = true;
      message.send("[ERROR] No command is entered");
    }

    opponent.chioceCommand();
    player.sendCommand();


  } else if (phase === 3) {
    signal.turnOffAll();
    opponent.clearCommand();
    player.clearCommand();
  }

  if (!isOver) {
    phase = (phase + 1) % 4;
    setTimeout(update, period / 4);
  }
}
