// Phaser is loaded globally from CDN

export default class GameUI extends Phaser.Scene {
  constructor() {
    super({ key: "GameUI" });
    this.notifications = [];
    this.alertSounds = {};
  }

  preload() {
    // Placeholder for UI assets and sound effects
    // Will be expanded in Phase 2
  }

  create() {
    console.log("🖥️ Game UI initialized");

    // This scene runs parallel to others and handles:
    // - Notifications
    // - Alert overlays
    // - Sound effects
    // - Global UI elements

    this.createNotificationSystem();
    this.setupAudioFeedback();

    // Listen for global events
    this.setupEventListeners();
  }

  createNotificationSystem() {
    const { width } = this.scale;

    // Notification container (top-right corner)
    this.notificationContainer = this.add.container(width - 20, 20);

    // Test notification (remove in production)
    this.showNotification("System Online", "success");
  }

  setupAudioFeedback() {
    // Placeholder for audio system
    // Will implement in Phase 2 with Web Audio API

    this.audioContext = null; // Will initialize Web Audio context

    // Create basic beep sounds for now
    this.createBasicSounds();
  }

  createBasicSounds() {
    // Simple audio feedback using Web Audio API
    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      this.soundFrequencies = {
        success: 800,
        warning: 400,
        error: 200,
        message: 600,
      };
    } catch (e) {
      console.log("Audio context not available");
    }
  }

  playSound(type = "message", duration = 200) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = this.soundFrequencies[type] || 600;
    oscillator.type = "square";

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration / 1000
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }

  setupEventListeners() {
    // Listen for events from other scenes
    this.registry.events.on("showNotification", (data) => {
      this.showNotification(data.message, data.type);
    });

    this.registry.events.on("playAlert", (data) => {
      this.playSound(data.type, data.duration);
    });

    this.registry.events.on("emergencyAlert", (data) => {
      this.showEmergencyAlert(data);
    });
  }

  showNotification(message, type = "info", duration = 3000) {
    const colors = {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#06b6d4",
    };

    const color = colors[type] || colors.info;

    // Create notification
    const notification = this.add.container(0, this.notifications.length * 40);

    const background = this.add
      .rectangle(0, 0, 250, 30, 0x1e293b)
      .setStrokeStyle(1, color);

    const text = this.add
      .text(-120, 0, message, {
        fontFamily: "Courier New",
        fontSize: "10px",
        color: color,
      })
      .setOrigin(0, 0.5);

    notification.add([background, text]);
    this.notificationContainer.add(notification);
    this.notifications.push(notification);

    // Play sound
    this.playSound(type);

    // Auto-remove after duration
    this.time.delayedCall(duration, () => {
      this.removeNotification(notification);
    });

    // Animate in
    notification.setAlpha(0);
    this.tweens.add({
      targets: notification,
      alpha: 1,
      x: 0,
      duration: 300,
      ease: "Power2",
    });
  }

  removeNotification(notification) {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);

      // Animate out
      this.tweens.add({
        targets: notification,
        alpha: 0,
        x: 100,
        duration: 200,
        ease: "Power2",
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
        y: index * 40,
        duration: 200,
        ease: "Power2",
      });
    });
  }

  showEmergencyAlert(data) {
    const { width, height } = this.scale;

    // Emergency overlay
    const overlay = this.add.container(0, 0);

    // Semi-transparent background
    const background = this.add
      .rectangle(0, 0, width, height, 0x000000, 0.8)
      .setOrigin(0, 0)
      .setInteractive();

    // Alert box
    const alertBox = this.add
      .rectangle(width / 2, height / 2, 600, 300, 0x1e293b)
      .setStrokeStyle(3, 0xef4444);

    // Alert text
    const alertText = this.add
      .text(width / 2, height / 2 - 50, data.title || "EMERGENCY ALERT", {
        fontFamily: "Courier New",
        fontSize: "24px",
        color: "#ef4444",
        fontWeight: "bold",
      })
      .setOrigin(0.5, 0.5);

    const alertMessage = this.add
      .text(
        width / 2,
        height / 2,
        data.message || "Emergency situation detected",
        {
          fontFamily: "Courier New",
          fontSize: "14px",
          color: "#e2e8f0",
          align: "center",
          wordWrap: { width: 500 },
        }
      )
      .setOrigin(0.5, 0.5);

    // Close button
    const closeButton = this.add
      .text(width / 2, height / 2 + 80, "ACKNOWLEDGE", {
        fontFamily: "Courier New",
        fontSize: "14px",
        color: "#0f172a",
        backgroundColor: "#ef4444",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5, 0.5)
      .setInteractive();

    closeButton.on("pointerdown", () => {
      overlay.destroy();
    });

    overlay.add([background, alertBox, alertText, alertMessage, closeButton]);

    // Play emergency sound
    this.playSound("error", 500);

    // Animate in
    overlay.setAlpha(0);
    this.tweens.add({
      targets: overlay,
      alpha: 1,
      duration: 300,
      ease: "Power2",
    });
  }

  // Utility methods for other scenes to use
  static showNotification(scene, message, type) {
    scene.registry.events.emit("showNotification", { message, type });
  }

  static playAlert(scene, type, duration) {
    scene.registry.events.emit("playAlert", { type, duration });
  }

  static showEmergencyAlert(scene, data) {
    scene.registry.events.emit("emergencyAlert", data);
  }
}
