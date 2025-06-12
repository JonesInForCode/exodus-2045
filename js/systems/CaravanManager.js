/**
 * CaravanManager - Handles caravan logic and state management
 * Phase 2 feature - currently a placeholder
 */

export default class CaravanManager {
  constructor(scene) {
    this.scene = scene;
    this.caravans = [];
    this.updateInterval = null;
  }

  async loadCaravanData() {
    try {
      // In Phase 2, this will load from the actual data file
      // For now, return sample data
      const sampleCaravans = [
        {
          id: "Alpha-7",
          leader: "Maria Santos",
          members: 12,
          location: {
            current: "Phoenix Outskirts",
            lat: 33.4484,
            lng: -112.074,
          },
          resources: {
            food: 75,
            water: 60,
            fuel: 45,
            medicine: 30,
            morale: 85,
          },
          status: "moving",
          lastContact: "14:23",
        },
      ];

      this.caravans = sampleCaravans;
      return sampleCaravans;
    } catch (error) {
      console.error("Failed to load caravan data:", error);
      return [];
    }
  }

  startTracking() {
    console.log("🚐 Caravan tracking started (Phase 2 feature)");

    // In Phase 2, this will start real-time position updates
    this.updateInterval = setInterval(() => {
      this.updateCaravanPositions();
    }, 5000); // Update every 5 seconds
  }

  stopTracking() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  updateCaravanPositions() {
    // Phase 2: Update caravan positions based on speed and route
    this.caravans.forEach((caravan) => {
      if (caravan.status === "moving") {
        // Simulate position updates
        console.log(`📍 ${caravan.id} position updated`);
      }
    });
  }

  getCaravanById(id) {
    return this.caravans.find((caravan) => caravan.id === id);
  }

  updateCaravanResources(caravanId, resourceChanges) {
    const caravan = this.getCaravanById(caravanId);
    if (caravan) {
      Object.keys(resourceChanges).forEach((resource) => {
        if (caravan.resources[resource] !== undefined) {
          caravan.resources[resource] = Math.max(
            0,
            Math.min(
              100,
              caravan.resources[resource] + resourceChanges[resource]
            )
          );
        }
      });

      console.log(`📊 ${caravanId} resources updated:`, resourceChanges);
      return true;
    }
    return false;
  }

  setCaravanStatus(caravanId, status) {
    const caravan = this.getCaravanById(caravanId);
    if (caravan) {
      caravan.status = status;
      caravan.lastContact = new Date().toLocaleTimeString().slice(0, 5);
      console.log(`🔄 ${caravanId} status changed to: ${status}`);
      return true;
    }
    return false;
  }

  getAllCaravans() {
    return this.caravans;
  }

  getCaravanCount() {
    return this.caravans.length;
  }

  getTotalMembers() {
    return this.caravans.reduce((total, caravan) => total + caravan.members, 0);
  }

  getAverageResources() {
    if (this.caravans.length === 0) return {};

    const totals = this.caravans.reduce((acc, caravan) => {
      Object.keys(caravan.resources).forEach((resource) => {
        acc[resource] = (acc[resource] || 0) + caravan.resources[resource];
      });
      return acc;
    }, {});

    const averages = {};
    Object.keys(totals).forEach((resource) => {
      averages[resource] = Math.round(totals[resource] / this.caravans.length);
    });

    return averages;
  }

  getCaravansInDanger() {
    return this.caravans.filter((caravan) => {
      const resources = caravan.resources;
      return (
        resources.food < 20 ||
        resources.water < 20 ||
        resources.fuel < 20 ||
        caravan.status === "emergency"
      );
    });
  }

  // Event handling methods for Phase 2
  handleCaravanMessage(caravanId, message) {
    console.log(`📧 Message from ${caravanId}:`, message);
    // Phase 2: Will integrate with MessageSystem
  }

  sendDirective(caravanId, directive) {
    console.log(`📡 Directive sent to ${caravanId}:`, directive);
    // Phase 2: Will send actual commands to caravans
  }

  destroy() {
    this.stopTracking();
    this.caravans = [];
    console.log("🚐 CaravanManager destroyed");
  }
}
