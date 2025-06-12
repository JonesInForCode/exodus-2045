// Phaser is loaded globally from CDN, no import needed
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
        const gameState = game.registry.get("gameState");
        const currentSpeed = gameState.ui.timeSpeed;
        gameState.ui.timeSpeed = currentSpeed === 0 ? 1 : 0;
        game.registry.set("gameState", gameState);
        break;
      case "Digit1":
        const gameState1 = game.registry.get("gameState");
        gameState1.ui.timeSpeed = 1;
        game.registry.set("gameState", gameState1);
        break;
      case "Digit2":
        const gameState2 = game.registry.get("gameState");
        gameState2.ui.timeSpeed = 2;
        game.registry.set("gameState", gameState2);
        break;
      case "Digit4":
        const gameState4 = game.registry.get("gameState");
        gameState4.ui.timeSpeed = 4;
        game.registry.set("gameState", gameState4);
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
