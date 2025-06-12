export default class MapView extends Phaser.Scene {
  constructor() {
    super({ key: "MapView" });
  }

  create() {
    const { width, height } = this.scale;

    // Placeholder for Phase 2
    this.add.rectangle(0, 0, width, height, 0x0f172a).setOrigin(0, 0);

    this.add
      .text(
        width / 2,
        height / 2,
        "MAP VIEW\n\n🗺️ Interactive GPS Tracking\n📍 Caravan Positions\n🛤️ Route Planning\n\nComing in Phase 2",
        {
          fontFamily: "Courier New",
          fontSize: "16px",
          color: "#10b981",
          align: "center",
        }
      )
      .setOrigin(0.5, 0.5);

    console.log("🗺️ Map View initialized (Phase 2 feature)");
  }
}
