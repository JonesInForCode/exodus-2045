import Phaser from "phaser";
import BootScene from "./scenes/BootScene.js";
import CoordinatorTerminal from "./scenes/CoordinatorTerminal.js";
import MapView from "./scenes/MapView.js";
import GameUI from "./scenes/GameUI.js";

// Game configuration
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "phaser-game",
  backgroundColor: "#0f172a",
  scene: [BootScene, CoordinatorTerminal, MapView, GameUI],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: false,
    pixelArt: true,
  },
};

// Initialize game
const game = new Phaser.Game(config);

// Global game state
game.registry.set("gameState", {
  coordinatorName: "Sarah Martinez",
  currentShift: 1,
  systemTime: new Date(),
  timeSpeed: 1,
  caravans: [],
  messages: [],
  resources: {
    supplyDrops: 5,
    activeDrones: 3,
    fuelDepots: 8,
    medicalTeams: 2,
  },
  ui: {
    selectedCaravan: null,
    currentView: "terminal",
  },
});

// Handle window resize
window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});

// Global keyboard shortcuts
document.addEventListener("keydown", (event) => {
  const gameState = game.registry.get("gameState");

  switch (event.code) {
    case "Space":
      event.preventDefault();
      gameState.timeSpeed = gameState.timeSpeed === 0 ? 1 : 0;
      game.registry.set("gameState", gameState);
      game.events.emit("timeSpeedChanged", gameState.timeSpeed);
      break;
    case "Digit1":
      gameState.timeSpeed = 1;
      game.registry.set("gameState", gameState);
      game.events.emit("timeSpeedChanged", 1);
      break;
    case "Digit2":
      gameState.timeSpeed = 2;
      game.registry.set("gameState", gameState);
      game.events.emit("timeSpeedChanged", 2);
      break;
    case "Digit4":
      gameState.timeSpeed = 4;
      game.registry.set("gameState", gameState);
      game.events.emit("timeSpeedChanged", 4);
      break;
  }
});

console.log("🛰️ Exodus 2045 Coordination System Online");
