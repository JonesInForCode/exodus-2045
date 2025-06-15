/**
 * DataManager - Centralized data loading and management
 * Handles loading of all game data from JSON files
 */

export default class DataManager {
  constructor() {
    this.caravans = [];
    this.routes = [];
    this.events = [];
    this.resources = {};
    this.loaded = false;
  }

  async loadAllData() {
    try {
      console.log("📊 Loading game data...");

      // Load all data files
      const [caravansData, routesData, eventsData] = await Promise.all([
        this.loadCaravanData(),
        this.loadRouteData(),
        this.loadEventData(),
      ]);

      this.caravans = caravansData;
      this.routes = routesData;
      this.events = eventsData;
      this.initializeResources();

      this.loaded = true;
      console.log("✅ All game data loaded successfully");

      return true;
    } catch (error) {
      console.error("❌ Failed to load game data:", error);
      this.loadFallbackData();
      return false;
    }
  }

  async loadCaravanData() {
    try {
      const response = await fetch("./src/data/caravans.json");
      if (response.ok) {
        console.log("📊 Caravan data loaded successfully");
      }
      const data = await response.json();
      return data.caravans || [];
    } catch (error) {
      console.warn("Using fallback caravan data");
      return this.getFallbackCaravans();
    }
  }

  async loadRouteData() {
    try {
      const response = await fetch("./src/data/routes.json");
      if (response.ok) {
        console.log("📊 Route data loaded successfully");
      }
      const data = await response.json();
      return data.routes || [];
    } catch (error) {
      console.warn("Using fallback route data");
      return this.getFallbackRoutes();
    }
  }

  async loadEventData() {
    try {
      const response = await fetch("./src/data/events.json");
      if (response.ok) {
        console.log("📊 Event data loaded successfully");
      }
      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.warn("Using fallback event data");
      return this.getFallbackEvents();
    }
  }

  initializeResources() {
    this.resources = {
      availableSupplyDrops: 5,
      activeDrones: 3,
      fuelDepots: 8,
      medicalTeams: 2,
      communicationSatellites: 4,
      weatherStations: 12,
    };
  }

  // Fallback data if files fail to load
  getFallbackCaravans() {
    return [
      {
        id: "Alpha-7",
        leader: "Maria Santos",
        members: 12,
        vehicles: 3,
        location: {
          current: "Phoenix Outskirts",
          lat: 33.4484,
          lng: -112.074,
        },
        destination: "New Seattle Climate Zone",
        resources: {
          food: 75,
          water: 60,
          fuel: 45,
          medicine: 30,
          morale: 85,
        },
        status: "moving",
        lastContact: "14:23",
        specialties: ["medical", "mechanical"],
        notes: "Experienced group with medical personnel",
      },
    ];
  }

  getFallbackRoutes() {
    return [
      {
        id: "phoenix_to_new_seattle",
        name: "Phoenix to New Seattle Route",
        distance_km: 1847,
        estimated_days: 12,
        difficulty: "moderate",
      },
    ];
  }

  getFallbackEvents() {
    return [
      {
        id: "dust_storm_01",
        title: "Dust Storm Approaching",
        priority: "high",
        description: "A massive dust storm is heading your way.",
      },
    ];
  }

  loadFallbackData() {
    this.caravans = this.getFallbackCaravans();
    this.routes = this.getFallbackRoutes();
    this.events = this.getFallbackEvents();
    this.initializeResources();
    this.loaded = true;
    console.log("📊 Fallback data loaded");
  }

  // Data access methods
  getAllCaravans() {
    return this.caravans;
  }

  getCaravanById(id) {
    return this.caravans.find((caravan) => caravan.id === id);
  }

  getAllRoutes() {
    return this.routes;
  }

  getRouteById(id) {
    return this.routes.find((route) => route.id === id);
  }

  getGlobalResources() {
    return this.resources;
  }

  getRandomEvent() {
    return this.events[Math.floor(Math.random() * this.events.length)];
  }

  // Update methods for game state changes
  updateCaravanResources(caravanId, resourceChanges) {
    const caravan = this.getCaravanById(caravanId);
    if (caravan) {
      Object.keys(resourceChanges).forEach((resource) => {
        if (caravan.resources[resource] !== undefined) {
          const newValue =
            caravan.resources[resource] + resourceChanges[resource];
          caravan.resources[resource] = Math.round(
            Math.max(0, Math.min(100, newValue))
          ); // Added Math.round()
        }
      });
      console.log(`📊 ${caravanId} resources updated:`, resourceChanges);
      return true;
    }
    return false;
  }

  updateCaravanStatus(caravanId, status) {
    const caravan = this.getCaravanById(caravanId);
    if (caravan) {
      caravan.status = status;
      caravan.lastContact = new Date().toLocaleTimeString().slice(0, 5);
      console.log(`🔄 ${caravanId} status changed to: ${status}`);
      return true;
    }
    return false;
  }

  updateGlobalResource(resourceType, change) {
    if (this.resources[resourceType] !== undefined) {
      this.resources[resourceType] = Math.max(
        0,
        this.resources[resourceType] + change
      );
      console.log(
        `🌍 Global ${resourceType} updated: ${this.resources[resourceType]}`
      );
      return true;
    }
    return false;
  }

  // Generate messages for the communication system
  generateMessages() {
    const messages = [];

    // Add caravan status messages
    this.caravans.forEach((caravan) => {
      if (Math.random() < 0.3) {
        // 30% chance of message per caravan
        messages.push({
          id: `msg_${Date.now()}_${caravan.id}`,
          from: caravan.id,
          fromName: caravan.leader,
          subject: this.generateMessageSubject(caravan),
          time: new Date().toLocaleTimeString().slice(0, 5),
          priority: this.getMessagePriority(caravan),
          status: "unread",
          content: this.generateMessageContent(caravan),
        });
      }
    });

    // Add system messages
    if (Math.random() < 0.2) {
      // 20% chance of system message
      messages.push({
        id: `sys_${Date.now()}`,
        from: "System",
        fromName: "Coordination Center",
        subject: "System Status Update",
        time: new Date().toLocaleTimeString().slice(0, 5),
        priority: "low",
        status: "unread",
        content: "All systems operational. No critical alerts.",
      });
    }

    return messages;
  }

  generateMessageSubject(caravan) {
    const subjects = [
      "Route Status Update",
      "Resource Request",
      "Weather Advisory Received",
      "Checkpoint Reached",
      "Minor Equipment Issue",
      "Morale Report",
      "Supply Cache Located",
    ];

    if (caravan.resources.fuel < 30) return "URGENT: Low Fuel Warning";
    if (caravan.resources.water < 25) return "URGENT: Water Shortage";
    if (caravan.resources.food < 20) return "URGENT: Food Supplies Critical";
    if (caravan.status === "emergency")
      return "EMERGENCY: Immediate Assistance Required";

    return subjects[Math.floor(Math.random() * subjects.length)];
  }

  getMessagePriority(caravan) {
    if (caravan.status === "emergency") return "high";
    if (caravan.resources.fuel < 30 || caravan.resources.water < 25)
      return "high";
    if (caravan.resources.food < 40 || caravan.resources.medicine < 30)
      return "medium";
    return "low";
  }

  generateMessageContent(caravan) {
    const content = [
      `Current position: ${caravan.location.current}`,
      `Group status: ${caravan.status}`,
      `Resource levels: Food ${caravan.resources.food}%, Water ${caravan.resources.water}%, Fuel ${caravan.resources.fuel}%`,
      `Group morale remains ${
        caravan.resources.morale > 70
          ? "high"
          : caravan.resources.morale > 40
          ? "moderate"
          : "concerning"
      }.`,
    ];

    return content.join("\n");
  }

  // Statistics for dashboard
  getCaravanStatistics() {
    const totalMembers = this.caravans.reduce(
      (sum, caravan) => sum + caravan.members,
      0
    );
    const avgMorale = Math.round(
      this.caravans.reduce(
        (sum, caravan) => sum + caravan.resources.morale,
        0
      ) / this.caravans.length
    );
    const emergencyCount = this.caravans.filter(
      (caravan) => caravan.status === "emergency"
    ).length;
    const lowResourceCount = this.caravans.filter(
      (caravan) =>
        caravan.resources.food < 30 ||
        caravan.resources.water < 30 ||
        caravan.resources.fuel < 30
    ).length;

    return {
      totalCaravans: this.caravans.length,
      totalMembers,
      avgMorale,
      emergencyCount,
      lowResourceCount,
      operationalCount: this.caravans.filter(
        (caravan) => caravan.status === "moving"
      ).length,
    };
  }

  isLoaded() {
    return this.loaded;
  }
}
