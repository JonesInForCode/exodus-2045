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

    // Loading progress simulation
    const loadingFill = document.getElementById("loading-fill");
    let progress = 0;

    const progressInterval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
      }
      if (loadingFill) {
        loadingFill.style.width = `${progress}%`;
      }
    }, 100);

    this.load.on("complete", () => {
      // Hide HTML loading screen
      setTimeout(() => {
        const loading = document.getElementById("loading");
        if (loading) {
          loading.classList.add("hidden");
        }

        // Start main game
        this.scene.start("CoordinatorTerminal");
        this.scene.launch("GameUI");
      }, 500);
    });
  }

  create() {
    console.log("🚀 Boot sequence complete");

    // Start GameUI first (for background notifications)
    this.scene.launch("GameUI");

    // Small delay, then start the main terminal
    this.time.delayedCall(200, () => {
      this.scene.start("CoordinatorTerminal");
    });
  }
}
