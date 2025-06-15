// Enhanced main.js - Game initialization with proper system integration
import CoordinatorTerminal from "./scenes/CoordinatorTerminal.js";
import MapView from "./scenes/MapView.js";
import GameUI from "./scenes/GameUI.js";
import BootScene from "./scenes/BootScene.js";
import RadioView from "./scenes/RadioView.js";

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "phaser-game",
  backgroundColor: "#0f172a",
  scene: [BootScene, GameUI, CoordinatorTerminal, MapView, RadioView],
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
  callbacks: {
    postBoot: function (game) {
      // Ensure GameUI is always running in the background
      game.scene.run("GameUI");
    },
  },
};

// Error handling
window.addEventListener("error", (event) => {
  console.error("💥 Game error:", event.error);
  // In production, this would send error reports
});

// Start loading process when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("🎮 Starting Exodus 2045...");

  // Create game immediately - BootScene will handle the rest
  const game = new Phaser.Game(config);

  // Store global reference for debugging
  if (typeof window !== "undefined") {
    window.game = game;
  }
});

// Prevent context menu on right click (for game controls)
document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

// Handle page visibility changes (pause when tab is hidden)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    console.log("⏸️ Tab hidden - consider pausing game");
    // In Phase 2, automatically pause when tab is not visible
  } else {
    console.log("▶️ Tab visible - game can resume");
  }
});
