import { LayoutUtils } from "../utils/LayoutUtils";

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
    // Tab definitions
    const tabs = [
      { key: "dashboard", label: "📊 DASHBOARD", scene: "CoordinatorTerminal" },
      { key: "map", label: "🗺️ MAP VIEW", scene: "MapView" },
      { key: "caravan", label: "🚐 CARAVAN DETAILS", scene: "CaravanDetails" },
    ];

    // Create tab system using utility (moved down and right)
    this.tabSystem = LayoutUtils.createTabSystem(this, 100, 75, tabs, {
      tabWidth: 180, // Slightly smaller to fit better
      tabHeight: 35, // Slightly smaller height
      gap: 8,
      onTabChange: (tab, index) => this.switchToTab(tab.key, tab.scene),
    });

    this.activeTab = "dashboard";
    console.log("📋 Navigation tabs created with LayoutUtils");
  }

  switchToTab(tabKey, sceneName) {
    if (tabKey === this.activeTab) return;

    console.log(`🔄 Switching to tab: ${tabKey}`);
    this.activeTab = tabKey;

    // Switch scenes but keep GameUI on top
    if (sceneName === "CoordinatorTerminal") {
      this.scene.start("CoordinatorTerminal");
      this.scene.bringToTop("GameUI");
    } else if (sceneName === "MapView") {
      this.scene.start("MapView");
      this.scene.bringToTop("GameUI");
    } else if (sceneName === "CaravanDetails") {
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
