// Phaser is loaded globally from CDN

export default class CoordinatorTerminal extends Phaser.Scene {
  constructor() {
    super({ key: "CoordinatorTerminal" });
    this.terminalElements = {};
    this.currentTime = new Date();
    this.timeInterval = null;
  }

  preload() {
    // Create simple colored rectangles for UI elements
    this.load.image(
      "pixel",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    );
  }

  create() {
    // Initialize the terminal interface
    this.createTerminalInterface();
    this.createTimeDisplay();
    this.createResourcePanel();
    this.createMessagePanel();
    this.createCaravanPanel();
    this.createControlPanel();

    // Start the game clock
    this.startGameClock();

    // Initialize with sample data
    this.initializeSampleData();

    console.log("🖥️ Coordinator Terminal Online");
  }

  createTerminalInterface() {
    const { width, height } = this.scale;

    // Main terminal background
    this.add.rectangle(0, 0, width, height, 0x0f172a).setOrigin(0, 0);

    // Terminal header
    const headerHeight = 60;
    const header = this.add
      .rectangle(0, 0, width, headerHeight, 0x1e293b)
      .setOrigin(0, 0);

    // Header text
    this.add.text(20, 15, "🛰️ EXODUS COORDINATION CENTER", {
      fontFamily: "Courier New",
      fontSize: "18px",
      color: "#10b981",
      fontWeight: "bold",
    });

    this.add.text(
      20,
      35,
      "Operator: Sarah Martinez | Shift: Day-7 | Clearance: Level-3",
      {
        fontFamily: "Courier New",
        fontSize: "12px",
        color: "#94a3b8",
      }
    );

    // System status indicator
    this.systemStatus = this.add
      .text(width - 20, 20, "🟢 ALL SYSTEMS OPERATIONAL", {
        fontFamily: "Courier New",
        fontSize: "12px",
        color: "#10b981",
      })
      .setOrigin(1, 0);

    // Store header height for layout calculations
    this.headerHeight = headerHeight;
  }

  createTimeDisplay() {
    const { width } = this.scale;

    // Current time display
    this.timeDisplay = this.add
      .text(width - 20, 40, this.formatTime(this.currentTime), {
        fontFamily: "Courier New",
        fontSize: "24px",
        color: "#f59e0b",
        fontWeight: "bold",
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

    // Resource indicators
    const resources = [
      { label: "Supply Drops Available", value: 5, color: "#10b981" },
      { label: "Active Drones", value: 3, color: "#06b6d4" },
      { label: "Fuel Depots Online", value: 8, color: "#f59e0b" },
      { label: "Medical Teams", value: 2, color: "#ef4444" },
    ];

    resources.forEach((resource, index) => {
      const y = panelY + 40 + index * 30;

      this.add.text(panelX + 15, y, resource.label, {
        fontFamily: "Courier New",
        fontSize: "10px",
        color: "#cbd5e1",
      });

      this.add
        .text(panelX + panelWidth - 30, y, resource.value.toString(), {
          fontFamily: "Courier New",
          fontSize: "14px",
          color: resource.color,
          fontWeight: "bold",
        })
        .setOrigin(1, 0);
    });
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

    // Placeholder for messages (will be populated by initializeSampleData)
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
    this.createButton(width - 200, panelY + 20, "📻 OPEN RADIO", () => {
      this.openRadioChannel();
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

  startGameClock() {
    // Update game time every second (real time)
    this.timeInterval = setInterval(() => {
      const gameState = this.registry.get("gameState");
      const timeSpeed = gameState.ui.timeSpeed;

      if (timeSpeed > 0) {
        // Advance game time based on speed multiplier
        this.currentTime.setMinutes(this.currentTime.getMinutes() + timeSpeed);
        this.timeDisplay.setText(this.formatTime(this.currentTime));

        // Update game state
        gameState.systemTime = new Date(this.currentTime);
        this.registry.set("gameState", gameState);
      }
    }, 1000);
  }

  setTimeSpeed(speed) {
    const gameState = this.registry.get("gameState");
    gameState.ui.timeSpeed = speed;
    this.registry.set("gameState", gameState);

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

    console.log(`⏱️ Time speed set to: ${speedText}`);
  }

  openRadioChannel() {
    console.log("📻 Radio channel opened - Feature coming in Phase 2");
    // Placeholder for radio functionality
  }

  initializeSampleData() {
    // Add sample messages
    const sampleMessages = [
      {
        id: 1,
        from: "Caravan Alpha-7",
        subject: "URGENT: Dust storm approaching",
        time: "14:23",
        priority: "high",
        status: "unread",
      },
      {
        id: 2,
        from: "Weather Station Delta",
        subject: "Extreme heat warning - Zone 7",
        time: "13:45",
        priority: "medium",
        status: "unread",
      },
    ];

    this.displayMessages(sampleMessages);

    // Add sample caravan data
    const sampleCaravans = [
      {
        id: "Alpha-7",
        leader: "Maria Santos",
        members: 12,
        status: "moving",
        fuel: 60,
        water: 45,
        lastContact: "14:23",
      },
    ];

    this.displayCaravans(sampleCaravans);
  }

  displayMessages(messages) {
    // Clear existing messages
    this.messageContainer.removeAll(true);

    messages.forEach((message, index) => {
      const y = index * 40;
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
    });
  }

  displayCaravans(caravans) {
    // Clear existing caravans
    this.caravanContainer.removeAll(true);

    caravans.forEach((caravan, index) => {
      const y = index * 80;

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
      const statusColor = caravan.status === "moving" ? "#10b981" : "#f59e0b";
      this.caravanContainer.add(
        this.add.text(0, y + 39, `Status: ${caravan.status}`, {
          fontFamily: "Courier New",
          fontSize: "9px",
          color: statusColor,
        })
      );

      // Resources
      this.caravanContainer.add(
        this.add.text(
          0,
          y + 51,
          `Fuel: ${caravan.fuel}% | Water: ${caravan.water}%`,
          {
            fontFamily: "Courier New",
            fontSize: "8px",
            color: "#94a3b8",
          }
        )
      );
    });
  }

  formatTime(date) {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  destroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    super.destroy();
  }
}
