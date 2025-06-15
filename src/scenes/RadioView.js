import Phaser from "phaser";

export default class RadioView extends Phaser.Scene {
  constructor() {
    super({ key: "RadioView" });

    // Communication state
    this.currentCaravan = null;
    this.communicationLog = [];
    this.lastContactTime = null;
    this.isTransmitting = false;
    this.responseTimer = null;

    // UI elements
    this.loyaltyBar = null;
    this.statusPanel = null;
    this.logContainer = null;
    this.optionsContainer = null;
    this.caravanSelectorContainer = null;
  }

  create() {
    const { width, height } = this.scale;
    const tabHeight = 40;

    // Radio background
    this.add
      .rectangle(0, tabHeight, width, height - tabHeight, 0x0f172a)
      .setOrigin(0, 0);

    // Create radio interface
    this.createRadioHeader();
    this.createCaravanSelector();
    this.createCaravanStatusPanel();
    this.createCommunicationOptions();
    this.createCommunicationLog();
    this.createRadioControls();

    // Load caravan data after a short delay to ensure game state is ready
    this.time.delayedCall(100, () => {
      this.loadCaravanData();
    });

    // Start radio static effect
    this.startRadioEffects();

    console.log("📻 Radio Communications Panel initialized");
  }

  createRadioHeader() {
    const { width } = this.scale;
    const tabHeight = 40;

    // Header background
    this.add.rectangle(0, tabHeight, width, 60, 0x1e293b).setOrigin(0, 0);

    // Title
    this.add.text(20, tabHeight + 15, "📻 RADIO COMMUNICATIONS", {
      fontFamily: "Courier New",
      fontSize: "18px",
      color: "#10b981",
      fontWeight: "bold",
    });

    // Frequency display
    this.add.text(
      20,
      tabHeight + 35,
      "Frequency: 142.750 MHz | Encryption: AES-256 | Signal: Strong",
      {
        fontFamily: "Courier New",
        fontSize: "11px",
        color: "#94a3b8",
      }
    );

    // Connection status
    this.connectionStatus = this.add
      .text(width - 20, tabHeight + 30, "🟢 CONNECTED", {
        fontFamily: "Courier New",
        fontSize: "12px",
        color: "#10b981",
      })
      .setOrigin(1, 0.5);
  }

  createCaravanSelector() {
    const panelX = 20;
    const panelY = 120;
    const panelWidth = 300;
    const panelHeight = 40;

    // Panel background for selector
    this.add
      .rectangle(panelX, panelY - 30, panelWidth, panelHeight, 0x1e293b)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x334155);

    // Selector container - position inside the panel
    this.caravanSelectorContainer = this.add.container(
      panelX + 10,
      panelY - 10
    );

    // Label
    this.caravanSelectorContainer.add(
      this.add
        .text(0, 0, "SELECT CARAVAN:", {
          fontFamily: "Courier New",
          fontSize: "11px",
          color: "#f59e0b",
          fontWeight: "bold",
        })
        .setOrigin(0, 0.5)
    );

    // Placeholder text - will be replaced when caravans load
    this.caravanLoadingText = this.add
      .text(120, 0, "Loading...", {
        fontFamily: "Courier New",
        fontSize: "11px",
        color: "#94a3b8",
      })
      .setOrigin(0, 0.5);

    this.caravanSelectorContainer.add(this.caravanLoadingText);
  }

  createCaravanStatusPanel() {
    const panelX = 20;
    const panelY = 140;
    const panelWidth = 300;
    const panelHeight = 250;

    // Panel background
    this.add
      .rectangle(panelX, panelY, panelWidth, panelHeight, 0x1e293b)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x334155);

    // Panel title
    this.add.text(panelX + 10, panelY + 10, "CARAVAN STATUS", {
      fontFamily: "Courier New",
      fontSize: "12px",
      color: "#f59e0b",
      fontWeight: "bold",
    });

    // Create status container
    this.statusContainer = this.add.container(panelX + 10, panelY + 35);
  }

  createCommunicationOptions() {
    const { width } = this.scale;
    const panelX = 340;
    const panelY = 140;
    const panelWidth = width - 680;
    const panelHeight = 250;

    // Panel background
    this.add
      .rectangle(panelX, panelY, panelWidth, panelHeight, 0x1e293b)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x334155);

    // Panel title
    this.add.text(panelX + 10, panelY + 10, "COMMUNICATION OPTIONS", {
      fontFamily: "Courier New",
      fontSize: "12px",
      color: "#f59e0b",
      fontWeight: "bold",
    });

    // Options container
    this.optionsContainer = this.add.container(panelX + 10, panelY + 35);

    // Create communication options
    this.createCommOptions();
  }

  createCommOptions() {
    const options = [
      {
        id: "status",
        text: "📊 Request status update",
        response: "statusUpdate",
      },
      {
        id: "supplies",
        text: "📦 Check supply levels",
        response: "supplyReport",
      },
      {
        id: "weather",
        text: "🌤️ Send weather advisory",
        response: "weatherAck",
      },
      { id: "morale", text: "😊 Check group morale", response: "moraleReport" },
      {
        id: "route",
        text: "🗺️ Suggest route change",
        response: "routeResponse",
      },
      {
        id: "encourage",
        text: "💪 Send encouragement",
        response: "encourageResponse",
      },
      { id: "eta", text: "⏱️ Request ETA update", response: "etaReport" },
      { id: "danger", text: "⚠️ Warn of danger ahead", response: "dangerAck" },
    ];

    options.forEach((option, index) => {
      const y = index * 28;
      const button = this.createRadioButton(0, y, option.text, () => {
        this.sendCommunication(option);
      });
      this.optionsContainer.add(button);
    });
  }

  createRadioButton(x, y, text, callback) {
    const container = this.add.container(x, y);

    const bg = this.add
      .rectangle(0, 0, 280, 24, 0x475569)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true });

    const label = this.add
      .text(10, 12, text, {
        fontFamily: "Courier New",
        fontSize: "11px",
        color: "#e2e8f0",
      })
      .setOrigin(0, 0.5);

    container.add([bg, label]);

    // Hover effects
    bg.on("pointerover", () => {
      if (!this.isTransmitting) {
        bg.setFillStyle(0x64748b);
        label.setColor("#ffffff");
      }
    });

    bg.on("pointerout", () => {
      if (!this.isTransmitting) {
        bg.setFillStyle(0x475569);
        label.setColor("#e2e8f0");
      }
    });

    bg.on("pointerdown", () => {
      if (!this.isTransmitting) {
        bg.setFillStyle(0x10b981);
        label.setColor("#0f172a");
        callback();

        // Reset color after a moment
        this.time.delayedCall(200, () => {
          bg.setFillStyle(0x475569);
          label.setColor("#e2e8f0");
        });
      }
    });

    container.bg = bg;
    container.label = label;
    return container;
  }

  createCommunicationLog() {
    const { width, height } = this.scale;
    const panelX = width - 320;
    const panelY = 140;
    const panelWidth = 300;
    const panelHeight = height - 240;

    // Panel background
    this.add
      .rectangle(panelX, panelY, panelWidth, panelHeight, 0x1e293b)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x334155);

    // Panel title
    this.add.text(panelX + 10, panelY + 10, "📜 COMMUNICATION LOG", {
      fontFamily: "Courier New",
      fontSize: "12px",
      color: "#f59e0b",
      fontWeight: "bold",
    });

    // Log container with mask for scrolling
    const maskShape = this.add
      .rectangle(
        panelX + 10,
        panelY + 35,
        panelWidth - 20,
        panelHeight - 45,
        0x000000
      )
      .setOrigin(0, 0);

    this.logContainer = this.add.container(panelX + 10, panelY + 35);
    this.logContainer.setMask(maskShape.createGeometryMask());

    // Initial log entry
    this.addLogEntry("SYSTEM", "Radio channel opened", "#94a3b8");
  }

  createRadioControls() {
    const { width, height } = this.scale;
    const panelY = height - 100;

    // Control panel background
    this.add
      .rectangle(20, panelY, width - 360, 80, 0x1e293b)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x334155);

    // Transmission indicator
    this.transmissionIndicator = this.add.container(40, panelY + 20);

    const indicator = this.add.circle(0, 0, 8, 0x475569);
    const label = this.add
      .text(20, 0, "TRANSMISSION", {
        fontFamily: "Courier New",
        fontSize: "10px",
        color: "#94a3b8",
      })
      .setOrigin(0, 0.5);

    this.transmissionIndicator.add([indicator, label]);
    this.transmissionIndicator.indicator = indicator;

    // Radio static visualization
    this.staticText = this.add.text(40, panelY + 45, "", {
      fontFamily: "Courier New",
      fontSize: "8px",
      color: "#475569",
      wordWrap: { width: width - 400 },
    });
  }

  loadCaravanData() {
    const gameState = this.registry.get("gameState");
    const caravans = this.getCaravansFromDataManager();

    console.log("Loading caravans:", caravans);

    if (caravans && caravans.length > 0) {
      // Remove loading text
      if (this.caravanLoadingText) {
        this.caravanLoadingText.destroy();
      }

      // Create caravan selection buttons
      this.createCaravanButtons(caravans);

      // Select first caravan by default
      this.selectCaravan(caravans[0]);
    }
  }

  getCaravansFromDataManager() {
    // Try to get from game state first
    const gameState = this.registry.get("gameState");
    if (gameState?.caravans && gameState.caravans.length > 0) {
      return gameState.caravans;
    }

    // Fallback to getting from CoordinatorTerminal's dataManager
    const coordinatorScene = this.scene.get("CoordinatorTerminal");
    if (coordinatorScene?.dataManager) {
      return coordinatorScene.dataManager.getAllCaravans();
    }

    // Last resort - return test data
    return [
      {
        id: "Alpha-7",
        leader: "Maria Santos",
        members: 12,
        status: "moving",
        location: { current: "Phoenix Outskirts" },
        resources: { food: 75, water: 60, fuel: 45, medicine: 30, morale: 85 },
      },
    ];
  }

  createCaravanButtons(caravans) {
    let xOffset = 120;

    caravans.forEach((caravan, index) => {
      if (xOffset + 100 > 280) return; // Don't overflow panel

      const button = this.add.container(xOffset, 0);

      const bg = this.add
        .rectangle(0, 0, 80, 20, 0x475569)
        .setOrigin(0, 0.5)
        .setInteractive({ useHandCursor: true });

      const text = this.add
        .text(40, 0, caravan.id, {
          fontFamily: "Courier New",
          fontSize: "10px",
          color: "#e2e8f0",
        })
        .setOrigin(0.5, 0.5);

      button.add([bg, text]);

      // Selection logic
      bg.on("pointerover", () => {
        if (this.currentCaravan?.id !== caravan.id) {
          bg.setFillStyle(0x64748b);
        }
      });

      bg.on("pointerout", () => {
        if (this.currentCaravan?.id !== caravan.id) {
          bg.setFillStyle(0x475569);
        }
      });

      bg.on("pointerdown", () => {
        this.selectCaravan(caravan);
        this.updateCaravanSelectionButtons();
      });

      // Store reference for updates
      button.caravanId = caravan.id;
      button.bg = bg;
      button.text = text;

      this.caravanSelectorContainer.add(button);
      xOffset += 90;
    });
  }

  selectCaravan(caravan) {
    this.currentCaravan = {
      ...caravan,
      relationship: caravan.relationship || {
        loyalty: 75,
        lastContact: new Date(),
        mood: "confident",
        silenceTimer: 0,
      },
    };

    // Convert lastContact string to Date object if it exists
    if (
      this.currentCaravan.relationship.lastContact &&
      typeof this.currentCaravan.relationship.lastContact === "string"
    ) {
      this.currentCaravan.relationship.lastContact = new Date(
        this.currentCaravan.relationship.lastContact
      );
    }

    this.displayCaravanStatus();
    this.addLogEntry("SYSTEM", `Connected to ${caravan.id}`, "#10b981");
  }

  updateCaravanSelectionButtons() {
    if (!this.caravanSelectorContainer) return;

    this.caravanSelectorContainer.list.forEach((item) => {
      if (item.caravanId && item.bg && item.text) {
        const isSelected = this.currentCaravan?.id === item.caravanId;
        item.bg.setFillStyle(isSelected ? 0x10b981 : 0x475569);
        item.text.setColor(isSelected ? "#0f172a" : "#e2e8f0");
      }
    });
  }

  displayCaravanStatus() {
    if (!this.currentCaravan) return;

    // Clear existing status
    this.statusContainer.removeAll(true);

    const caravan = this.currentCaravan;
    let yOffset = 0;

    // Caravan ID and Leader
    this.statusContainer.add(
      this.add.text(0, yOffset, `Caravan: ${caravan.id}`, {
        fontFamily: "Courier New",
        fontSize: "12px",
        color: "#10b981",
        fontWeight: "bold",
      })
    );
    yOffset += 20;

    this.statusContainer.add(
      this.add.text(0, yOffset, `Leader: ${caravan.leader}`, {
        fontFamily: "Courier New",
        fontSize: "11px",
        color: "#cbd5e1",
      })
    );
    yOffset += 20;

    // Loyalty bar
    this.statusContainer.add(
      this.add.text(0, yOffset, "Loyalty:", {
        fontFamily: "Courier New",
        fontSize: "11px",
        color: "#cbd5e1",
      })
    );

    // Loyalty bar background
    const loyaltyBg = this.add
      .rectangle(60, yOffset + 6, 200, 10, 0x475569)
      .setOrigin(0, 0.5);

    // Loyalty bar fill
    const loyaltyPercent = caravan.relationship.loyalty / 100;
    const loyaltyColor =
      loyaltyPercent > 0.7
        ? 0x10b981
        : loyaltyPercent > 0.4
        ? 0xf59e0b
        : 0xef4444;

    this.loyaltyBar = this.add
      .rectangle(60, yOffset + 6, 200 * loyaltyPercent, 10, loyaltyColor)
      .setOrigin(0, 0.5);

    this.statusContainer.add([loyaltyBg, this.loyaltyBar]);

    // Loyalty percentage
    this.statusContainer.add(
      this.add
        .text(270, yOffset, `${Math.round(caravan.relationship.loyalty)}%`, {
          fontFamily: "Courier New",
          fontSize: "10px",
          color: "#cbd5e1",
        })
        .setOrigin(0, 0.5)
    );
    yOffset += 25;

    // Mood
    const moodEmoji = {
      confident: "😊",
      anxious: "😟",
      happy: "😄",
      worried: "😰",
      grateful: "🙏",
      frustrated: "😤",
    };

    this.statusContainer.add(
      this.add.text(
        0,
        yOffset,
        `Mood: ${moodEmoji[caravan.relationship.mood] || "😐"} ${
          caravan.relationship.mood
        }`,
        {
          fontFamily: "Courier New",
          fontSize: "11px",
          color: "#cbd5e1",
        }
      )
    );
    yOffset += 20;

    // Last contact
    const timeSinceContact = this.getTimeSinceLastContact();
    this.statusContainer.add(
      this.add.text(0, yOffset, `Last Contact: ${timeSinceContact}`, {
        fontFamily: "Courier New",
        fontSize: "10px",
        color: "#94a3b8",
      })
    );
    yOffset += 20;

    // Current status
    const statusColor =
      caravan.status === "moving"
        ? "#10b981"
        : caravan.status === "resting"
        ? "#f59e0b"
        : "#ef4444";
    this.statusContainer.add(
      this.add.text(0, yOffset, `Status: ${caravan.status}`, {
        fontFamily: "Courier New",
        fontSize: "11px",
        color: statusColor,
      })
    );
    yOffset += 20;

    // Location
    this.statusContainer.add(
      this.add.text(0, yOffset, `Location: ${caravan.location.current}`, {
        fontFamily: "Courier New",
        fontSize: "10px",
        color: "#94a3b8",
      })
    );
  }

  sendCommunication(option) {
    if (this.isTransmitting || !this.currentCaravan) return;

    this.isTransmitting = true;

    // Visual feedback
    this.transmissionIndicator.indicator.setFillStyle(0xef4444);

    // Add to log
    this.addLogEntry("COORDINATOR", option.text.substring(3), "#10b981");

    // Update last contact time
    this.currentCaravan.relationship.lastContact = new Date();

    // Generate response after delay
    const delay = 3000 + Math.random() * 2000; // 3-5 seconds

    this.responseTimer = this.time.delayedCall(delay, () => {
      this.receiveResponse(option.response);
      this.isTransmitting = false;
      this.transmissionIndicator.indicator.setFillStyle(0x475569);
    });

    // Play transmission sound effect
    this.playRadioSound("transmit");
  }

  receiveResponse(responseType) {
    const responses = {
      statusUpdate: [
        "All systems green, making good time.",
        "We're holding steady, no issues to report.",
        "Status is stable. Morale is good.",
        "Everything's running smooth so far.",
      ],
      supplyReport: [
        `Food at ${this.currentCaravan.resources.food}%, water at ${this.currentCaravan.resources.water}%.`,
        "Supplies holding for now, but watching water closely.",
        "We're good on supplies, thanks for checking.",
        "Running a bit low on fuel, but manageable.",
      ],
      weatherAck: [
        "Copy that, we'll keep an eye on the weather.",
        "Acknowledged. Adjusting route to avoid the worst of it.",
        "Thanks for the heads up, preparing for weather.",
        "Roger, weather advisory received.",
      ],
      moraleReport: [
        "The group's in good spirits considering everything.",
        "Morale is steady. The kids are holding up well.",
        "People are tired but determined.",
        "We're hanging in there. Your updates help.",
      ],
      routeResponse: [
        "Looking at the new route now... seems viable.",
        "We'll consider it. Current path is working for now.",
        "Appreciate the suggestion. We'll discuss it.",
        "New route looks good. We'll adjust heading.",
      ],
      encourageResponse: [
        "Thanks, that means a lot to everyone here.",
        "Appreciated. We'll keep pushing forward.",
        "Your support keeps us going. Thank you.",
        "The group needed to hear that. Thanks.",
      ],
      etaReport: [
        "Estimating arrival in about 6 hours at current pace.",
        "ETA is roughly 8 hours if conditions hold.",
        "Should reach the checkpoint by nightfall.",
        "Making good time. ETA 5 hours.",
      ],
      dangerAck: [
        "Alert received! Taking evasive action now.",
        "Copy that warning. We're adjusting course.",
        "Thanks for the warning! We'll be careful.",
        "Danger acknowledged. Finding alternate route.",
      ],
    };

    const responseArray = responses[responseType] || ["Message received."];
    const response =
      responseArray[Math.floor(Math.random() * responseArray.length)];

    this.addLogEntry(this.currentCaravan.id, response, "#06b6d4");

    // Update loyalty based on communication
    this.updateLoyalty(responseType);

    // Play reception sound
    this.playRadioSound("receive");
  }

  updateLoyalty(communicationType) {
    const timeSinceLastContact =
      Date.now() - this.currentCaravan.relationship.lastContact.getTime();
    const minutesSince = timeSinceLastContact / 60000;

    let loyaltyChange = 0;
    let moodChange = null;

    // Base loyalty changes by communication type
    const loyaltyEffects = {
      statusUpdate: 1,
      supplyReport: 2,
      weatherAck: 3,
      moraleReport: 2,
      routeResponse: 1,
      encourageResponse: 4,
      etaReport: 1,
      dangerAck: 5,
    };

    loyaltyChange = loyaltyEffects[communicationType] || 1;

    // Bonus for timely communication
    if (minutesSince > 10) {
      loyaltyChange += 2; // They were getting worried
      moodChange = "grateful";
    } else if (minutesSince < 2) {
      loyaltyChange -= 1; // Too frequent
      if (Math.random() < 0.3) moodChange = "frustrated";
    }

    // Apply changes
    this.currentCaravan.relationship.loyalty = Math.max(
      0,
      Math.min(100, this.currentCaravan.relationship.loyalty + loyaltyChange)
    );

    if (moodChange) {
      this.currentCaravan.relationship.mood = moodChange;
    }

    // Refresh display
    this.displayCaravanStatus();
  }

  addLogEntry(sender, message, color) {
    const time = new Date().toLocaleTimeString().slice(0, 5);

    const entry = this.add.container(0, this.communicationLog.length * 40);

    // Timestamp
    entry.add(
      this.add.text(0, 0, `[${time}]`, {
        fontFamily: "Courier New",
        fontSize: "9px",
        color: "#64748b",
      })
    );

    // Sender
    entry.add(
      this.add.text(0, 12, sender, {
        fontFamily: "Courier New",
        fontSize: "10px",
        color: color,
        fontWeight: "bold",
      })
    );

    // Message
    entry.add(
      this.add.text(0, 24, message, {
        fontFamily: "Courier New",
        fontSize: "9px",
        color: "#cbd5e1",
        wordWrap: { width: 280 },
      })
    );

    this.logContainer.add(entry);
    this.communicationLog.push(entry);

    // Scroll to bottom
    if (this.communicationLog.length > 10) {
      this.logContainer.y -= 40;
    }
  }

  getTimeSinceLastContact() {
    if (!this.currentCaravan?.relationship?.lastContact) return "Never";

    let lastContactDate = this.currentCaravan.relationship.lastContact;

    // Convert string to Date if needed
    if (typeof lastContactDate === "string") {
      lastContactDate = new Date(lastContactDate);
    }

    // Check if it's a valid date
    if (
      !(lastContactDate instanceof Date) ||
      isNaN(lastContactDate.getTime())
    ) {
      return "Unknown";
    }

    const now = Date.now();
    const lastContactTime = lastContactDate.getTime();
    const minutes = Math.floor((now - lastContactTime) / 60000);

    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1 minute ago";
    if (minutes < 60) return `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "1 hour ago";
    return `${hours} hours ago`;
  }

  startRadioEffects() {
    // Radio static effect
    this.time.addEvent({
      delay: 100,
      callback: () => {
        if (this.staticText && this.staticText.active) {
          const staticChars = "░▒▓█▀▄▌▐│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼";
          let staticString = "";
          for (let i = 0; i < 80; i++) {
            staticString +=
              staticChars[Math.floor(Math.random() * staticChars.length)];
          }
          this.staticText.setText(staticString);
          this.staticText.setAlpha(0.1 + Math.random() * 0.1);
        }
      },
      loop: true,
    });

    // Check for radio silence (loyalty decay)
    this.time.addEvent({
      delay: 30000, // Check every 30 seconds
      callback: () => {
        this.checkRadioSilence();
      },
      loop: true,
    });
  }

  checkRadioSilence() {
    if (!this.currentCaravan || !this.currentCaravan.relationship.lastContact)
      return;

    const minutesSilent =
      (Date.now() - this.currentCaravan.relationship.lastContact.getTime()) /
      60000;

    if (minutesSilent > 5) {
      // Start losing loyalty due to silence
      const loyaltyLoss = Math.min(5, Math.floor(minutesSilent / 5));
      this.currentCaravan.relationship.loyalty = Math.max(
        0,
        this.currentCaravan.relationship.loyalty - loyaltyLoss
      );

      // Change mood if too much silence
      if (
        minutesSilent > 10 &&
        this.currentCaravan.relationship.mood !== "anxious"
      ) {
        this.currentCaravan.relationship.mood = "anxious";
        this.addLogEntry(
          "SYSTEM",
          "Caravan seems anxious due to radio silence",
          "#f59e0b"
        );
      }

      this.displayCaravanStatus();
    }
  }

  playRadioSound(type) {
    // Placeholder for sound effects
    // In phase 2, we'll add actual radio static, beeps, etc.
    console.log(`📻 Radio sound: ${type}`);
  }

  update() {
    // Update time-based displays
    if (this.frameCount % 60 === 0) {
      // Every second
      this.displayCaravanStatus();
    }

    this.frameCount = (this.frameCount || 0) + 1;
  }

  destroy() {
    if (this.responseTimer) {
      this.responseTimer.destroy();
    }
    super.destroy();
  }
}
