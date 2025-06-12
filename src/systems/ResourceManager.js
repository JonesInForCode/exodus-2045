/**
 * ResourceManager - Handles global resource allocation and monitoring
 * Manages supply drops, fuel depots, medical resources, and coordination assets
 */

export default class ResourceManager {
  constructor(scene, dataManager) {
    this.scene = scene;
    this.dataManager = dataManager;
    this.globalResources = {};
    this.resourceHistory = [];
    this.updateInterval = null;
    this.updateCallback = null;
  }

  initialize(updateCallback) {
    this.updateCallback = updateCallback;
    this.globalResources = this.dataManager.getGlobalResources();
    this.startResourceMonitoring();
    console.log("📊 Resource Manager initialized");
  }

  startResourceMonitoring() {
    // Update resource display every 5 seconds
    this.updateInterval = setInterval(() => {
      this.updateResourceLevels();
      this.logResourceUsage();
    }, 5000);
  }

  stopResourceMonitoring() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  updateResourceLevels() {
    // Simulate resource consumption and regeneration
    const gameState = this.scene.registry.get("gameState");
    const timeSpeed = gameState.ui.timeSpeed;

    if (timeSpeed > 0) {
      // Resources naturally consume/regenerate over time
      this.simulateResourceChanges(timeSpeed);

      // Update display if callback is set
      if (this.updateCallback) {
        this.updateCallback(this.globalResources);
      }

      // Check for low resource warnings
      this.checkResourceWarnings();
    }
  }

  simulateResourceChanges(timeSpeed) {
    // Supply drops occasionally get restocked
    if (Math.random() < 0.02 * timeSpeed) {
      // 2% chance per speed level
      const currentDrops = this.globalResources.availableSupplyDrops;
      if (currentDrops < 8) {
        this.globalResources.availableSupplyDrops = Math.min(
          8,
          currentDrops + 1
        );
        console.log("📦 New supply drop delivered to inventory");
      }
    }

    // Drones occasionally come online/offline
    if (Math.random() < 0.01 * timeSpeed) {
      const change = Math.random() < 0.7 ? 1 : -1; // 70% chance to add, 30% to lose
      this.globalResources.activeDrones = Math.max(
        0,
        Math.min(6, this.globalResources.activeDrones + change)
      );
    }

    // Fuel depots occasionally go offline for maintenance
    if (Math.random() < 0.005 * timeSpeed) {
      const change = Math.random() < 0.8 ? 0 : -1; // Occasional maintenance
      this.globalResources.fuelDepots = Math.max(
        5,
        Math.min(12, this.globalResources.fuelDepots + change)
      );
    }

    // Medical teams occasionally become available/busy
    if (Math.random() < 0.03 * timeSpeed) {
      const change = Math.random() < 0.6 ? 1 : -1;
      this.globalResources.medicalTeams = Math.max(
        0,
        Math.min(4, this.globalResources.medicalTeams + change)
      );
    }
  }

  checkResourceWarnings() {
    const resources = this.globalResources;

    // Check for critically low resources
    if (resources.availableSupplyDrops <= 1 && Math.random() < 0.1) {
      this.scene.registry.events.emit("showNotification", {
        message: "CRITICAL: Supply drops running low",
        type: "error",
      });
    }

    if (resources.activeDrones <= 1 && Math.random() < 0.1) {
      this.scene.registry.events.emit("showNotification", {
        message: "WARNING: Drone fleet compromised",
        type: "warning",
      });
    }

    if (resources.medicalTeams <= 0 && Math.random() < 0.1) {
      this.scene.registry.events.emit("showNotification", {
        message: "ALERT: No medical teams available",
        type: "error",
      });
    }
  }

  logResourceUsage() {
    // Keep resource history for statistics
    this.resourceHistory.push({
      timestamp: new Date(),
      resources: { ...this.globalResources },
    });

    // Keep only last 100 entries
    if (this.resourceHistory.length > 100) {
      this.resourceHistory = this.resourceHistory.slice(-100);
    }
  }

  // Resource allocation methods
  allocateSupplyDrop(caravanId, resourceType) {
    if (this.globalResources.availableSupplyDrops <= 0) {
      console.log("❌ No supply drops available");
      return false;
    }

    const caravan = this.dataManager.getCaravanById(caravanId);
    if (!caravan) {
      console.log("❌ Caravan not found");
      return false;
    }

    // Consume supply drop
    this.globalResources.availableSupplyDrops--;

    // Determine resource boost based on type
    const resourceBoosts = {
      food: { food: 40, morale: 10 },
      water: { water: 40, morale: 5 },
      medical: { medicine: 50, morale: 15 },
      fuel: { fuel: 35, morale: 5 },
      general: { food: 20, water: 20, fuel: 15, medicine: 10, morale: 10 },
    };

    const boost = resourceBoosts[resourceType] || resourceBoosts.general;

    // Apply boost to caravan
    this.dataManager.updateCaravanResources(caravanId, boost);

    console.log(`📦 Supply drop (${resourceType}) allocated to ${caravanId}`);

    this.scene.registry.events.emit("showNotification", {
      message: `Supply drop delivered to ${caravanId}`,
      type: "success",
    });

    return true;
  }

  deployMedicalTeam(caravanId) {
    if (this.globalResources.medicalTeams <= 0) {
      console.log("❌ No medical teams available");
      return false;
    }

    const caravan = this.dataManager.getCaravanById(caravanId);
    if (!caravan) {
      console.log("❌ Caravan not found");
      return false;
    }

    // Consume medical team
    this.globalResources.medicalTeams--;

    // Medical team provides significant medicine boost and heals injuries
    this.dataManager.updateCaravanResources(caravanId, {
      medicine: 60,
      morale: 20,
    });

    console.log(`🏥 Medical team deployed to ${caravanId}`);

    this.scene.registry.events.emit("showNotification", {
      message: `Medical team deployed to ${caravanId}`,
      type: "success",
    });

    // Medical team returns after 30 seconds (game time)
    setTimeout(() => {
      this.globalResources.medicalTeams++;
      console.log("🏥 Medical team returned to base");
    }, 30000);

    return true;
  }

  launchDroneRecon(targetArea) {
    if (this.globalResources.activeDrones <= 0) {
      console.log("❌ No drones available");
      return false;
    }

    // Consume drone temporarily
    this.globalResources.activeDrones--;

    console.log(`🚁 Drone reconnaissance launched for ${targetArea}`);

    this.scene.registry.events.emit("showNotification", {
      message: `Drone recon launched: ${targetArea}`,
      type: "info",
    });

    // Drone returns with intelligence after 20 seconds
    setTimeout(() => {
      this.globalResources.activeDrones++;

      // Generate reconnaissance report
      const reports = [
        "Clear skies, safe passage confirmed",
        "Minor debris detected, alternate route recommended",
        "Weather disturbance approaching from west",
        "Potential shelter location identified",
        "No immediate hazards detected",
      ];

      const report = reports[Math.floor(Math.random() * reports.length)];

      this.scene.registry.events.emit("showNotification", {
        message: `Recon complete: ${report}`,
        type: "info",
      });

      console.log(`🚁 Drone returned. Report: ${report}`);
    }, 20000);

    return true;
  }

  // Fuel depot coordination
  coordinateFuelDelivery(caravanId) {
    if (this.globalResources.fuelDepots <= 0) {
      console.log("❌ No fuel depots available");
      return false;
    }

    const caravan = this.dataManager.getCaravanById(caravanId);
    if (!caravan) {
      console.log("❌ Caravan not found");
      return false;
    }

    // Check if caravan is near a fuel depot (simplified)
    const nearDepot = Math.random() < 0.7; // 70% chance they're near one

    if (!nearDepot) {
      console.log("❌ No fuel depot in range");
      this.scene.registry.events.emit("showNotification", {
        message: `${caravanId}: No fuel depot in range`,
        type: "warning",
      });
      return false;
    }

    // Provide fuel boost
    this.dataManager.updateCaravanResources(caravanId, {
      fuel: 75, // Major fuel boost
      morale: 5,
    });

    console.log(`⛽ Fuel delivery coordinated for ${caravanId}`);

    this.scene.registry.events.emit("showNotification", {
      message: `Fuel delivery to ${caravanId} successful`,
      type: "success",
    });

    return true;
  }

  // Resource status methods
  getGlobalResources() {
    return { ...this.globalResources };
  }

  getResourceUtilization() {
    // Calculate how much of each resource type is being used
    const maxResources = {
      availableSupplyDrops: 8,
      activeDrones: 6,
      fuelDepots: 12,
      medicalTeams: 4,
      communicationSatellites: 4,
      weatherStations: 12,
    };

    const utilization = {};
    Object.keys(this.globalResources).forEach((resource) => {
      const current = this.globalResources[resource];
      const max = maxResources[resource] || current;
      utilization[resource] = {
        current,
        max,
        percentage: Math.round((current / max) * 100),
      };
    });

    return utilization;
  }

  getResourceStatistics() {
    const caravans = this.dataManager.getAllCaravans();

    // Calculate average caravan resource levels
    const avgResources = {
      food: 0,
      water: 0,
      fuel: 0,
      medicine: 0,
      morale: 0,
    };

    if (caravans.length > 0) {
      caravans.forEach((caravan) => {
        Object.keys(avgResources).forEach((resource) => {
          avgResources[resource] += caravan.resources[resource] || 0;
        });
      });

      Object.keys(avgResources).forEach((resource) => {
        avgResources[resource] = Math.round(
          avgResources[resource] / caravans.length
        );
      });
    }

    // Count caravans needing assistance
    const needingAssistance = caravans.filter(
      (caravan) =>
        caravan.resources.food < 30 ||
        caravan.resources.water < 30 ||
        caravan.resources.fuel < 30 ||
        caravan.resources.medicine < 20
    ).length;

    return {
      globalResources: this.globalResources,
      avgCaravanResources: avgResources,
      caravansNeedingAssistance: needingAssistance,
      totalCaravans: caravans.length,
      utilizationStatus: this.getResourceUtilization(),
    };
  }

  destroy() {
    this.stopResourceMonitoring();
    this.globalResources = {};
    this.resourceHistory = [];
    this.updateCallback = null;
    console.log("📊 Resource Manager destroyed");
  }
}
