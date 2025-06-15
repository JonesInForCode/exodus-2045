import Phaser from "phaser";
import TimeController from "../systems/TimeController";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
    this.loadingElement = null;
    this.loadingFill = null;
  }

  preload() {
    // Create basic assets
    this.load.image(
      "pixel",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    );

    this.load.on("complete", () => {
      console.log("🚀 Boot assets loaded, starting boot sequence...");
    });
  }

  create() {
    console.log("🚀 Boot sequence starting...");

    // Set up global event listeners that main.js used to handle
    this.setupGlobalEventListeners();

    // Start the boot sequence
    this.simulateLoading();
  }

  simulateLoading() {
    this.loadingElement = document.getElementById("loading");
    this.loadingFill = document.getElementById("loading-fill");

    const loadingSteps = [
      { progress: 15, message: "🛰️ Establishing satellite uplink..." },
      { progress: 35, message: "📡 Loading caravan tracking data..." },
      { progress: 55, message: "🗺️ Calibrating GPS coordinates..." },
      {
        progress: 75,
        message: "⚡ Initializing crisis management protocols...",
      },
      { progress: 90, message: "🖥️ Starting coordinator terminal..." },
      { progress: 100, message: "✅ System ready" },
    ];

    let stepIndex = 0;

    const interval = setInterval(() => {
      if (stepIndex >= loadingSteps.length) {
        clearInterval(interval);

        // Hide loading screen and start login sequence
        setTimeout(() => {
          this.loadingElement.style.transition = "opacity 0.5s ease-out";
          this.loadingElement.style.opacity = "0";

          setTimeout(() => {
            this.loadingElement.classList.add("hidden");
            this.showLoginSequence();
          }, 500);
        }, 300);
        return;
      }

      const step = loadingSteps[stepIndex];
      this.loadingFill.style.width = `${step.progress}%`;

      // Update loading message
      const loadingTexts = document.querySelectorAll(".system-info");
      if (loadingTexts.length > 0) {
        loadingTexts[0].innerHTML = `${step.message}<br />
          Phase 1: Foundation Systems<br />
          Building Terminal Interface...<br />
          Loading Game Data...`;
      }

      stepIndex++;
    }, 300 + Math.random() * 400);
  }

  showLoginSequence() {
    // Create login screen HTML
    const loginHTML = `
      <div id="login-screen" style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0a0a0a;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Courier New', monospace;
        color: #00ff41;
      ">
        <div style="
          width: 500px;
          background: #1a1a1a;
          border: 2px solid #00ff41;
          padding: 40px;
          text-align: center;
        ">
          <h2 style="margin-bottom: 30px; color: #00ff41;">EXODUS COORDINATION SYSTEM</h2>
          <div style="text-align: left; margin-bottom: 20px;">
            <div>User ID: <span id="typing-user" style="background: #333; padding: 2px 4px;"></span><span id="cursor-user" style="animation: blink 1s infinite;">_</span></div>
          </div>
          <div style="text-align: left; margin-bottom: 30px;">
            <div>Password: <span id="typing-pass" style="background: #333; padding: 2px 4px;"></span><span id="cursor-pass" style="animation: blink 1s infinite; display: none;">_</span></div>
          </div>
          <div id="access-granted" style="
            display: none;
            background: #10b981;
            color: #0a0a0a;
            padding: 15px;
            margin: 20px 0;
            font-weight: bold;
          ">ACCESS GRANTED - LEVEL 3 CLEARANCE</div>
          <div id="login-status" style="color: #94a3b8; font-size: 12px;">Authenticating...</div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", loginHTML);

    // Start typing simulation
    this.startTypingSequence();
  }

  startTypingSequence() {
    const userId = "S.MARTINEZ.L3";
    const password = "••••••••••";

    let userIndex = 0;
    let passIndex = 0;

    const userElement = document.getElementById("typing-user");
    const passElement = document.getElementById("typing-pass");
    const userCursor = document.getElementById("cursor-user");
    const passCursor = document.getElementById("cursor-pass");
    const statusElement = document.getElementById("login-status");
    const accessElement = document.getElementById("access-granted");

    // Type user ID
    const typeUser = () => {
      if (userIndex < userId.length) {
        userElement.textContent += userId[userIndex];
        userIndex++;
        setTimeout(typeUser, 120 + Math.random() * 80);
      } else {
        userCursor.style.display = "none";
        passCursor.style.display = "inline";
        setTimeout(typePassword, 300);
      }
    };

    // Type password
    const typePassword = () => {
      if (passIndex < password.length) {
        passElement.textContent += password[passIndex];
        passIndex++;
        setTimeout(typePassword, 100 + Math.random() * 60);
      } else {
        passCursor.style.display = "none";
        setTimeout(showAccessGranted, 800);
      }
    };

    // Show access granted
    const showAccessGranted = () => {
      statusElement.textContent = "Verification complete...";
      setTimeout(() => {
        accessElement.style.display = "block";
        statusElement.textContent = "Initializing coordinator interface...";
        setTimeout(() => this.startFlickerTransition(), 1500);
      }, 1000);
    };

    // Start typing after a brief delay
    setTimeout(typeUser, 800);
  }

  startFlickerTransition() {
    const loginScreen = document.getElementById("login-screen");
    let flickerCount = 0;
    const maxFlickers = 6;

    const flicker = () => {
      loginScreen.style.opacity = loginScreen.style.opacity === "0" ? "1" : "0";
      flickerCount++;

      if (flickerCount < maxFlickers * 2) {
        setTimeout(flicker, 100 + Math.random() * 100);
      } else {
        loginScreen.remove();
        this.initializeGameSystems();
      }
    };

    flicker();
  }

  initializeGameSystems() {
    console.log("🚀 Initializing game systems...");

    // Set up initial game state (moved from main.js)
    this.game.registry.set("gameState", {
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

      // Global resources
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
        timeSpeed: 1,
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

    // Initialize global TimeController
    const timeController = new TimeController(this);
    timeController.initialize();
    this.game.registry.set("timeController", timeController);
    console.log("⏰ Global TimeController initialized");

    // Launch GameUI (persistent tab system)
    this.scene.launch("GameUI");
    console.log("✅ GameUI launched");

    // Launch the initial content scene
    this.scene.launch("CoordinatorTerminal");
    console.log("✅ CoordinatorTerminal launched");

    // Stop the boot scene as it's no longer needed
    this.scene.stop();
    console.log("✅ Boot sequence complete - game systems online");
  }

  setupGlobalEventListeners() {
    // Handle window resize
    window.addEventListener("resize", () => {
      this.game.scale.resize(window.innerWidth, window.innerHeight);
    });

    // Global key bindings (moved from main.js)
    document.addEventListener("keydown", (event) => {
      const gameState = this.game.registry.get("gameState");
      if (!gameState) return; // Not ready yet

      switch (event.code) {
        case "Space":
          event.preventDefault();
          const currentSpeed = gameState.ui.timeSpeed;
          gameState.ui.timeSpeed = currentSpeed === 0 ? 1 : 0;
          this.game.registry.set("gameState", gameState);
          this.game.events.emit("timeSpeedChanged", gameState.ui.timeSpeed);
          break;

        case "Digit1":
          gameState.ui.timeSpeed = 1;
          this.game.registry.set("gameState", gameState);
          this.game.events.emit("timeSpeedChanged", 1);
          break;

        case "Digit2":
          gameState.ui.timeSpeed = 2;
          this.game.registry.set("gameState", gameState);
          this.game.events.emit("timeSpeedChanged", 2);
          break;

        case "Digit4":
          gameState.ui.timeSpeed = 4;
          this.game.registry.set("gameState", gameState);
          this.game.events.emit("timeSpeedChanged", 4);
          break;

        case "KeyM":
          event.preventDefault();
          this.game.events.emit("switchToTab", "map");
          break;

        case "Escape":
          event.preventDefault();
          if (gameState.ui) {
            gameState.ui.currentView = "terminal";
            this.game.registry.set("gameState", gameState);
          }
          break;
      }
    });

    // Set up global game event listeners (moved from main.js)
    this.game.events.on("caravanStatusUpdate", (caravanData) => {
      const gameState = this.game.registry.get("gameState");
      if (!gameState) return;

      const index = gameState.caravans.findIndex(
        (c) => c.id === caravanData.id
      );
      if (index !== -1) {
        gameState.caravans[index] = caravanData;
      } else {
        gameState.caravans.push(caravanData);
      }
      this.game.registry.set("gameState", gameState);
    });

    // Store global reference for debugging
    if (typeof window !== "undefined") {
      window.gameDebug = {
        getState: () => this.game.registry.get("gameState"),
        setState: (newState) => this.game.registry.set("gameState", newState),
        triggerEmergency: () =>
          this.game.events.emit("emergencyEvent", {
            id: "debug_emergency",
            title: "Debug Emergency",
            description: "Test emergency event",
            priority: "high",
          }),
        speedUp: () => this.game.events.emit("timeSpeedChanged", 4),
      };
    }
  }
}
