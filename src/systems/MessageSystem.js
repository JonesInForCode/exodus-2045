/**
 * MessageSystem - Handles all communication between coordinator and caravans
 * Manages incoming messages, alerts, and communication protocols
 */

export default class MessageSystem {
  constructor(scene, dataManager) {
    this.scene = scene;
    this.dataManager = dataManager;
    this.messages = [];
    this.messageInterval = null;
    this.messageContainer = null;
    this.messageUpdateCallback = null;
  }

  initialize(messageContainer, updateCallback) {
    this.messageContainer = messageContainer;
    this.messageUpdateCallback = updateCallback;
    this.startMessageGeneration();
    console.log("📧 Message System initialized");
  }

  startMessageGeneration() {
    // Generate initial messages
    this.generateInitialMessages();

    // Set up periodic message generation
    this.messageInterval = setInterval(() => {
      this.generatePeriodicMessages();
    }, 30000); // Generate new messages every 30 seconds
  }

  stopMessageGeneration() {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
      this.messageInterval = null;
    }
  }

  generateInitialMessages() {
    // Create some startup messages
    const initialMessages = [
      {
        id: "startup_01",
        from: "System",
        fromName: "Coordination Center",
        subject: "Shift Handover Complete",
        time: new Date().toLocaleTimeString().slice(0, 5),
        priority: "medium",
        status: "unread",
        content:
          "All systems transferred successfully. 3 caravans under active coordination.",
      },
      {
        id: "startup_02",
        from: "Weather-Station-Delta",
        fromName: "Weather Station Delta",
        subject: "Daily Weather Brief",
        time: new Date().toLocaleTimeString().slice(0, 5),
        priority: "low",
        status: "unread",
        content:
          "Extreme heat advisory in effect for southern regions. Dust storm activity moderate.",
      },
    ];

    // Add caravan-specific messages
    const caravans = this.dataManager.getAllCaravans();
    caravans.forEach((caravan) => {
      initialMessages.push({
        id: `init_${caravan.id}`,
        from: caravan.id,
        fromName: caravan.leader,
        subject: "Coordination Handover Acknowledged",
        time: new Date().toLocaleTimeString().slice(0, 5),
        priority: "low",
        status: "unread",
        content: `${caravan.leader} here. We acknowledge the coordination handover. Current status: ${caravan.status}. All systems nominal.`,
      });
    });

    this.messages = initialMessages;
    this.updateDisplay();
  }

  generatePeriodicMessages() {
    if (!this.dataManager.isLoaded()) return;

    const newMessages = this.dataManager.generateMessages();

    newMessages.forEach((message) => {
      this.addMessage(message);
    });

    // Occasionally add weather or system messages
    if (Math.random() < 0.15) {
      // 15% chance
      this.addSystemMessage();
    }
  }

  addSystemMessage() {
    const systemMessages = [
      {
        subject: "Satellite Communication Check",
        content: "All satellite uplinks operational. Signal strength: 98%",
        priority: "low",
      },
      {
        subject: "Supply Drop Coordination",
        content: "Next supply drop scheduled for Grid 7-Delta in 4 hours.",
        priority: "medium",
      },
      {
        subject: "Weather System Update",
        content:
          "New weather patterns detected. Updating route recommendations.",
        priority: "medium",
      },
      {
        subject: "Emergency Frequency Check",
        content:
          "All emergency frequencies clear. No distress signals detected.",
        priority: "low",
      },
    ];

    const message =
      systemMessages[Math.floor(Math.random() * systemMessages.length)];

    this.addMessage({
      id: `sys_${Date.now()}`,
      from: "System",
      fromName: "Coordination Center",
      subject: message.subject,
      time: new Date().toLocaleTimeString().slice(0, 5),
      priority: message.priority,
      status: "unread",
      content: message.content,
    });
  }

  addMessage(message) {
    this.messages.unshift(message); // Add to beginning

    // Keep only last 20 messages
    if (this.messages.length > 20) {
      this.messages = this.messages.slice(0, 20);
    }

    this.updateDisplay();
    this.playNotificationSound(message.priority);

    console.log(`📧 New message from ${message.from}: ${message.subject}`);
  }

  updateDisplay() {
    if (this.messageUpdateCallback) {
      this.messageUpdateCallback(this.messages);
    }
  }

  playNotificationSound(priority) {
    // Trigger sound through the GameUI system
    if (this.scene && this.scene.registry) {
      this.scene.registry.events.emit("playAlert", {
        type:
          priority === "high"
            ? "error"
            : priority === "medium"
            ? "warning"
            : "message",
        duration: 200,
      });
    }
  }

  markMessageAsRead(messageId) {
    const message = this.messages.find((msg) => msg.id === messageId);
    if (message) {
      message.status = "read";
      this.updateDisplay();
      console.log(`📖 Message ${messageId} marked as read`);
    }
  }

  deleteMessage(messageId) {
    this.messages = this.messages.filter((msg) => msg.id !== messageId);
    this.updateDisplay();
    console.log(`🗑️ Message ${messageId} deleted`);
  }

  sendResponse(messageId, response) {
    const originalMessage = this.messages.find((msg) => msg.id === messageId);
    if (originalMessage && originalMessage.from !== "System") {
      console.log(`📤 Response sent to ${originalMessage.from}: ${response}`);

      // Mark original as read
      this.markMessageAsRead(messageId);

      // In Phase 2, this would actually send a response to the caravan
      // For now, just log it
    }
  }

  getAllMessages() {
    return this.messages;
  }

  getUnreadMessages() {
    return this.messages.filter((msg) => msg.status === "unread");
  }

  getHighPriorityMessages() {
    return this.messages.filter((msg) => msg.priority === "high");
  }

  getMessagesByCaravan(caravanId) {
    return this.messages.filter((msg) => msg.from === caravanId);
  }

  // Emergency message handling
  sendEmergencyAlert(caravanId, alertType, message) {
    const caravan = this.dataManager.getCaravanById(caravanId);
    if (caravan) {
      this.addMessage({
        id: `emergency_${Date.now()}`,
        from: caravanId,
        fromName: caravan.leader,
        subject: `EMERGENCY: ${alertType}`,
        time: new Date().toLocaleTimeString().slice(0, 5),
        priority: "high",
        status: "unread",
        content: message,
      });

      // Trigger emergency alert UI
      this.scene.registry.events.emit("emergencyAlert", {
        title: `EMERGENCY: ${caravan.id}`,
        message: `${caravan.leader} reports: ${message}`,
        caravan: caravan,
      });
    }
  }

  // Weather and system alerts
  broadcastWeatherAlert(weatherType, affectedAreas, severity) {
    this.addMessage({
      id: `weather_${Date.now()}`,
      from: "Weather-Center",
      fromName: "Weather Coordination Center",
      subject: `${severity.toUpperCase()} WEATHER ALERT: ${weatherType}`,
      time: new Date().toLocaleTimeString().slice(0, 5),
      priority: severity === "severe" ? "high" : "medium",
      status: "unread",
      content: `${weatherType} detected in areas: ${affectedAreas.join(
        ", "
      )}. All caravans in affected regions should take appropriate precautions.`,
    });
  }

  // Message statistics for dashboard
  getMessageStatistics() {
    return {
      total: this.messages.length,
      unread: this.getUnreadMessages().length,
      highPriority: this.getHighPriorityMessages().length,
      recentCount: this.messages.filter((msg) => {
        const msgTime = new Date();
        const currentTime = new Date();
        return currentTime - msgTime < 3600000; // Last hour
      }).length,
    };
  }

  destroy() {
    this.stopMessageGeneration();
    this.messages = [];
    this.messageContainer = null;
    this.messageUpdateCallback = null;
    console.log("📧 Message System destroyed");
  }
}
