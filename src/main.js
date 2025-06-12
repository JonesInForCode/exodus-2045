import Phaser from "phaser";
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
  scene: [CoordinatorTerminal, MapView, GameUI],
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

// Loading simulation
function simulateLoading() {
  const loadingElement = document.getElementById("loading");
  const loadingFill = document.getElementById("loading-fill");

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      // Hide loading screen and start game
      setTimeout(() => {
        loadingElement.classList.add("hidden");
        initializeGame();
      }, 500);
    }

    loadingFill.style.width = `${progress}%`;
  }, 200);
}

// Initialize Phaser game
function initializeGame() {
  const game = new Phaser.Game(config);

  // Global game state - accessible by all scenes
  game.registry.set("gameState", {
    currentShift: 1,
    coordinatorName: "Sarah Martinez",
    systemTime: new Date(),
    caravans: [],
    messages: [],
    resources: {
      availableSupplyDrops: 5,
      activeDrones: 3,
      fuelDepots: 8,
    },
    ui: {
      selectedCaravan: null,
      currentView: "terminal",
      timeSpeed: 1, // 1x, 2x, 4x speed multiplier
    },
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
  });

  // Global key bindings
  document.addEventListener("keydown", (event) => {
    switch (event.code) {
      case "Space":
        event.preventDefault();
        // Toggle pause/play
        const currentSpeed = game.registry.get("gameState").ui.timeSpeed;
        game.registry.set("gameState.ui.timeSpeed", currentSpeed === 0 ? 1 : 0);
        break;
      case "Digit1":
        game.registry.set("gameState.ui.timeSpeed", 1);
        break;
      case "Digit2":
        game.registry.set("gameState.ui.timeSpeed", 2);
        break;
      case "Digit4":
        game.registry.set("gameState.ui.timeSpeed", 4);
        break;
    }
  });

  console.log("🛰️ Exodus 2045 Coordination System Online");
  console.log("📋 Phase 1: Foundation - Terminal Interface Active");
}

// Start loading process
document.addEventListener("DOMContentLoaded", () => {
  simulateLoading();
});
