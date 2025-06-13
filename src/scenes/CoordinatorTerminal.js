// Updated CoordinatorTerminal.js - Now uses the new systems
import DataManager from "../systems/DataManager.js";
import MessageSystem from "../systems/MessageSystem.js";
import ResourceManager from "../systems/ResourceManager.js";
import TimeController from "../systems/TimeController.js";
import CaravanManager from "../systems/CaravanManager.js";
import Phaser from "phaser";

export default class CoordinatorTerminal extends Phaser.Scene {
  constructor() {
    super({ key: "CoordinatorTerminal" });

    // UI containers
    this.terminalElements = {};
    this.messageContainer = null;
    this.caravanContainer = null;
    this.resourceContainer = null;

    // System managers
    this.dataManager = null;
    this.messageSystem = null;
    this.resourceManager = null;
    this.timeController = null;
    this.caravanManager = null;

    // UI state
    this.currentMessages = [];
    this.currentCaravans = [];
    this.timeDisplay = null;
    this.speedIndicator = null;
    this.timeControlButtons = [];
  }

  preload() {
    // Create simple colored rectangles for UI elements
    this.load.image(
      "pixel",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    );
  }

  async create() {
    console.log("CoordinatorTerminal: create() start");
    console.log("🖥️ Initializing Coordinator Terminal...");

    // Initialize systems
    try {
      await this.initializeSystems();
      console.log("CoordinatorTerminal: initializeSystems finished");
    } catch (e) {
      console.error("CoordinatorTerminal: initializeSystems ERROR", e);
    }

    // Create UI
    this.createTerminalInterface();
    console.log("CoordinatorTerminal: createTerminalInterface finished");
    this.createTimeDisplay();
    console.log("CoordinatorTerminal: createTerminalDisplay finished");
    this.createResourcePanel();
    console.log("CoordinatorTerminal: createResourcePanel finished");
    this.createMessagePanel();
    console.log("CoordinatorTerminal: createMessagePanel finished");
    this.createCaravanPanel();
    console.log("CoordinatorTerminal: createCaravanPanel finished");
    this.createControlPanel();
    console.log("CoordinatorTerminal: createControlPanel finished");

    // Start all systems
    this.startSystems();
    console.log("CoordinatorTerminal: startSystems finished");

    // fade in effect
    this.cameras.main.fadeIn(500, 15, 23, 42);

    console.log("🖥️ Coordinator Terminal Online");

    console.log("CoordinatorTerminal: create() end");
  }

  async initializeSystems() {
    // Initialize data manager first
    this.dataManager = new DataManager();
    try {
      await this.dataManager.loadAllData();
      console.log("CoordinatorTerminal: Data loaded");
    } catch (e) {
      console.error("CoordinatorTerminal: Data load ERROR", e);
    }

    // Initialize other systems with data manager
    this.timeController = new TimeController(this);
    this.messageSystem = new MessageSystem(this, this.dataManager);
    this.resourceManager = new ResourceManager(this, this.dataManager);
    this.caravanManager = new CaravanManager(
      this,
      this.dataManager,
      this.messageSystem,
      this.timeController
    );

    console.log("🔧 All systems initialized");
  }

  startSystems() {
    // Initialize time controller
    this.timeController.initialize();

    // Initialize message system
    this.messageSystem.initialize(this.messageContainer, (messages) => {
      this.currentMessages = messages;
      this.displayMessages(messages);
    });

    // Initialize resource manager
    this.resourceManager.initialize((resources) => {
      this.displayResources(resources);
    });

    // Initialize caravan manager
    this.caravanManager.initialize();

    // Register for time updates
    this.timeController.registerCallback((gameTime, timeSpeed, isPaused) => {
      this.updateTimeDisplay(gameTime);
      this.updateCaravanDisplay();
    });

    // Initial display updates
    this.displayResources(this.resourceManager.getGlobalResources());
    this.displayCaravans(this.dataManager.getAllCaravans());

    console.log("▶️ All systems started");
  }

  createTerminalInterface() {
    const { width, height } = this.scale;

    // Terminal starts below the tabs (40px for tab bar)
    const tabHeight = 40;
    const terminalStartY = tabHeight;

    // Main terminal background
    this.add
      .rectangle(0, terminalStartY, width, height - terminalStartY, 0x0f172a)
      .setOrigin(0, 0);

    // Terminal header (below tabs)
    const headerHeight = 60;
    const header = this.add
      .rectangle(0, terminalStartY, width, headerHeight, 0x1e293b)
      .setOrigin(0, 0);

    // Header text (positioned relative to terminal start)
    this.add.text(20, terminalStartY + 15, "🛰️ EXODUS COORDINATION CENTER", {
      fontFamily: "Courier New",
      fontSize: "18px",
      color: "#10b981",
      fontWeight: "bold",
    });

    this.add.text(
      20,
      terminalStartY + 35,
      "Operator: Sarah Martinez | Shift: Day-7 | Clearance: Level-3",
      {
        fontFamily: "Courier New",
        fontSize: "12px",
        color: "#94a3b8",
      }
    );

    // System status indicator
    this.systemStatus = this.add
      .text(width - 20, terminalStartY + 20, "🟢 ALL SYSTEMS OPERATIONAL", {
        fontFamily: "Courier New",
        fontSize: "12px",
        color: "#10b981",
      })
      .setOrigin(1, 0);

    // Store header height for layout calculations (tabs now at 105px)
    // Store header height for layout calculations (tabs + terminal header)
    this.headerHeight = tabHeight + headerHeight; // 40 + 60 = 100px
  }
  createTimeDisplay() {
    const { width } = this.scale;
    const tabHeight = 40;

    // Current time display (positioned relative to terminal header)
    this.timeDisplay = this.add
      .text(width - 250, tabHeight + 30, "00:00:00", {
        fontFamily: "Courier New",
        fontSize: "24px",
        color: "#f59e0b",
        fontWeight: "bold",
      })
      .setOrigin(1, 0);

    // Add date display to the left of system status text
    this.dateDisplay = this.add
      .text(width - 250, tabHeight + 20, "", {
        fontFamily: "Courier New",
        fontSize: "12px",
        color: "#94a3b8",
      })
      .setOrigin(1, 0);
  }

  createResourcePanel() {
    const panelX = 20;
    const panelY = this.headerHeight + 20;
    const panelWidth = 250;
    const panelHeight = 200;

    // Panel background
    this.add
      .rectangle(panelX, panelY, panelWidth, panelHeight, 0x1e293b)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x334155);

    // Panel header
    this.add.text(panelX + 10, panelY + 10, "GLOBAL RESOURCES", {
      fontFamily: "Courier New",
      fontSize: "12px",
      color: "#f59e0b",
      fontWeight: "bold",
    });

    // Create resource container for dynamic updates
    this.resourceContainer = this.add.container(panelX + 10, panelY + 35);
  }

  createMessagePanel() {
    const { width } = this.scale;
    const panelX = 290;
    const panelY = this.headerHeight + 20;
    const panelWidth = width - 560;
    const panelHeight = 300;

    // Panel background
    this.add
      .rectangle(panelX, panelY, panelWidth, panelHeight, 0x1e293b)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x334155);

    // Panel header
    this.add.text(panelX + 10, panelY + 10, "📧 INCOMING COMMUNICATIONS", {
      fontFamily: "Courier New",
      fontSize: "12px",
      color: "#f59e0b",
      fontWeight: "bold",
    });

    // Message list area
    this.messageContainer = this.add.container(panelX + 10, panelY + 35);
  }

  createCaravanPanel() {
    const { width } = this.scale;
    const panelX = width - 250;
    const panelY = this.headerHeight + 20;
    const panelWidth = 230;
    const panelHeight = 400;

    // Panel background
    this.add
      .rectangle(panelX, panelY, panelWidth, panelHeight, 0x1e293b)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x334155);

    // Panel header
    this.add.text(panelX + 10, panelY + 10, "📍 CARAVAN TRACKING", {
      fontFamily: "Courier New",
      fontSize: "12px",
      color: "#f59e0b",
      fontWeight: "bold",
    });

    // Caravan list container
    this.caravanContainer = this.add.container(panelX + 10, panelY + 35);
  }

  createControlPanel() {
    const { width, height } = this.scale;
    const panelHeight = 80;
    const panelY = height - panelHeight;

    // Panel background
    this.add.rectangle(0, panelY, width, panelHeight, 0x334155).setOrigin(0, 0);

    // Time control buttons
    const timeControls = [
      { text: "⏸️ PAUSE", speed: 0, x: 50 },
      { text: "▶️ 1X", speed: 1, x: 150 },
      { text: "⏩ 2X", speed: 2, x: 230 },
      { text: "⏩⏩ 4X", speed: 4, x: 310 },
    ];

    this.timeControlButtons = [];

    timeControls.forEach((control) => {
      const button = this.createButton(
        control.x,
        panelY + 20,
        control.text,
        () => {
          this.setTimeSpeed(control.speed);
        }
      );
      this.timeControlButtons.push({ button, speed: control.speed });
    });

    // Current speed indicator
    this.speedIndicator = this.add.text(400, panelY + 30, "Speed: 1X", {
      fontFamily: "Courier New",
      fontSize: "14px",
      color: "#10b981",
    });

    // System controls
    this.createButton(width - 300, panelY + 20, "📦 SUPPLY DROP", () => {
      this.requestSupplyDrop();
    });

    this.createButton(width - 180, panelY + 20, "🏥 MEDICAL", () => {
      this.requestMedicalAssistance();
    });

    this.createButton(width - 80, panelY + 20, "🚁 DRONE", () => {
      this.launchDrone();
    });
  }

  createButton(x, y, text, callback) {
    const button = this.add
      .text(x, y, text, {
        fontFamily: "Courier New",
        fontSize: "12px",
        color: "#e2e8f0",
        backgroundColor: "#475569",
        padding: { x: 10, y: 5 },
      })
      .setInteractive();

    button.on("pointerover", () => {
      button.setStyle({ backgroundColor: "#10b981", color: "#0f172a" });
    });

    button.on("pointerout", () => {
      button.setStyle({ backgroundColor: "#475569", color: "#e2e8f0" });
    });

    button.on("pointerdown", callback);

    return button;
  }

  // Time control methods
  setTimeSpeed(speed) {
    this.timeController.setTimeSpeed(speed);

    // Update speed indicator
    const speedText = speed === 0 ? "PAUSED" : `${speed}X`;
    this.speedIndicator.setText(`Speed: ${speedText}`);

    // Update button appearance
    this.timeControlButtons.forEach(({ button, speed: buttonSpeed }) => {
      if (buttonSpeed === speed) {
        button.setStyle({ backgroundColor: "#10b981", color: "#0f172a" });
      } else {
        button.setStyle({ backgroundColor: "#475569", color: "#e2e8f0" });
      }
    });
  }

  updateTimeDisplay(gameTime) {
    if (this.timeDisplay && this.timeDisplay.active) {
      try {
        this.timeDisplay.setText(this.timeController.formatGameTime());
        // Update date display if it exists
        if (this.dateDisplay && this.dateDisplay.active) {
          this.dateDisplay.setText(this.timeController.formatGameDate());
        }
      } catch (error) {
        console.warn("Time display update failed:", error);
        // Recreate time display if corrupted
        this.createTimeDisplay();
      }
    }
  }

  // Resource management methods
  requestSupplyDrop() {
    const caravans = this.dataManager.getAllCaravans();
    if (caravans.length > 0) {
      const targetCaravan = caravans[0]; // For now, just use first caravan
      this.resourceManager.allocateSupplyDrop(targetCaravan.id, "general");
    } else {
      console.log("No caravans available for supply drop");
    }
  }

  requestMedicalAssistance() {
    const caravans = this.dataManager.getAllCaravans();
    if (caravans.length > 0) {
      const targetCaravan = caravans[0]; // For now, just use first caravan
      this.resourceManager.deployMedicalTeam(targetCaravan.id);
    }
  }

  launchDrone() {
    this.resourceManager.launchDroneRecon("Grid-7-Delta");
  }

  // Display update methods
  displayResources(resources) {
    // Safety check for resources object
    if (!resources || typeof resources !== "object") {
      console.warn("Invalid resources object received:", resources);
      return;
    }
    // Clear existing resource display
    this.resourceContainer.removeAll(true);

    const resourceItems = [
      {
        label: "Supply Drops Available",
        value: resources.availableSupplyDrops,
        color: "#10b981",
      },
      {
        label: "Active Drones",
        value: resources.activeDrones,
        color: "#06b6d4",
      },
      {
        label: "Fuel Depots Online",
        value: resources.fuelDepots,
        color: "#f59e0b",
      },
      {
        label: "Medical Teams",
        value: resources.medicalTeams,
        color: "#ef4444",
      },
    ];

    resourceItems.forEach((resource, index) => {
      const y = index * 30;

      this.resourceContainer.add(
        this.add.text(5, y, resource.label, {
          fontFamily: "Courier New",
          fontSize: "10px",
          color: "#cbd5e1",
        })
      );

      this.resourceContainer.add(
        this.add
          .text(220, y, Math.round(resource.value || 0).toString(), {
            // Added Math.round()
            fontFamily: "Courier New",
            fontSize: "14px",
            color: resource.color,
            fontWeight: "bold",
          })
          .setOrigin(1, 0)
      );
    });
  }

  displayMessages(messages) {
    // Clear existing messages
    this.messageContainer.removeAll(true);

    // Display up to 6 most recent messages
    const displayMessages = messages.slice(0, 6);

    displayMessages.forEach((message, index) => {
      const y = index * 45;
      const priorityColor =
        message.priority === "high"
          ? "#ef4444"
          : message.priority === "medium"
          ? "#f59e0b"
          : "#10b981";

      // Priority indicator
      this.messageContainer.add(this.add.circle(5, y + 10, 4, priorityColor));

      // Message text
      this.messageContainer.add(
        this.add.text(20, y, `${message.from}`, {
          fontFamily: "Courier New",
          fontSize: "10px",
          color: "#10b981",
          fontWeight: "bold",
        })
      );

      this.messageContainer.add(
        this.add.text(20, y + 12, message.subject, {
          fontFamily: "Courier New",
          fontSize: "9px",
          color: "#e2e8f0",
        })
      );

      this.messageContainer.add(
        this.add.text(20, y + 24, message.time, {
          fontFamily: "Courier New",
          fontSize: "8px",
          color: "#94a3b8",
        })
      );

      // Make message clickable
      const messageArea = this.add
        .rectangle(10, y + 15, 300, 35, 0x000000, 0)
        .setInteractive()
        .on("pointerdown", () => {
          this.selectMessage(message);
        });

      this.messageContainer.add(messageArea);
    });
  }

  displayCaravans(caravans) {
    // Clear existing caravans
    this.caravanContainer.removeAll(true);

    caravans.forEach((caravan, index) => {
      const y = index * 90;

      // Caravan ID
      this.caravanContainer.add(
        this.add.text(0, y, caravan.id, {
          fontFamily: "Courier New",
          fontSize: "12px",
          color: "#10b981",
          fontWeight: "bold",
        })
      );

      // Leader
      this.caravanContainer.add(
        this.add.text(0, y + 15, `Leader: ${caravan.leader}`, {
          fontFamily: "Courier New",
          fontSize: "9px",
          color: "#cbd5e1",
        })
      );

      // Members
      this.caravanContainer.add(
        this.add.text(0, y + 27, `Members: ${caravan.members}`, {
          fontFamily: "Courier New",
          fontSize: "9px",
          color: "#cbd5e1",
        })
      );

      // Status
      const statusColor =
        caravan.status === "moving"
          ? "#10b981"
          : caravan.status === "emergency"
          ? "#ef4444"
          : "#f59e0b";
      this.caravanContainer.add(
        this.add.text(0, y + 39, `Status: ${caravan.status}`, {
          fontFamily: "Courier New",
          fontSize: "9px",
          color: statusColor,
        })
      );

      // Resources - fix to show clean integers
      this.caravanContainer.add(
        this.add.text(
          0,
          y + 51,
          `F:${Math.round(caravan.resources.fuel)}% W:${Math.round(
            caravan.resources.water
          )}%`, // Added Math.round()
          {
            fontFamily: "Courier New",
            fontSize: "8px",
            color: "#94a3b8",
          }
        )
      );

      this.caravanContainer.add(
        this.add.text(
          0,
          y + 63,
          `Food:${Math.round(caravan.resources.food)}% Med:${Math.round(
            caravan.resources.medicine
          )}%`, // Added Math.round()
          {
            fontFamily: "Courier New",
            fontSize: "8px",
            color: "#94a3b8",
          }
        )
      );

      // Make caravan clickable
      const caravanArea = this.add
        .rectangle(100, y + 35, 180, 80, 0x000000, 0)
        .setInteractive()
        .on("pointerdown", () => {
          this.selectCaravan(caravan);
        });

      this.caravanContainer.add(caravanArea);
    });
  }

  updateCaravanDisplay() {
    // Refresh caravan display with updated data
    this.displayCaravans(this.dataManager.getAllCaravans());
  }

  // Interaction methods
  selectMessage(message) {
    console.log(`📧 Selected message: ${message.subject}`);
    this.messageSystem.markMessageAsRead(message.id);
    // TODO: Show detailed message view in Phase 2
  }

  selectCaravan(caravan) {
    console.log(`📍 Selected caravan: ${caravan.id}`);
    // TODO: Show detailed caravan view in Phase 2
  }

  destroy() {
    // Clean up all systems
    if (this.timeController) {
      this.timeController.destroy();
    }
    if (this.messageSystem) {
      this.messageSystem.destroy();
    }
    if (this.resourceManager) {
      this.resourceManager.destroy();
    }
    if (this.caravanManager) {
      this.caravanManager.destroy();
    }

    super.destroy();
  }
}
