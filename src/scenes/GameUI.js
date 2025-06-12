export default class GameUI extends Phaser.Scene {
  constructor() {
    super({ key: "GameUI" });
    this.notifications = [];
    this.currentTab = "terminal";
    this.tabButtons = [];
    this.tabContainer = null;
    this.notificationContainer = null;
  }

  create() {
    this.createTabSystem();
    this.createNotificationSystem();
    this.setupEventListeners();

    console.log("🖥️ GameUI with comprehensive tab system initialized");
  }

  createTabSystem() {
    const { width } = this.scale;

    // Tab bar background
    this.tabContainer = this.add.container(0, 0);
    const tabBarBg = this.add
      .rectangle(0, 0, width, 40, 0x1e293b)
      .setOrigin(0, 0);
    this.tabContainer.add(tabBarBg);

    // Tab definitions - easy to extend for new views
    const tabs = [
      {
        key: "terminal",
        label: "🖥️ COORDINATION TERMINAL",
        scene: "CoordinatorTerminal",
        width: 240,
        enabled: true,
      },
      {
        key: "map",
        label: "🗺️ TRACKING MAP",
        scene: "MapView",
        width: 180,
        enabled: true,
      },
      {
        key: "analytics",
        label: "📊 ANALYTICS",
        scene: "AnalyticsView",
        width: 140,
        enabled: false, // Phase 2
      },
      {
        key: "comms",
        label: "📻 RADIO",
        scene: "RadioView",
        width: 120,
        enabled: false, // Phase 2
      },
      {
        key: "details",
        label: "👥 CARAVAN",
        scene: "CaravanDetails",
        width: 140,
        enabled: false, // Future
      },
    ];

    let currentX = 10;
    tabs.forEach((tab) => {
      this.createTab(tab, currentX, 5);
      currentX += tab.width + 10;
    });

    // System status indicator
    this.add
      .text(width - 20, 20, "🟢 SYSTEM ONLINE", {
        fontFamily: "Courier New",
        fontSize: "10px",
        color: "#10b981",
      })
      .setOrigin(1, 0.5);

    // Version indicator
    this.add
      .text(width - 20, 35, "v1.0-alpha", {
        fontFamily: "Courier New",
        fontSize: "8px",
        color: "#64748b",
      })
      .setOrigin(1, 0.5);
  }

  createTab(tabData, x, y) {
    const isActive = this.currentTab === tabData.key;
    const isDisabled = !tabData.enabled;

    // Tab container
    const tabContainer = this.add.container(x, y);

    // Tab background with rounded corners effect using multiple rectangles
    const bgColor = isActive ? 0x10b981 : isDisabled ? 0x374151 : 0x475569;
    const tabBg = this.add
      .rectangle(0, 0, tabData.width, 30, bgColor)
      .setOrigin(0, 0);

    // Tab text
    const textColor = isActive ? "#0f172a" : isDisabled ? "#6b7280" : "#e2e8f0";
    const tabText = this.add
      .text(tabData.width / 2, 15, tabData.label, {
        fontFamily: "Courier New",
        fontSize: "10px",
        color: textColor,
        fontWeight: isActive ? "bold" : "normal",
      })
      .setOrigin(0.5, 0.5);

    tabContainer.add([tabBg, tabText]);

    // Add disabled indicator for future features
    if (isDisabled) {
      const disabledIcon = this.add
        .text(tabData.width - 15, 15, "🔒", {
          fontFamily: "Courier New",
          fontSize: "8px",
          color: "#f59e0b",
        })
        .setOrigin(0.5, 0.5);
      tabContainer.add(disabledIcon);
    }

    // Make interactive if enabled
    if (tabData.enabled) {
      tabBg.setInteractive();

      tabBg.on("pointerover", () => {
        if (this.currentTab !== tabData.key) {
          tabBg.setFillStyle(0x64748b);
          tabText.setColor("#f1f5f9");
        }
      });

      tabBg.on("pointerout", () => {
        if (this.currentTab !== tabData.key) {
          tabBg.setFillStyle(0x475569);
          tabText.setColor("#e2e8f0");
        }
      });

      tabBg.on("pointerdown", () => {
        this.switchToTab(tabData.key, tabData.scene);
      });
    }

    // Store reference for state management
    this.tabButtons.push({
      key: tabData.key,
      scene: tabData.scene,
      container: tabContainer,
      background: tabBg,
      text: tabText,
      enabled: tabData.enabled,
      width: tabData.width,
    });

    this.tabContainer.add(tabContainer);
  }

  switchToTab(tabKey, sceneName) {
    if (this.currentTab === tabKey || !sceneName) return;

    console.log(`🔄 Switching to tab: ${tabKey} (${sceneName})`);

    // Store previous tab for potential restoration
    const previousTab = this.currentTab;
    this.currentTab = tabKey;

    // Update tab appearances
    this.updateTabAppearances();

    // Stop current content scene
    if (
      previousTab === "terminal" &&
      this.scene.isActive("CoordinatorTerminal")
    ) {
      this.scene.stop("CoordinatorTerminal");
    } else if (previousTab === "map" && this.scene.isActive("MapView")) {
      this.scene.stop("MapView");
    }
    // Add more scene stops here as you add new views

    // Start new scene
    this.scene.launch(sceneName);

    // Update game state to track current view
    const gameState = this.registry.get("gameState");
    if (gameState) {
      gameState.ui.currentView = tabKey;
      gameState.ui.previousView = previousTab;
      this.registry.set("gameState", gameState);
    }

    // Emit event for other systems that might need to know about tab changes
    this.events.emit("tabChanged", { from: previousTab, to: tabKey });

    // Show transition notification
    this.showNotification(`Switched to ${tabKey} view`, "info", 1500);
  }

  updateTabAppearances() {
    this.tabButtons.forEach((button) => {
      const isActive = this.currentTab === button.key;
      const isDisabled = !button.enabled;

      if (isDisabled) {
        button.background.setFillStyle(0x374151);
        button.text.setStyle({ color: "#6b7280", fontWeight: "normal" });
      } else if (isActive) {
        button.background.setFillStyle(0x10b981);
        button.text.setStyle({ color: "#0f172a", fontWeight: "bold" });
      } else {
        button.background.setFillStyle(0x475569);
        button.text.setStyle({ color: "#e2e8f0", fontWeight: "normal" });
      }
    });
  }

  createNotificationSystem() {
    const { width } = this.scale;
    // Position notifications below the tab bar
    this.notificationContainer = this.add.container(width - 20, 60);

    // Welcome notification
    this.time.delayedCall(1000, () => {
      this.showNotification("Coordination system online", "success");
    });
  }

  setupEventListeners() {
    // Global notification system
    this.game.events.on("showNotification", (data) => {
      this.showNotification(data.message, data.type, data.duration);
    });

    // Tab switch requests from other systems
    this.game.events.on("switchToTab", (tabKey) => {
      const tab = this.tabButtons.find((t) => t.key === tabKey);
      if (tab && tab.enabled) {
        this.switchToTab(tabKey, tab.scene);
      }
    });

    // Enhanced keyboard shortcuts
    this.input.keyboard.on("keydown", (event) => {
      switch (event.code) {
        case "Tab":
          event.preventDefault();
          this.cycleTabs();
          break;

        case "Escape":
          event.preventDefault();
          if (this.currentTab !== "terminal") {
            this.switchToTab("terminal", "CoordinatorTerminal");
          }
          break;

        case "KeyM":
          event.preventDefault();
          // Toggle between terminal and map
          if (this.currentTab === "terminal") {
            this.switchToTab("map", "MapView");
          } else {
            this.switchToTab("terminal", "CoordinatorTerminal");
          }
          break;

        // Quick access keys for future views
        case "KeyA":
          if (event.ctrlKey) {
            event.preventDefault();
            // Will activate analytics view when enabled
            console.log("📊 Analytics shortcut (Phase 2)");
          }
          break;

        case "KeyR":
          if (event.ctrlKey) {
            event.preventDefault();
            // Will activate radio view when enabled
            console.log("📻 Radio shortcut (Phase 2)");
          }
          break;
      }
    });

    // Scene lifecycle events
    this.events.on("wake", () => {
      console.log("🔄 GameUI awakened");
    });

    this.events.on("sleep", () => {
      console.log("😴 GameUI sleeping");
    });
  }

  cycleTabs() {
    const enabledTabs = this.tabButtons.filter((tab) => tab.enabled);
    const currentIndex = enabledTabs.findIndex(
      (tab) => tab.key === this.currentTab
    );
    const nextIndex = (currentIndex + 1) % enabledTabs.length;
    const nextTab = enabledTabs[nextIndex];

    this.switchToTab(nextTab.key, nextTab.scene);
  }

  // Enhanced notification system with more options
  showNotification(message, type = "info", duration = 3000) {
    const colors = {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#06b6d4",
      system: "#8b5cf6",
    };

    const notification = this.add.container(0, this.notifications.length * 45);

    // Notification background with subtle gradient effect
    const background = this.add
      .rectangle(0, 0, 280, 35, 0x1e293b, 0.95)
      .setStrokeStyle(2, colors[type]);

    // Icon based on type
    const icons = {
      success: "✅",
      warning: "⚠️",
      error: "❌",
      info: "ℹ️",
      system: "🔧",
    };

    const icon = this.add
      .text(-130, 0, icons[type] || "•", {
        fontFamily: "Courier New",
        fontSize: "12px",
        color: colors[type],
      })
      .setOrigin(0, 0.5);

    // Message text with word wrapping
    const text = this.add
      .text(-110, 0, message, {
        fontFamily: "Courier New",
        fontSize: "10px",
        color: colors[type],
        wordWrap: { width: 200 },
      })
      .setOrigin(0, 0.5);

    // Timestamp
    const timestamp = this.add
      .text(125, 0, new Date().toLocaleTimeString().slice(0, 5), {
        fontFamily: "Courier New",
        fontSize: "8px",
        color: "#64748b",
      })
      .setOrigin(1, 0.5);

    notification.add([background, icon, text, timestamp]);
    this.notificationContainer.add(notification);
    this.notifications.push(notification);

    // Auto-remove
    this.time.delayedCall(duration, () => {
      this.removeNotification(notification);
    });

    // Slide in animation
    notification.setAlpha(0);
    notification.x = 100;
    this.tweens.add({
      targets: notification,
      alpha: 1,
      x: 0,
      duration: 300,
      ease: "Back.easeOut",
    });

    // Limit to 5 notifications max
    if (this.notifications.length > 5) {
      this.removeNotification(this.notifications[0]);
    }
  }

  removeNotification(notification) {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);

      // Slide out animation
      this.tweens.add({
        targets: notification,
        alpha: 0,
        x: 100,
        duration: 200,
        onComplete: () => {
          notification.destroy();
          this.repositionNotifications();
        },
      });
    }
  }

  repositionNotifications() {
    this.notifications.forEach((notification, index) => {
      this.tweens.add({
        targets: notification,
        y: index * 45,
        duration: 300,
        ease: "Power2.easeOut",
      });
    });
  }

  // Method to enable future tabs when features are ready
  enableTab(tabKey) {
    const tab = this.tabButtons.find((t) => t.key === tabKey);
    if (tab) {
      tab.enabled = true;
      this.updateTabAppearances();
      console.log(`✅ Tab enabled: ${tabKey}`);
    }
  }

  // Get current tab for external queries
  getCurrentTab() {
    return this.currentTab;
  }

  // Method for debugging and development
  getTabInfo() {
    return {
      current: this.currentTab,
      available: this.tabButtons.filter((t) => t.enabled).map((t) => t.key),
      all: this.tabButtons.map((t) => ({ key: t.key, enabled: t.enabled })),
    };
  }
}
