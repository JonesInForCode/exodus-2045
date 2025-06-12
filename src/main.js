// Enhanced main.js - Game initialization with proper system integration
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
  scene: [GameUI, CoordinatorTerminal, MapView], // GameUI first so it runs in background
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

// Enhanced loading simulation with more realistic progress
function simulateLoading() {
  const loadingElement = document.getElementById("loading");
  const loadingFill = document.getElementById("loading-fill");

  const loadingSteps = [
    { progress: 15, message: "🛰️ Establishing satellite uplink..." },
    { progress: 35, message: "📡 Loading caravan tracking data..." },
    { progress: 55, message: "🗺️ Calibrating GPS coordinates..." },
    { progress: 75, message: "⚡ Initializing crisis management protocols..." },
    { progress: 90, message: "🖥️ Starting coordinator terminal..." },
    { progress: 100, message: "✅ System ready" },
  ];

  let stepIndex = 0;

  const interval = setInterval(() => {
    console.log("simulateLoading: started");
    if (stepIndex >= loadingSteps.length) {
      clearInterval(interval);

      // Hide loading screen and start game
      setTimeout(() => {
        console.log("simulateLoading: hiding loading, calling initializeGame");
        loadingElement.classList.add("hidden");
        console.log("initializing game...")
        initializeGame();
        console.log("Game initialized...")
      }, 500);
      return;
    }

    const step = loadingSteps[stepIndex];
    loadingFill.style.width = `${step.progress}%`;

    // Update loading message
    const loadingTexts = document.querySelectorAll(".system-info");
    if (loadingTexts.length > 0) {
      loadingTexts[0].innerHTML = `${step.message}<br />
        Phase 1: Foundation Systems<br />
        Building Terminal Interface...<br />
        Loading Game Data...`;
    }

    stepIndex++;
  }, 300 + Math.random() * 400); // Variable timing for realism
}

// Initialize Phaser game with enhanced state management
function initializeGame() {
  console.log("inside initializeGame function");
  const game = new Phaser.Game(config);

  // Enhanced global game state
  game.registry.set("gameState", {
    // Core game info
    currentShift: 1,
    coordinatorName: "Sarah Martinez",
    coordinatorLevel: 3,
    systemTime: new Date(),

    // Game session data
    sessionStartTime: new Date(),
    totalDecisionsMade: 0,
    successfulOperations: 0,

    // Current operational state
    caravans: [],
    messages: [],
    activeEvents: [],

    // Global resources (will be loaded from ResourceManager)
    resources: {
      availableSupplyDrops: 5,
      activeDrones: 3,
      fuelDepots: 8,
      medicalTeams: 2,
      communicationSatellites: 4,
      weatherStations: 12,
    },

    // UI state
    ui: {
      selectedCaravan: null,
      selectedMessage: null,
      currentView: "terminal",
      timeSpeed: 1, // 1x, 2x, 4x speed multiplier
      showNotifications: true,
      soundEnabled: true,
    },

    // Statistics tracking
    statistics: {
      totalCaravansGuided: 0,
      totalMembersProtected: 0,
      resourcesAllocated: 0,
      emergenciesHandled: 0,
      avgResponseTime: 0,
    },
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
  });

  // Enhanced global key bindings
  document.addEventListener("keydown", (event) => {
    const gameState = game.registry.get("gameState");

    switch (event.code) {
      case "Space":
        event.preventDefault();
        // Toggle pause/play
        const currentSpeed = gameState.ui.timeSpeed;
        gameState.ui.timeSpeed = currentSpeed === 0 ? 1 : 0;
        game.registry.set("gameState", gameState);
        game.events.emit("timeSpeedChanged", gameState.ui.timeSpeed);
        break;

      case "Digit1":
        gameState.ui.timeSpeed = 1;
        game.registry.set("gameState", gameState);
        game.events.emit("timeSpeedChanged", 1);
        break;

      case "Digit2":
        gameState.ui.timeSpeed = 2;
        game.registry.set("gameState", gameState);
        game.events.emit("timeSpeedChanged", 2);
        break;

      case "Digit4":
        gameState.ui.timeSpeed = 4;
        game.registry.set("gameState", gameState);
        game.events.emit("timeSpeedChanged", 4);
        break;

      case "KeyM":
        event.preventDefault();
        // Toggle to map view (when implemented)
        console.log("🗺️ Map view toggle requested (Phase 2 feature)");
        break;

      case "KeyR":
        event.preventDefault();
        // Quick radio channel
        console.log("📻 Radio channel shortcut (Phase 2 feature)");
        break;

      case "Escape":
        event.preventDefault();
        // Return to main terminal view
        gameState.ui.currentView = "terminal";
        game.registry.set("gameState", gameState);
        break;
    }
  });

  // Global event listeners for system communication
  game.events.on("caravanStatusUpdate", (caravanData) => {
    const gameState = game.registry.get("gameState");
    // Update caravan in the global state
    const index = gameState.caravans.findIndex((c) => c.id === caravanData.id);
    if (index !== -1) {
      gameState.caravans[index] = caravanData;
    } else {
      gameState.caravans.push(caravanData);
    }
    game.registry.set("gameState", gameState);
  });

  game.events.on("resourceUpdate", (resourceData) => {
    const gameState = game.registry.get("gameState");
    gameState.resources = { ...gameState.resources, ...resourceData };
    game.registry.set("gameState", gameState);
  });

  game.events.on("emergencyEvent", (eventData) => {
    const gameState = game.registry.get("gameState");
    gameState.activeEvents.push(eventData);
    game.registry.set("gameState", gameState);
    console.log("🚨 Emergency event triggered:", eventData.title);
  });

  // Performance monitoring
  let frameCount = 0;
  let lastFPSCheck = Date.now();

  game.events.on("step", () => {
    frameCount++;
    const now = Date.now();
    if (now - lastFPSCheck >= 5000) {
      // Check every 5 seconds
      const fps = Math.round(frameCount / 5);
      if (fps < 45) {
        console.warn(`⚠️ Low FPS detected: ${fps}`);
      }
      frameCount = 0;
      lastFPSCheck = now;
    }
  });

  // Auto-save functionality (Phase 2 preparation)
  setInterval(() => {
    const gameState = game.registry.get("gameState");
    // In Phase 2, this will save to localStorage
    console.log("💾 Auto-save checkpoint (feature coming in Phase 2)");
  }, 300000); // Every 5 minutes

  // Initialize game statistics tracking
  const stats = {
    sessionStart: new Date(),
    decisions: 0,
    successful: 0,
    emergencies: 0,
  };

  // Development helper functions (remove in production)
  if (typeof window !== "undefined") {
    window.gameDebug = {
      getState: () => game.registry.get("gameState"),
      setState: (newState) => game.registry.set("gameState", newState),
      triggerEmergency: () =>
        game.events.emit("emergencyEvent", {
          id: "debug_emergency",
          title: "Debug Emergency",
          description: "Test emergency event",
          priority: "high",
        }),
      speedUp: () => game.events.emit("timeSpeedChanged", 4),
      getStats: () => stats,
    };
  }

  console.log("🛰️ Exodus 2045 Coordination System Online");
  console.log("📋 Phase 1: Foundation Systems Active");
  console.log("🎮 Controls: SPACE (pause), 1/2/4 (speed), M (map), R (radio)");
  console.log("🔧 Debug: Use window.gameDebug for development tools");
}

// Error handling
window.addEventListener("error", (event) => {
  console.error("💥 Game error:", event.error);
  // In production, this would send error reports
});

// Start loading process when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("🎮 Starting Exodus 2045...");
  simulateLoading();
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
