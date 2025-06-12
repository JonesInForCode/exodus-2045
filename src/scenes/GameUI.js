export default class GameUI extends Phaser.Scene {
  constructor() {
    super({ key: "GameUI" });
    this.notifications = [];
  }

  create() {
    this.createNotificationSystem();
    this.createNavigationTabs();
    this.setupEventListeners();

    console.log("🖥️ Game UI initialized");
  }

  createNotificationSystem() {
    const { width } = this.scale;
    this.notificationContainer = this.add.container(width - 20, 20);

    // Test notification
    this.showNotification("System Online", "success");
  }

  createNavigationTabs() {
    const { width } = this.scale;

    // Navigation container positioned below header
    this.navContainer = this.add.container(0, 60);

    // Navigation background
    const navBg = this.add.rectangle(0, 0, width, 50, 0x334155).setOrigin(0, 0);
    this.navContainer.add(navBg);

    // Tab definitions
    this.tabs = [
      { key: "dashboard", label: "📊 DASHBOARD", scene: "CoordinatorTerminal" },
      { key: "map", label: "🗺️ MAP VIEW", scene: "MapView" },
      { key: "caravan", label: "🚐 CARAVAN DETAILS", scene: "CaravanDetails" },
    ];

    this.tabButtons = [];
    this.activeTab = "dashboard"; // Default active tab

    // Create tab buttons
    this.tabs.forEach((tab, index) => {
      const tabButton = this.createTabButton(tab, index);
      this.tabButtons.push(tabButton);
      this.navContainer.add(tabButton);
    });

    // Update active tab styling
    this.updateActiveTab("dashboard");
  }

  createTabButton(tab, index) {
    const tabWidth = 200;
    const x = 20 + index * (tabWidth + 10);

    const button = this.add.container(x, 10);

    // Tab background
    const bg = this.add
      .rectangle(0, 0, tabWidth, 30, 0x475569)
      .setStrokeStyle(1, 0x64748b);

    // Tab text
    const text = this.add
      .text(0, 0, tab.label, {
        fontFamily: "Courier New",
        fontSize: "12px",
        color: "#e2e8f0",
      })
      .setOrigin(0.5, 0.5);

    button.add([bg, text]);
    button.setSize(tabWidth, 30);
    button.setInteractive();

    // Store references for styling updates
    button.bg = bg;
    button.text = text;
    button.tabKey = tab.key;
    button.sceneName = tab.scene;

    // Tab click handler
    button.on("pointerdown", () => {
      this.switchToTab(tab.key, tab.scene);
    });

    // Hover effects
    button.on("pointerover", () => {
      if (button.tabKey !== this.activeTab) {
        bg.setFillStyle(0x64748b);
      }
    });

    button.on("pointerout", () => {
      if (button.tabKey !== this.activeTab) {
        bg.setFillStyle(0x475569);
      }
    });

    return button;
  }

  switchToTab(tabKey, sceneName) {
    if (tabKey === this.activeTab) return;

    console.log(`🔄 Switching to tab: ${tabKey}`);

    // Update active tab
    this.activeTab = tabKey;
    this.updateActiveTab(tabKey);

    // Switch scenes
    if (sceneName === "CoordinatorTerminal") {
      this.scene.start("CoordinatorTerminal");
      this.scene.bringToTop("GameUI");
    } else if (sceneName === "MapView") {
      this.scene.start("MapView");
      this.scene.bringToTop("GameUI");
    } else if (sceneName === "CaravanDetails") {
      // For now, just show a placeholder since CaravanDetails doesn't exist yet
      console.log("🚐 Caravan Details view coming soon...");
      this.showNotification("Caravan Details view coming soon", "info");
    }

    // Update game state
    const gameState = this.game.registry.get("gameState");
    if (gameState) {
      gameState.ui.currentView = tabKey;
      this.game.registry.set("gameState", gameState);
    }
  }

  updateActiveTab(activeKey) {
    this.tabButtons.forEach((button) => {
      if (button.tabKey === activeKey) {
        // Active tab styling
        button.bg.setFillStyle(0x10b981);
        button.bg.setStrokeStyle(2, 0x059669);
        button.text.setColor("#0f172a");
      } else {
        // Inactive tab styling
        button.bg.setFillStyle(0x475569);
        button.bg.setStrokeStyle(1, 0x64748b);
        button.text.setColor("#e2e8f0");
      }
    });
  }

  setupEventListeners() {
    this.game.events.on("showNotification", (data) => {
      this.showNotification(data.message, data.type);
    });
  }

  showNotification(message, type = "info", duration = 3000) {
    const colors = {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#06b6d4",
    };

    const notification = this.add.container(0, this.notifications.length * 40);

    const background = this.add
      .rectangle(0, 0, 250, 30, 0x1e293b)
      .setStrokeStyle(1, colors[type]);

    const text = this.add
      .text(-120, 0, message, {
        fontFamily: "Courier New",
        fontSize: "10px",
        color: colors[type],
      })
      .setOrigin(0, 0.5);

    notification.add([background, text]);
    this.notificationContainer.add(notification);
    this.notifications.push(notification);

    // Auto-remove
    this.time.delayedCall(duration, () => {
      this.removeNotification(notification);
    });

    // Animate in
    notification.setAlpha(0);
    this.tweens.add({
      targets: notification,
      alpha: 1,
      duration: 300,
    });
  }

  removeNotification(notification) {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
      notification.destroy();
      this.repositionNotifications();
    }
  }

  repositionNotifications() {
    this.notifications.forEach((notification, index) => {
      this.tweens.add({
        targets: notification,
        y: index * 40,
        duration: 200,
      });
    });
  }
}
