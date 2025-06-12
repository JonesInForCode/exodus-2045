export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    // Create basic assets
    this.load.image(
      "pixel",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    );

    this.load.on("complete", () => {
      console.log("🚀 Boot assets loaded, starting game systems...");
    });
  }

  create() {
    console.log("🚀 Boot sequence starting proper scene initialization");

    // Start GameUI first (persistent tab system)
    this.scene.start("GameUI");

    // Small delay, then launch the initial content scene
    this.time.delayedCall(300, () => {
      // Use 'start' instead of 'launch' for the initial scene
      this.scene.start("CoordinatorTerminal");
      console.log("✅ All scenes initialized - game ready");
    });
  }
}
