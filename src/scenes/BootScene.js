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

    // Launch GameUI (persistent tab system) - use launch so both scenes run
    this.scene.launch("GameUI");
    console.log("✅ GameUI launched");

    // Launch the initial content scene
    this.scene.launch("CoordinatorTerminal");
    console.log("✅ CoordinatorTerminal launched");

    // Stop the boot scene as it's no longer needed
    this.scene.stop();
    console.log("✅ Boot sequence complete");
  }
}
