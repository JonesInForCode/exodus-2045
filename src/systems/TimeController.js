/**
 * TimeController - Manages game time, speed controls, and temporal events
 * Handles time scaling: 1 real second = 1 game minute (adjustable)
 */

export default class TimeController {
  constructor(scene) {
    this.scene = scene;
    this.gameTime = new Date();
    this.realStartTime = Date.now();
    this.gameStartTime = new Date(this.gameTime);

    // Time speed settings
    this.timeSpeed = 1; // 1x, 2x, 4x multipliers
    this.isPaused = false;
    this.lastUpdateTime = Date.now();

    // Time scale: 1 real second = 1 game minute
    this.timeScale = 60; // 60 game seconds per real second

    // Update interval
    this.updateInterval = null;
    this.updateCallbacks = [];

    // Shift tracking
    this.shiftStartTime = new Date(this.gameTime);
    this.shiftDuration = 8 * 60; // 8 hours in game minutes
  }

  initialize() {
    this.startTimeLoop();
    console.log("⏰ Time Controller initialized");
    console.log(`📅 Game starts at: ${this.formatGameTime()}`);
  }

  startTimeLoop() {
    // Update every 100ms for smooth time progression
    this.updateInterval = setInterval(() => {
      this.updateGameTime();
    }, 100);
  }

  stopTimeLoop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  updateGameTime() {
    if (this.isPaused || this.timeSpeed === 0) {
      this.lastUpdateTime = Date.now();
      return;
    }

    const currentTime = Date.now();
    const deltaRealTime = currentTime - this.lastUpdateTime; // milliseconds

    // Convert real time to game time
    const deltaGameTime =
      (deltaRealTime / 1000) * this.timeScale * this.timeSpeed;

    // Update game time
    this.gameTime = new Date(this.gameTime.getTime() + deltaGameTime * 1000);
    this.lastUpdateTime = currentTime;

    // Notify all registered callbacks
    this.notifyCallbacks();

    // Update game state registry
    this.updateGameState();

    // Check for shift events
    this.checkShiftEvents();
  }

  notifyCallbacks() {
    this.updateCallbacks.forEach((callback) => {
      try {
        callback(this.gameTime, this.timeSpeed, this.isPaused);
      } catch (error) {
        console.error("Time callback error:", error);
      }
    });
  }

  updateGameState() {
    const gameState = this.scene.registry.get("gameState");
    if (gameState) {
      gameState.systemTime = new Date(this.gameTime);
      gameState.ui.timeSpeed = this.timeSpeed;
      this.scene.registry.set("gameState", gameState);
    }
  }

  checkShiftEvents() {
    const elapsedShiftTime = this.getElapsedShiftTime();

    // Check for shift warnings
    if (
      elapsedShiftTime >= this.shiftDuration - 30 &&
      elapsedShiftTime < this.shiftDuration - 29
    ) {
      this.scene.registry.events.emit("showNotification", {
        message: "Shift ending in 30 minutes",
        type: "warning",
      });
    }

    if (
      elapsedShiftTime >= this.shiftDuration - 10 &&
      elapsedShiftTime < this.shiftDuration - 9
    ) {
      this.scene.registry.events.emit("showNotification", {
        message: "Shift ending in 10 minutes - prepare handoff",
        type: "warning",
      });
    }

    // Check for shift end
    if (elapsedShiftTime >= this.shiftDuration) {
      this.triggerShiftEnd();
    }
  }

  triggerShiftEnd() {
    this.scene.registry.events.emit("emergencyAlert", {
      title: "SHIFT HANDOVER REQUIRED",
      message:
        "Your 8-hour shift has ended. You must hand over coordination to the next operator.",
    });

    console.log("⏰ Shift handover required");
  }

  // Public time control methods
  setTimeSpeed(speed) {
    if ([0, 1, 2, 4].includes(speed)) {
      this.timeSpeed = speed;
      this.isPaused = speed === 0;

      console.log(
        `⏱️ Time speed set to: ${speed === 0 ? "PAUSED" : speed + "X"}`
      );

      this.scene.registry.events.emit("showNotification", {
        message: `Time speed: ${speed === 0 ? "PAUSED" : speed + "X"}`,
        type: "info",
      });
    }
  }

  pause() {
    this.setTimeSpeed(0);
  }

  resume() {
    this.setTimeSpeed(1);
  }

  togglePause() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  // Time query methods
  getGameTime() {
    return new Date(this.gameTime);
  }

  getRealElapsedTime() {
    return Date.now() - this.realStartTime; // milliseconds
  }

  getGameElapsedTime() {
    return this.gameTime.getTime() - this.gameStartTime.getTime(); // milliseconds
  }

  getElapsedShiftTime() {
    return Math.floor(
      (this.gameTime.getTime() - this.shiftStartTime.getTime()) / (1000 * 60)
    ); // minutes
  }

  getRemainingShiftTime() {
    return Math.max(0, this.shiftDuration - this.getElapsedShiftTime());
  }

  getTimeSpeed() {
    return this.timeSpeed;
  }

  isPausedState() {
    return this.isPaused;
  }

  // Time formatting methods
  formatGameTime() {
    return this.gameTime.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  formatGameDate() {
    return this.gameTime.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  formatShiftTime() {
    const elapsed = this.getElapsedShiftTime();
    const hours = Math.floor(elapsed / 60);
    const minutes = elapsed % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  }

  formatRemainingShiftTime() {
    const remaining = this.getRemainingShiftTime();
    const hours = Math.floor(remaining / 60);
    const minutes = remaining % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  }

  // Event scheduling methods
  scheduleEvent(delayMinutes, callback, description = "Scheduled event") {
    const triggerTime = new Date(
      this.gameTime.getTime() + delayMinutes * 60 * 1000
    );

    const checkEvent = () => {
      if (this.gameTime >= triggerTime) {
        callback();
        console.log(`📅 Scheduled event triggered: ${description}`);
        return true; // Event triggered, remove from check
      }
      return false; // Keep checking
    };

    // Add to update callbacks temporarily
    const eventCallback = () => {
      if (checkEvent()) {
        // Remove this callback once event triggers
        this.unregisterCallback(eventCallback);
      }
    };

    this.registerCallback(eventCallback);
    console.log(
      `📅 Event scheduled for ${delayMinutes} minutes: ${description}`
    );
  }

  // Callback registration for other systems
  registerCallback(callback) {
    this.updateCallbacks.push(callback);
  }

  unregisterCallback(callback) {
    const index = this.updateCallbacks.indexOf(callback);
    if (index > -1) {
      this.updateCallbacks.splice(index, 1);
    }
  }

  // Shift management
  startNewShift() {
    this.shiftStartTime = new Date(this.gameTime);
    console.log(`⏰ New shift started at ${this.formatGameTime()}`);

    this.scene.registry.events.emit("showNotification", {
      message: "New coordination shift started",
      type: "success",
    });
  }

  // Time statistics for dashboard
  getTimeStatistics() {
    return {
      gameTime: this.formatGameTime(),
      gameDate: this.formatGameDate(),
      timeSpeed: this.timeSpeed,
      isPaused: this.isPaused,
      shiftElapsed: this.formatShiftTime(),
      shiftRemaining: this.formatRemainingShiftTime(),
      realElapsed: Math.floor(this.getRealElapsedTime() / 1000), // seconds
      gameElapsed: Math.floor(this.getGameElapsedTime() / 1000 / 60), // game minutes
    };
  }

  // Advanced time manipulation (for testing/debugging)
  advanceTime(minutes) {
    this.gameTime = new Date(this.gameTime.getTime() + minutes * 60 * 1000);
    console.log(
      `⏰ Time advanced by ${minutes} minutes to ${this.formatGameTime()}`
    );
  }

  setGameTime(newTime) {
    this.gameTime = new Date(newTime);
    console.log(`⏰ Time set to ${this.formatGameTime()}`);
  }

  destroy() {
    this.stopTimeLoop();
    this.updateCallbacks = [];
    console.log("⏰ Time Controller destroyed");
  }
}
