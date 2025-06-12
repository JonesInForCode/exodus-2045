/**
 * CaravanManager - Enhanced caravan logic integrated with new systems
 * Now works with DataManager, MessageSystem, and TimeController
 */

export default class CaravanManager {
  constructor(scene, dataManager, messageSystem, timeController) {
    this.scene = scene;
    this.dataManager = dataManager;
    this.messageSystem = messageSystem;
    this.timeController = timeController;

    this.caravans = [];
    this.updateInterval = null;
    this.lastResourceUpdate = Date.now();
    this.eventGenerationChance = 0.02; // 2% chance per update cycle
  }

  async initialize() {
    // Load caravan data through DataManager
    this.caravans = this.dataManager.getAllCaravans();
    this.startCaravanSimulation();

    // Register for time updates
    this.timeController.registerCallback((gameTime, timeSpeed, isPaused) => {
      if (!isPaused && timeSpeed > 0) {
        this.updateCaravanStates(timeSpeed);
      }
    });

    console.log(
      "🚐 Caravan Manager initialized with",
      this.caravans.length,
      "caravans"
    );
    return this.caravans;
  }

  startCaravanSimulation() {
    // Update caravan states every 10 seconds
    this.updateInterval = setInterval(() => {
      this.simulateCaravanProgress();
    }, 10000);
  }

  stopCaravanSimulation() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  updateCaravanStates(timeSpeed) {
    const now = Date.now();
    const timeSinceLastUpdate = now - this.lastResourceUpdate;

    // Update more frequently with higher time speed
    if (timeSinceLastUpdate > 5000 / timeSpeed) {
      this.simulateResourceConsumption(timeSpeed);
      this.lastResourceUpdate = now;
    }
  }

  simulateCaravanProgress() {
    this.caravans.forEach((caravan) => {
      // Simulate movement if caravan is moving
      if (caravan.status === "moving") {
        this.simulateMovement(caravan);
      }

      // Check for random events
      if (Math.random() < this.eventGenerationChance) {
        this.generateCaravanEvent(caravan);
      }

      // Update last contact time
      this.updateLastContact(caravan);
    });
  }

  simulateResourceConsumption(timeSpeed) {
    this.caravans.forEach((caravan) => {
      if (caravan.status === "moving") {
        // Moving caravans consume more resources
        const consumption = {
          fuel: -Math.random() * 3 * timeSpeed,
          water: -Math.random() * 2 * timeSpeed,
          food: -Math.random() * 2 * timeSpeed,
          medicine: -Math.random() * 0.5 * timeSpeed,
        };

        this.dataManager.updateCaravanResources(caravan.id, consumption);

        // Check for critical resource levels
        this.checkCriticalResources(caravan);
      } else if (caravan.status === "resting") {
        // Resting caravans consume less, but recover morale
        const restingChange = {
          fuel: -Math.random() * 0.5 * timeSpeed,
          water: -Math.random() * 1 * timeSpeed,
          food: -Math.random() * 1 * timeSpeed,
          morale: Math.random() * 2 * timeSpeed,
        };

        this.dataManager.updateCaravanResources(caravan.id, restingChange);
      }
    });
  }

  simulateMovement(caravan) {
    // Simple position simulation (for Phase 2 map integration)
    if (caravan.location && caravan.location.lat && caravan.location.lng) {
      // Small random movement (simulating progress along route)
      const moveDistance = 0.001 + Math.random() * 0.002; // ~100-300 meters
      const direction = Math.random() * Math.PI * 2;

      caravan.location.lat += Math.cos(direction) * moveDistance;
      caravan.location.lng += Math.sin(direction) * moveDistance;

      console.log(
        `📍 ${caravan.id} moved to ${caravan.location.lat.toFixed(
          4
        )}, ${caravan.location.lng.toFixed(4)}`
      );
    }
  }

  checkCriticalResources(caravan) {
    const resources = caravan.resources;

    // Generate emergency messages for critical resources
    if (resources.fuel < 15 && Math.random() < 0.3) {
      this.messageSystem.sendEmergencyAlert(
        caravan.id,
        "Critical Fuel Shortage",
        `Fuel levels at ${Math.round(
          resources.fuel
        )}%. Immediate refueling required.`
      );
      this.setCaravanStatus(caravan.id, "emergency");
    }

    if (resources.water < 20 && Math.random() < 0.4) {
      this.messageSystem.sendEmergencyAlert(
        caravan.id,
        "Water Crisis",
        `Water supplies critical at ${Math.round(
          resources.water
        )}%. Seeking emergency water source.`
      );
    }

    if (resources.food < 15 && Math.random() < 0.2) {
      this.messageSystem.sendEmergencyAlert(
        caravan.id,
        "Food Shortage",
        `Food supplies dangerously low at ${Math.round(
          resources.food
        )}%. Group morale declining.`
      );
    }

    if (resources.medicine < 10 && Math.random() < 0.1) {
      this.messageSystem.sendEmergencyAlert(
        caravan.id,
        "Medical Supplies Depleted",
        `Medical supplies at ${Math.round(
          resources.medicine
        )}%. Unable to treat injuries or illness.`
      );
    }
  }

  generateCaravanEvent(caravan) {
    const events = [
      {
        type: "mechanical",
        message:
          "Minor vehicle maintenance completed. All systems operational.",
        resourceChange: { fuel: -5, morale: 5 },
      },
      {
        type: "discovery",
        message: "Located abandoned supply cache. Morale improved.",
        resourceChange: { food: 10, water: 5, morale: 10 },
      },
      {
        type: "weather",
        message:
          "Taking shelter from dust storm. Waiting for conditions to improve.",
        resourceChange: { fuel: 0, morale: -5 },
        statusChange: "shelter",
      },
      {
        type: "social",
        message:
          "Group meeting held to address concerns. Leadership reaffirmed.",
        resourceChange: { morale: 15 },
      },
      {
        type: "navigation",
        message:
          "Route optimization successful. Found shorter path to destination.",
        resourceChange: { fuel: 5, morale: 8 },
      },
    ];

    const event = events[Math.floor(Math.random() * events.length)];

    // Apply resource changes
    if (event.resourceChange) {
      this.dataManager.updateCaravanResources(caravan.id, event.resourceChange);
    }

    // Apply status changes
    if (event.statusChange) {
      this.setCaravanStatus(caravan.id, event.statusChange);

      // Schedule return to moving status
      this.timeController.scheduleEvent(
        15,
        () => {
          this.setCaravanStatus(caravan.id, "moving");
        },
        `${caravan.id} resume movement`
      );
    }

    // Generate message about event
    this.generateEventMessage(caravan, event);
  }

  generateEventMessage(caravan, event) {
    // Add delay to simulate travel time for radio signals
    setTimeout(() => {
      this.messageSystem.addMessage({
        id: `event_${Date.now()}_${caravan.id}`,
        from: caravan.id,
        fromName: caravan.leader,
        subject: `Status Update: ${event.type}`,
        time: new Date().toLocaleTimeString().slice(0, 5),
        priority: event.type === "emergency" ? "high" : "low",
        status: "unread",
        content: event.message,
      });
    }, Math.random() * 5000 + 2000); // 2-7 second delay
  }

  updateLastContact(caravan) {
    // Simulate communication delays and occasional signal loss
    if (Math.random() < 0.1) {
      // 10% chance to update contact time
      caravan.lastContact = new Date().toLocaleTimeString().slice(0, 5);
    }
  }

  // Enhanced caravan management methods
  setCaravanStatus(caravanId, status) {
    const caravan = this.getCaravanById(caravanId);
    if (caravan) {
      const oldStatus = caravan.status;
      caravan.status = status;
      caravan.lastContact = new Date().toLocaleTimeString().slice(0, 5);

      console.log(`🔄 ${caravanId} status: ${oldStatus} → ${status}`);

      // Notify other systems of status change
      this.scene.events.emit("caravanStatusUpdate", caravan);

      return true;
    }
    return false;
  }

  getCaravanById(id) {
    return this.caravans.find((caravan) => caravan.id === id);
  }

  // Resource assistance methods
  provideAssistance(caravanId, assistanceType, amount) {
    const caravan = this.getCaravanById(caravanId);
    if (!caravan) return false;

    const assistance = {};
    assistance[assistanceType] = amount;

    this.dataManager.updateCaravanResources(caravanId, assistance);

    // Generate confirmation message
    setTimeout(() => {
      this.messageSystem.addMessage({
        id: `assist_${Date.now()}_${caravan.id}`,
        from: caravan.id,
        fromName: caravan.leader,
        subject: `Assistance Received: ${assistanceType}`,
        time: new Date().toLocaleTimeString().slice(0, 5),
        priority: "low",
        status: "unread",
        content: `${assistanceType} assistance received. Thank you for the support. Morale improved.`,
      });
    }, 3000);

    // Boost morale when assistance is provided
    this.dataManager.updateCaravanResources(caravanId, { morale: 10 });

    console.log(
      `🤝 Assistance provided to ${caravanId}: ${amount} ${assistanceType}`
    );
    return true;
  }

  // Emergency response methods
  handleEmergency(caravanId, emergencyType) {
    const caravan = this.getCaravanById(caravanId);
    if (!caravan) return false;

    console.log(`🚨 Emergency response for ${caravanId}: ${emergencyType}`);

    switch (emergencyType) {
      case "medical":
        this.setCaravanStatus(caravanId, "medical_emergency");
        this.provideAssistance(caravanId, "medicine", 30);
        break;

      case "mechanical":
        this.setCaravanStatus(caravanId, "repair");
        this.provideAssistance(caravanId, "fuel", 20);
        break;

      case "weather":
        this.setCaravanStatus(caravanId, "shelter");
        // Schedule automatic status change when weather clears
        this.timeController.scheduleEvent(
          45,
          () => {
            this.setCaravanStatus(caravanId, "moving");
          },
          `${caravanId} weather clear`
        );
        break;

      case "supplies":
        this.provideAssistance(caravanId, "food", 25);
        this.provideAssistance(caravanId, "water", 25);
        break;
    }

    return true;
  }

  // Statistics and monitoring
  getCaravanStatistics() {
    const stats = this.dataManager.getCaravanStatistics();

    // Add movement-specific statistics
    const movingCaravans = this.caravans.filter(
      (c) => c.status === "moving"
    ).length;
    const emergencyCaravans = this.caravans.filter(
      (c) => c.status === "emergency"
    ).length;
    const shelterCaravans = this.caravans.filter(
      (c) => c.status === "shelter"
    ).length;

    return {
      ...stats,
      movingCaravans,
      emergencyCaravans,
      shelterCaravans,
      totalDistance: this.calculateTotalDistance(),
      avgProgress: this.calculateAverageProgress(),
    };
  }

  calculateTotalDistance() {
    // Placeholder calculation - will be enhanced in Phase 2 with actual routes
    return this.caravans.length * 1500 + Math.random() * 500;
  }

  calculateAverageProgress() {
    // Placeholder - percentage of journey completed
    return Math.round(25 + Math.random() * 40);
  }

  // Caravan communication helpers
  sendDirectiveToCaravan(caravanId, directive) {
    const caravan = this.getCaravanById(caravanId);
    if (!caravan) return false;

    console.log(`📡 Directive sent to ${caravanId}: ${directive}`);

    // Simulate response time
    setTimeout(() => {
      this.messageSystem.addMessage({
        id: `directive_${Date.now()}_${caravan.id}`,
        from: caravan.id,
        fromName: caravan.leader,
        subject: "Directive Acknowledged",
        time: new Date().toLocaleTimeString().slice(0, 5),
        priority: "low",
        status: "unread",
        content: `Directive received and understood: "${directive}". Will comply.`,
      });
    }, 5000 + Math.random() * 10000); // 5-15 second response time

    return true;
  }

  // Route management (preparation for Phase 2)
  updateCaravanRoute(caravanId, newRoute) {
    const caravan = this.getCaravanById(caravanId);
    if (caravan) {
      caravan.currentRoute = newRoute;
      console.log(`🗺️ ${caravanId} route updated to: ${newRoute}`);

      this.sendDirectiveToCaravan(
        caravanId,
        `Route updated to ${newRoute}. Adjust heading accordingly.`
      );
      return true;
    }
    return false;
  }

  destroy() {
    this.stopCaravanSimulation();
    this.caravans = [];
    console.log("🚐 Caravan Manager destroyed");
  }
}
