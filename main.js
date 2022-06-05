let game;
window.onload = () => {
  game = new Game();
}

document.getElementById("commands").onclick = (e) => {
  const input = e.target.textContent;
  const commandDict = {
    "防御": "X",
    "溜め": "C",
    "攻撃": "V"
  }
  const key = commandDict[input];
  if (key === undefined) return;
  const keyDownEvent = new KeyboardEvent("keydown", { "key": key });
  document.dispatchEvent(keyDownEvent);

  if (!game.isStart) {
    game.update();
    game.isStart = true;
  }
}

document.onkeydown = (e) => {
  const commandDict = {
    "X": "防御",
    "C": "溜め",
    "V": "攻撃"
  }
  const key = e.key.toUpperCase();
  entry.innerText = commandDict[key];
}

class Game {
  constructor() {
    this.isStart = false;
    this.isOver = false;
    this.period = 2000;
    this.phase = 0;

    this.signal = new Signal("signal");
    this.player = new Player();
    this.opponent = new Opponent();
    this.messageDOM = document.getElementById("message");
    this.reloadButton = document.getElementById("reload-button");
    this.reloadButton.onclick = location.reload.bind(location);
    this.reloadButton.style.visibility = "hidden";
  }

  update() {
    if (this.phase === 0) {
      this.signal.turnOn(0);

    } else if (this.phase === 1) {
      this.signal.turnOn(1);

    } else if (this.phase === 2) {
      this.signal.turnOn(2);

      if (this.player.entryDOM.innerText === "") {
        this.isOver = true;
        this.messageDOM.innerText = "[ERROR] No command is entered...";
      }

      this.player.sendCommand();
      this.opponent.sendCommand();

      this.checkGameSet();

    } else if (this.phase === 3) {
      this.signal.turnOffAll();

      this.player.updateCharge();
      this.opponent.updateCharge();

      this.player.commandDOM.innerText = "";
      this.opponent.commandDOM.innerText = "";
    }

    if (!this.isOver) {
      this.phase = (this.phase + 1) % 4;
      setTimeout(this.update.bind(this), this.period / 4);
    } else {
      this.reloadButton.style.visibility = "visible";
    }
  }

  checkGameSet() {
    if (this.player.commandDOM.innerText === "攻撃") {
      if (this.opponent.commandDOM.innerText === "溜め" || this.player.charge.count >= 3) {
        this.isOver = true;
        this.messageDOM.innerText = "[GAME SET] You win!";
      }
    } else if (this.opponent.commandDOM.innerText === "攻撃") {
      if (this.player.commandDOM.innerText === "溜め" || this.opponent.charge.count >= 3) {
        this.isOver = true;
        this.messageDOM.innerText = "[GAME SET] You lose...";
      }
    }
  }
}

class Signal {
  constructor(id) {
    this.dom = document.getElementById(id);
    this.turnOffAll();
  }

  turnOn(index) {
    this.dom.children[index].style.visibility = "visible";
  }

  turnOff(index) {
    this.dom.children[index].style.visibility = "hidden";
  }

  turnOffAll() {
    for (let i = 0; i < 3; i++) {
      this.turnOff(i);
    }
  }
}

class Charge extends Signal {
  constructor(id) {
    super(id);
  }

  add() {
    const count = this.count;
    if (count >= 3) return;
    this.turnOn(count);
  }

  sub() {
    const count = this.count;
    if (count <= 0) return;
    this.turnOff(count-1);
  }

  get count() {
    let count = 0;
    for (let i = 0; i < 3; i++) {
      if (this.dom.children[i].style.visibility === "visible") {
        count++;
      } else {
        return count;
      }
    }
    return count;
  }
}

class Opponent {
  constructor() {
    this.commandDOM = document.getElementById("opponent-command");
    this.charge = new Charge("opponent-charge");
  }

  updateCharge() {
    if (this.commandDOM.innerText === "溜め") {
      this.charge.add();
    } else if (this.commandDOM.innerText === "攻撃") {
      this.charge.sub();
    }
  }

  sendCommand() {
    let options = ["防御", "溜め", "攻撃"];
    if (game.player.charge.count === 0) {
      options = options.filter(option => option !== "防御");
    }
    if (this.charge.count === 0) {
      options = options.filter(option => option !== "攻撃");
    }
    if (this.charge.count === 3) {
      options = options.filter(option => option === "攻撃");
    }
    const chioced = options[Math.floor(Math.random() * options.length)];
    this.commandDOM.innerText = chioced;
  }
}

class Player {
  constructor() {
    this.attackButton = document.getElementById("attack-button");
    this.commandDOM = document.getElementById("player-command");
    this.entryDOM = document.getElementById("entry");
    this.charge = new Charge("player-charge");
    this.charge.turnOffAll();
    this.attackButton.style.visibility = "hidden";
  }

  updateCharge() {
    if (this.commandDOM.innerText === "溜め") {
      this.charge.add();
    } else if (this.commandDOM.innerText === "攻撃") {
      this.charge.sub();
    }

    if (this.charge.count <= 0) {
      this.attackButton.style.visibility = "hidden";
    } else {
      this.attackButton.style.visibility = "visible";
    }
  }

  sendCommand() {
    this.commandDOM.innerText = this.entryDOM.innerText;
    this.entryDOM.innerText = "";
  }
}
