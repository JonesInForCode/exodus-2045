export default class CoordinatorTerminal extends Phaser.Scene {
  constructor() {
    super({ key: "CoordinatorTerminal" });
    this.currentTime = new Date();
    this.timeInterval = null;
  }

  create() {
    this.createInterface();
    this.setupEventListeners();
    this.startClock();
    this.loadInitialData();

    console.log("🖥️ Coordinator Terminal Online");
  }

  createInterface() {
    const { width, height } = this.scale;

    // Main background
    this.add.rectangle(0, 0, width, height, 0x0f172a).setOrigin(0, 0);

    // Header
    this.createHeader();

    // Main panels
    this.createResourcePanel();
    this.createMessagesPanel();
    this.createCaravanPanel();
    this.createControlPanel();
  }

  createHeader() {
    const { width } = this.scale;
    const headerHeight = 60;

    // Header background
    this.add.rectangle(0, 0, width, headerHeight, 0x1e293b).setOrigin(0, 0);

    // Title
    this.add.text(20, 15, "🛰️ EXODUS COORDINATION CENTER", {
      fontFamily: "Courier New",
      fontSize: "18px",
      color: "#10b981",
      fontWeight: "bold",
    });

    // Operator info
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

    // System status
    this.add
      .text(width - 20, 20, "🟢 ALL SYSTEMS OPERATIONAL", {
        fontFamily: "Courier New",
        fontSize: "12px",
        color: "#10b981",
      })
      .setOrigin(1, 0);

    // Time display
    this.timeDisplay = this.add
      .text(width - 20, 40, this.formatTime(this.currentTime), {
        fontFamily: "Courier New",
        fontSize: "24px",
        color: "#f59e0b",
        fontWeight: "bold",
      })
      .setOrigin(1, 0);

    this.headerHeight = headerHeight;
  }

  createResourcePanel() {
    const panel = this.createPanel(20, 80, 250, 200, "GLOBAL RESOURCES");

    const resources = [
      { label: "Supply Drops Available", value: 5, color: "#10b981" },
      { label: "Active Drones", value: 3, color: "#06b6d4" },
      { label: "Fuel Depots Online", value: 8, color: "#f59e0b" },
      { label: "Medical Teams", value: 2, color: "#ef4444" },
    ];

    resources.forEach((resource, index) => {
      const y = 110 + index * 30;

      this.add.text(35, y, resource.label, {
        fontFamily: "Courier New",
        fontSize: "10px",
        color: "#cbd5e1",
      });

      this.add
        .text(250, y, resource.value.toString(), {
          fontFamily: "Courier New",
          fontSize: "14px",
          color: resource.color,
          fontWeight: "bold",
        })
        .setOrigin(1, 0);
    });
  }

  createMessagesPanel() {
    const { width } = this.scale;
    const panel = this.createPanel(
      290,
      80,
      width - 560,
      300,
      "📧 INCOMING COMMUNICATIONS"
    );

    this.messageContainer = this.add.container(300, 110);
  }

  createCaravanPanel() {
    const { width } = this.scale;
    const panel = this.createPanel(
      width - 250,
      80,
      230,
      400,
      "📍 CARAVAN TRACKING"
    );

    this.caravanContainer = this.add.container(width - 240, 110);
  }

  createControlPanel() {
    const { width, height } = this.scale;
    const panelY = height - 80;

    // Control panel background
    this.add.rectangle(0, panelY, width, 80, 0x334155).setOrigin(0, 0);

    // Time controls
    const controls = [
      { text: "⏸️ PAUSE", speed: 0, x: 50 },
      { text: "▶️ 1X", speed: 1, x: 150 },
      { text: "⏩ 2X", speed: 2, x: 230 },
      { text: "⏩⏩ 4X", speed: 4, x: 310 },
    ];

    this.timeButtons = [];

    controls.forEach((control) => {
      const button = this.createButton(
        control.x,
        panelY + 20,
        control.text,
        () => {
          this.setTimeSpeed(control.speed);
        }
      );
      this.timeButtons.push({ button, speed: control.speed });
    });

    // Speed indicator
    this.speedIndicator = this.add.text(400, panelY + 30, "Speed: 1X", {
      fontFamily: "Courier New",
      fontSize: "14px",
      color: "#10b981",
    });

    // Other controls
    this.createButton(width - 200, panelY + 20, "📻 OPEN RADIO", () => {
      this.game.events.emit("showNotification", {
        message: "📻 Radio system - Phase 2 feature",
        type: "info",
      });
    });
  }

  createPanel(x, y, width, height, title) {
    // Panel background
    const panel = this.add
      .rectangle(x, y, width, height, 0x1e293b)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x334155);

    // Panel title
    this.add.text(x + 10, y + 10, title, {
      fontFamily: "Courier New",
      fontSize: "12px",
      color: "#f59e0b",
      fontWeight: "bold",
    });

    return panel;
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

  setupEventListeners() {
    this.game.events.on("timeSpeedChanged", (speed) => {
      this.setTimeSpeed(speed);
    });
  }

  setTimeSpeed(speed) {
    const speedText = speed === 0 ? "PAUSED" : `${speed}X`;
    this.speedIndicator.setText(`Speed: ${speedText}`);

    this.timeButtons.forEach(({ button, speed: buttonSpeed }) => {
      if (buttonSpeed === speed) {
        button.setStyle({ backgroundColor: "#10b981", color: "#0f172a" });
      } else {
        button.setStyle({ backgroundColor: "#475569", color: "#e2e8f0" });
      }
    });

    console.log(`⏱️ Time speed set to: ${speedText}`);
  }

  startClock() {
    this.timeInterval = setInterval(() => {
      const gameState = this.game.registry.get("gameState");
      if (gameState.timeSpeed > 0) {
        this.currentTime.setMinutes(
          this.currentTime.getMinutes() + gameState.timeSpeed
        );
        this.timeDisplay.setText(this.formatTime(this.currentTime));
      }
    }, 1000);
  }

  loadInitialData() {
    // Sample messages
    const messages = [
      {
        id: 1,
        from: "Caravan Alpha-7",
        subject: "URGENT: Dust storm approaching",
        time: "14:23",
        priority: "high",
      },
      {
        id: 2,
        from: "Weather Station Delta",
        subject: "Extreme heat warning - Zone 7",
        time: "13:45",
        priority: "medium",
      },
    ];

    this.displayMessages(messages);

    // Sample caravans
    const caravans = [
      {
        id: "Alpha-7",
        leader: "Maria Santos",
        members: 12,
        status: "moving",
        fuel: 60,
        water: 45,
      },
    ];

    this.displayCaravans(caravans);
  }

  displayMessages(messages) {
    this.messageContainer.removeAll(true);

    messages.forEach((message, index) => {
      const y = index * 40;
      const priorityColor =
        message.priority === "high"
          ? "#ef4444"
          : message.priority === "medium"
          ? "#f59e0b"
          : "#10b981";

      // Priority dot
      this.messageContainer.add(this.add.circle(5, y + 10, 4, priorityColor));

      // Message info
      this.messageContainer.add(
        this.add.text(20, y, message.from, {
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
    this.caravanContainer.removeAll(true);

    caravans.forEach((caravan, index) => {
      const y = index * 80;

      this.caravanContainer.add(
        this.add.text(0, y, caravan.id, {
          fontFamily: "Courier New",
          fontSize: "12px",
          color: "#10b981",
          fontWeight: "bold",
        })
      );

      this.caravanContainer.add(
        this.add.text(0, y + 15, `Leader: ${caravan.leader}`, {
          fontFamily: "Courier New",
          fontSize: "9px",
          color: "#cbd5e1",
        })
      );

      this.caravanContainer.add(
        this.add.text(0, y + 27, `Members: ${caravan.members}`, {
          fontFamily: "Courier New",
          fontSize: "9px",
          color: "#cbd5e1",
        })
      );

      const statusColor = caravan.status === "moving" ? "#10b981" : "#f59e0b";
      this.caravanContainer.add(
        this.add.text(0, y + 39, `Status: ${caravan.status}`, {
          fontFamily: "Courier New",
          fontSize: "9px",
          color: statusColor,
        })
      );

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
