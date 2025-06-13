import Phaser from "phaser";

export default class MapView extends Phaser.Scene {
  constructor() {
    super({ key: "MapView" });
    this.mapContainer = null;
    this.caravanMarkers = [];
    this.gridLines = null;
    this.mapBounds = {
      minLat: 32.0, // Southern California
      maxLat: 49.0, // Northern Idaho
      minLng: -125.0, // Pacific Coast
      maxLng: -109.0, // Eastern Nevada/Idaho
    };
    this.mapScale = 1;
    this.mapOffsetX = 0;
    this.mapOffsetY = 0;
    this.selectedCaravan = null;
    this.blinkTimer = null;
  }

  create() {
    const { width, height } = this.scale;
    const tabHeight = 40; // Height of the tab bar

    // Map background - start below the tab bar
    this.add
      .rectangle(0, tabHeight, width, height - tabHeight, 0x0f172a)
      .setOrigin(0, 0);

    // Main map container
    this.mapContainer = this.add.container(0, 0);

    // Create map elements
    this.createMapHeader();
    this.createMapGrid();
    this.createRegionOutlines();
    this.createMapLegend();
    this.createControlButtons();

    // Load and display caravans
    this.loadCaravanData();

    // Set up periodic updates
    this.time.addEvent({
      delay: 5000,
      callback: this.updateCaravanPositions,
      callbackScope: this,
      loop: true,
    });

    // Set up caravan marker blinking
    this.blinkTimer = this.time.addEvent({
      delay: 1000,
      callback: this.blinkCaravanMarkers,
      callbackScope: this,
      loop: true,
    });

    console.log("🗺️ Map View initialized - Western US Grid Map");
  }

  createMapHeader() {
    const { width } = this.scale;
    const tabHeight = 40;

    // Header background - positioned below tab bar
    this.add.rectangle(0, tabHeight, width, 60, 0x1e293b).setOrigin(0, 0);

    // Title
    this.add.text(20, tabHeight + 15, "🗺️ WESTERN REGION TRACKING MAP", {
      fontFamily: "Courier New",
      fontSize: "18px",
      color: "#10b981",
      fontWeight: "bold",
    });

    // Map info
    this.add.text(
      20,
      tabHeight + 35,
      "Grid: USGS-2045 | Scale: 1:2,500,000 | Projection: Modified Mercator",
      {
        fontFamily: "Courier New",
        fontSize: "11px",
        color: "#94a3b8",
      }
    );

    // Status indicator
    this.add
      .text(width - 20, tabHeight + 30, "🟢 SATELLITE LINK ACTIVE", {
        fontFamily: "Courier New",
        fontSize: "12px",
        color: "#10b981",
      })
      .setOrigin(1, 0.5);
  }

  createMapGrid() {
    const { width, height } = this.scale;
    const mapArea = {
      x: 50,
      y: 110,
      width: width - 350, // Leave space for legend
      height: height - 170,
    };

    // Grid background
    this.add
      .rectangle(mapArea.x, mapArea.y, mapArea.width, mapArea.height, 0x0a0a0a)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x334155);

    // Create grid lines
    this.gridLines = this.add.group();

    const gridSpacing = 40;
    const gridColor = 0x1e293b;

    // Vertical grid lines
    for (let x = mapArea.x; x <= mapArea.x + mapArea.width; x += gridSpacing) {
      const line = this.add
        .line(0, 0, x, mapArea.y, x, mapArea.y + mapArea.height, gridColor)
        .setLineWidth(1)
        .setOrigin(0, 0);
      this.gridLines.add(line);
    }

    // Horizontal grid lines
    for (let y = mapArea.y; y <= mapArea.y + mapArea.height; y += gridSpacing) {
      const line = this.add
        .line(0, 0, mapArea.x, y, mapArea.x + mapArea.width, y, gridColor)
        .setLineWidth(1)
        .setOrigin(0, 0);
      this.gridLines.add(line);
    }

    // Grid coordinates
    const coordColor = "#475569";
    for (let i = 0; i <= 12; i++) {
      // Vertical coordinates (longitude approximation)
      this.add
        .text(
          mapArea.x + (i * mapArea.width) / 12,
          mapArea.y + mapArea.height + 10,
          `${(125 - i * 1.3).toFixed(1)}°W`,
          {
            fontFamily: "Courier New",
            fontSize: "9px",
            color: coordColor,
          }
        )
        .setOrigin(0.5, 0);

      // Horizontal coordinates (latitude approximation)
      if (i <= 8) {
        this.add
          .text(
            mapArea.x - 10,
            mapArea.y + (i * mapArea.height) / 8,
            `${(49 - i * 2.1).toFixed(1)}°N`,
            {
              fontFamily: "Courier New",
              fontSize: "9px",
              color: coordColor,
            }
          )
          .setOrigin(1, 0.5);
      }
    }

    this.mapArea = mapArea;
  }

  createRegionOutlines() {
    const { x, y, width, height } = this.mapArea;

    // More subtle state boundaries - using dashed lines instead of solid polygons
    const stateColor = 0x2d4059;
    const borderStyle = { width: 1, color: stateColor, alpha: 0.5 };

    // Create state labels without complex borders
    const stateLabels = [
      { abbr: "CA", x: x + width * 0.15, y: y + height * 0.5 },
      { abbr: "NV", x: x + width * 0.35, y: y + height * 0.45 },
      { abbr: "OR", x: x + width * 0.25, y: y + height * 0.15 },
      { abbr: "WA", x: x + width * 0.25, y: y + height * 0.05 },
      { abbr: "ID", x: x + width * 0.55, y: y + height * 0.25 },
      { abbr: "UT", x: x + width * 0.55, y: y + height * 0.55 },
      { abbr: "AZ", x: x + width * 0.45, y: y + height * 0.8 },
      { abbr: "MT", x: x + width * 0.7, y: y + height * 0.1 },
      { abbr: "WY", x: x + width * 0.75, y: y + height * 0.35 },
      { abbr: "CO", x: x + width * 0.8, y: y + height * 0.55 },
      { abbr: "NM", x: x + width * 0.7, y: y + height * 0.8 },
    ];

    // Add state labels with subtle styling
    stateLabels.forEach((state) => {
      this.add
        .text(state.x, state.y, state.abbr, {
          fontFamily: "Courier New",
          fontSize: "16px",
          color: "#475569",
          fontWeight: "bold",
          alpha: 0.3,
        })
        .setOrigin(0.5);
    });

    // Add major geographic features as reference points
    this.addGeographicFeatures();

    // Add cities with more accurate positioning
    this.addMajorCities();

    // Add climate zones
    this.addClimateZones();

    // Add caravan routes
    this.addCaravanRoutes();

    this.addSpecialDestinations();
  }

  drawPolygon(points, color, lineWidth) {
    const graphics = this.add.graphics();
    graphics.lineStyle(lineWidth, color);
    graphics.beginPath();
    graphics.moveTo(points[0][0], points[0][1]);

    for (let i = 1; i < points.length; i++) {
      graphics.lineTo(points[i][0], points[i][1]);
    }

    graphics.closePath();
    graphics.strokePath();
  }

  addCityMarker(x, y, name) {
    // Small city marker
    this.add.circle(x, y, 3, 0x64748b);
    this.add.text(x + 8, y, name, {
      fontFamily: "Courier New",
      fontSize: "8px",
      color: "#64748b",
    });
  }

  /*addDestinationMarker(x, y, name) {
    // Special destination marker (larger, different color)
    this.add.circle(x, y, 6, 0x10b981).setStrokeStyle(2, 0xf59e0b);
    this.add.text(x + 10, y, name, {
      fontFamily: "Courier New",
      fontSize: "9px",
      color: "#10b981",
      fontWeight: "bold",
    });

    // Add destination icon
    this.add
      .text(x, y, "🏛", {
        fontFamily: "Courier New",
        fontSize: "10px",
        color: "#0f172a",
      })
      .setOrigin(0.5);
  } */

  addGeographicFeatures() {
    const { x, y, width, height } = this.mapArea;

    // Pacific coastline (simplified)
    const coastGraphics = this.add.graphics();
    coastGraphics.lineStyle(2, 0x3b82f6, 0.3);
    coastGraphics.beginPath();
    coastGraphics.moveTo(x, y);
    coastGraphics.lineTo(x + 5, y + height * 0.4);
    coastGraphics.lineTo(x + 15, y + height * 0.6);
    coastGraphics.lineTo(x + 10, y + height);
    coastGraphics.strokePath();

    // Rocky Mountains indication
    const mountainGraphics = this.add.graphics();
    mountainGraphics.lineStyle(1, 0x6b7280, 0.2);
    for (let i = 0; i < 5; i++) {
      const mx = x + width * 0.65 + i * 15;
      const my = y + 50 + i * 80;
      this.add.text(mx, my, "⛰", {
        fontSize: "12px",
        color: "#6b7280",
        alpha: 0.5,
      });
    }
  }

  addMajorCities() {
    const { x, y, width, height } = this.mapArea;

    // Cities with more accurate relative positions
    const cities = [
      // California
      { name: "Los Angeles", lat: 34.05, lng: -118.25, x: 0.12, y: 0.73 },
      { name: "San Francisco", lat: 37.77, lng: -122.42, x: 0.05, y: 0.52 },
      { name: "San Diego", lat: 32.71, lng: -117.16, x: 0.13, y: 0.82 },
      { name: "Sacramento", lat: 38.58, lng: -121.49, x: 0.08, y: 0.48 },

      // Nevada
      { name: "Las Vegas", lat: 36.17, lng: -115.14, x: 0.28, y: 0.63 },
      { name: "Reno", lat: 39.53, lng: -119.81, x: 0.18, y: 0.42 },

      // Oregon
      { name: "Portland", lat: 45.52, lng: -122.68, x: 0.1, y: 0.2 },
      { name: "Eugene", lat: 44.05, lng: -123.09, x: 0.08, y: 0.26 },

      // Washington
      { name: "Seattle", lat: 47.61, lng: -122.33, x: 0.12, y: 0.08 },
      { name: "Spokane", lat: 47.66, lng: -117.43, x: 0.32, y: 0.08 },

      // Idaho
      { name: "Boise", lat: 43.62, lng: -116.21, x: 0.38, y: 0.28 },

      // Utah
      { name: "Salt Lake City", lat: 40.76, lng: -111.89, x: 0.52, y: 0.4 },

      // Arizona
      { name: "Phoenix", lat: 33.45, lng: -112.07, x: 0.4, y: 0.75 },
      { name: "Tucson", lat: 32.22, lng: -110.93, x: 0.44, y: 0.83 },

      // Other major cities
      { name: "Denver", lat: 39.74, lng: -104.99, x: 0.78, y: 0.42 },
      { name: "Albuquerque", lat: 35.08, lng: -106.65, x: 0.68, y: 0.68 },
    ];

    cities.forEach((city) => {
      const cityX = x + width * city.x;
      const cityY = y + height * city.y;

      // City marker
      this.add.circle(cityX, cityY, 4, 0x475569, 0.8);
      this.add.circle(cityX, cityY, 2, 0xe2e8f0);

      // City name
      this.add.text(cityX + 8, cityY, city.name, {
        fontFamily: "Courier New",
        fontSize: "9px",
        color: "#94a3b8",
      });
    });
  }

  addClimateZones() {
    const { x, y, width, height } = this.mapArea;

    // Danger zones (heat/drought)
    const dangerGraphics = this.add.graphics();
    dangerGraphics.fillStyle(0xef4444, 0.1);
    dangerGraphics.fillCircle(x + width * 0.4, y + height * 0.75, 80); // Phoenix heat zone
    dangerGraphics.fillCircle(x + width * 0.3, y + height * 0.65, 60); // Vegas heat zone

    // Safe zones
    const safeGraphics = this.add.graphics();
    safeGraphics.fillStyle(0x10b981, 0.1);
    safeGraphics.fillCircle(x + width * 0.12, y + height * 0.08, 50); // New Seattle
    safeGraphics.fillCircle(x + width * 0.85, y + height * 0.15, 70); // Mountain zones

    // Add zone labels
    this.add
      .text(x + width * 0.4, y + height * 0.9, "EXTREME HEAT ZONE", {
        fontFamily: "Courier New",
        fontSize: "8px",
        color: "#ef4444",
        alpha: 0.6,
      })
      .setOrigin(0.5);
  }

  addCaravanRoutes() {
    const { x, y, width, height } = this.mapArea;

    // Define main migration corridors
    const routes = [
      {
        name: "Pacific Corridor",
        points: [
          { x: 0.13, y: 0.82 }, // San Diego
          { x: 0.12, y: 0.73 }, // LA
          { x: 0.08, y: 0.48 }, // Sacramento
          { x: 0.1, y: 0.2 }, // Portland
          { x: 0.12, y: 0.08 }, // Seattle
        ],
        color: 0x3b82f6,
      },
      {
        name: "Desert Passage",
        points: [
          { x: 0.4, y: 0.75 }, // Phoenix
          { x: 0.28, y: 0.63 }, // Las Vegas
          { x: 0.18, y: 0.42 }, // Reno
          { x: 0.38, y: 0.28 }, // Boise
          { x: 0.32, y: 0.08 }, // Spokane
        ],
        color: 0xf59e0b,
      },
      {
        name: "Mountain Route",
        points: [
          { x: 0.44, y: 0.83 }, // Tucson
          { x: 0.4, y: 0.75 }, // Phoenix
          { x: 0.52, y: 0.4 }, // Salt Lake City
          { x: 0.38, y: 0.28 }, // Boise
          { x: 0.55, y: 0.15 }, // Northern Idaho
        ],
        color: 0x10b981,
      },
    ];

    // Draw routes
    routes.forEach((route) => {
      const routeGraphics = this.add.graphics();
      routeGraphics.lineStyle(3, route.color, 0.3);

      // Convert route points to pixel coordinates
      const pixelPoints = route.points.map((point) => ({
        x: x + width * point.x,
        y: y + height * point.y,
      }));

      // Draw route using Phaser's curve system
      if (pixelPoints.length > 1) {
        // Create a spline curve through all points for smooth path
        const curve = new Phaser.Curves.Spline(
          pixelPoints.map((p) => [p.x, p.y])
        );

        // Draw the curve
        curve.draw(routeGraphics, 64); // 64 segments for smoothness
      }

      // Add route markers at each waypoint
      route.points.forEach((point) => {
        const px = x + width * point.x;
        const py = y + height * point.y;

        // Outer circle (background)
        this.add.circle(px, py, 4, 0x1e293b);
        // Inner circle (route color)
        this.add.circle(px, py, 3, route.color);
      });

      // Add route name label at midpoint
      if (route.points.length > 2) {
        const midIndex = Math.floor(route.points.length / 2);
        const midPoint = route.points[midIndex];
        const labelX = x + width * midPoint.x;
        const labelY = y + height * midPoint.y - 15;

        this.add
          .text(labelX, labelY, route.name, {
            fontFamily: "Courier New",
            fontSize: "8px",
            color: `#${route.color.toString(16).padStart(6, "0")}`,
            stroke: "#0f172a",
            strokeThickness: 2,
            alpha: 0.8,
          })
          .setOrigin(0.5);
      }
    });

    // Add route legend in bottom left
    this.add.text(x + 10, y + height - 60, "MIGRATION CORRIDORS", {
      fontFamily: "Courier New",
      fontSize: "9px",
      color: "#94a3b8",
      fontWeight: "bold",
    });

    const corridorColors = [
      { name: "Pacific", color: "#3b82f6" },
      { name: "Desert", color: "#f59e0b" },
      { name: "Mountain", color: "#10b981" },
    ];

    corridorColors.forEach((corridor, index) => {
      const ly = y + height - 45 + index * 12;
      this.add.rectangle(
        x + 15,
        ly,
        20,
        2,
        Phaser.Display.Color.HexStringToColor(corridor.color).color
      );
      this.add
        .text(x + 40, ly, corridor.name, {
          fontFamily: "Courier New",
          fontSize: "8px",
          color: "#64748b",
        })
        .setOrigin(0, 0.5);
    });
  }

  addSpecialDestinations() {
    const { x, y, width, height } = this.mapArea;

    const destinations = [
      { name: "New Seattle Climate Zone", x: 0.12, y: 0.08, icon: "🏛" },
      { name: "Great Lakes Collective", x: 0.95, y: 0.25, icon: "💧" },
      { name: "Mountain Fortress", x: 0.78, y: 0.35, icon: "🏔" },
      { name: "Canadian Border Sanctuary", x: 0.25, y: 0.02, icon: "🍁" },
    ];

    destinations.forEach((dest) => {
      const dx = x + width * dest.x;
      const dy = y + height * dest.y;

      // Destination marker
      this.add.circle(dx, dy, 8, 0x10b981).setStrokeStyle(2, 0xfbbf24);
      this.add
        .text(dx, dy, dest.icon, {
          fontFamily: "Arial",
          fontSize: "14px",
        })
        .setOrigin(0.5);

      // Label
      this.add
        .text(dx, dy + 15, dest.name, {
          fontFamily: "Courier New",
          fontSize: "9px",
          color: "#10b981",
          fontWeight: "bold",
          stroke: "#0f172a",
          strokeThickness: 2,
        })
        .setOrigin(0.5, 0);
    });
  }

  createMapLegend() {
    const { width, height } = this.scale;
    const legendX = width - 300;
    const legendY = 80;

    // Legend background
    this.add
      .rectangle(legendX, legendY, 280, height - 140, 0x1e293b)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x334155);

    // Legend title
    this.add.text(legendX + 10, legendY + 10, "📊 TRACKING LEGEND", {
      fontFamily: "Courier New",
      fontSize: "12px",
      color: "#f59e0b",
      fontWeight: "bold",
    });

    // Legend items
    const legendItems = [
      { color: 0x10b981, symbol: "●", label: "Active Caravan" },
      { color: 0xf59e0b, symbol: "◐", label: "Resting Caravan" },
      { color: 0xef4444, symbol: "⚠", label: "Emergency Status" },
      { color: 0x64748b, symbol: "■", label: "City/Checkpoint" },
      { color: 0x334155, symbol: "—", label: "State Boundary" },
      { color: 0x1e293b, symbol: "⋯", label: "Grid Lines" },
    ];

    legendItems.forEach((item, index) => {
      const y = legendY + 40 + index * 25;

      // Symbol
      this.add.text(legendX + 15, y, item.symbol, {
        fontFamily: "Courier New",
        fontSize: "14px",
        color: Phaser.Display.Color.GetColor32(item.color),
      });

      // Label
      this.add.text(legendX + 35, y, item.label, {
        fontFamily: "Courier New",
        fontSize: "10px",
        color: "#cbd5e1",
      });
    });

    // Caravan info panel
    this.caravanInfoPanel = this.add.container(legendX, legendY + 200);
    this.updateCaravanInfo();
  }

  createControlButtons() {
    const { width, height } = this.scale;
    const buttonY = height - 60;

    // Map controls
    this.createMapButton(50, buttonY, "🔍 ZOOM", () => this.zoomMap(1.2));
    this.createMapButton(140, buttonY, "🔍- ZOOM OUT", () => this.zoomMap(0.8));
    this.createMapButton(250, buttonY, "📍 CENTER", () => this.centerMap());
    this.createMapButton(340, buttonY, "🔄 REFRESH", () =>
      this.refreshCaravans()
    );
  }

  createMapButton(x, y, text, callback) {
    const button = this.add
      .text(x, y, text, {
        fontFamily: "Courier New",
        fontSize: "11px",
        color: "#e2e8f0",
        backgroundColor: "#475569",
        padding: { x: 8, y: 4 },
      })
      .setInteractive();

    button.on("pointerover", () => {
      button.setStyle({ backgroundColor: "#10b981", color: "#0f172a" });
    });

    button.on("pointerout", () => {
      button.setStyle({ backgroundColor: "#475569", color: "#e2e8f0" });
    });

    button.on("pointerdown", callback);
    return button;
  }

  loadCaravanData() {
    // Get caravan data from registry
    const gameState = this.registry.get("gameState");
    if (gameState && gameState.caravans) {
      this.displayCaravans(gameState.caravans);
    } else {
      // Fallback to hardcoded data if registry is empty
      this.loadFallbackCaravans();
    }
  }

  loadFallbackCaravans() {
    const fallbackCaravans = [
      {
        id: "Alpha-7",
        leader: "Maria Santos",
        members: 12,
        location: {
          current: "Phoenix Outskirts",
          lat: 33.4484,
          lng: -112.074,
        },
        status: "moving",
        resources: {
          food: 75,
          water: 60,
          fuel: 45,
          medicine: 30,
          morale: 85,
        },
      },
    ];
    this.displayCaravans(fallbackCaravans);
  }

  displayCaravans(caravans) {
    // Clear existing markers
    this.caravanMarkers.forEach((marker) => marker.destroy());
    this.caravanMarkers = [];

    caravans.forEach((caravan) => {
      if (this.isCaravanInRegion(caravan)) {
        this.createCaravanMarker(caravan);
      }
    });
  }

  isCaravanInRegion(caravan) {
    const { lat, lng } = caravan.location;
    return (
      lat >= this.mapBounds.minLat &&
      lat <= this.mapBounds.maxLat &&
      lng >= this.mapBounds.minLng &&
      lng <= this.mapBounds.maxLng
    );
  }

  createCaravanMarker(caravan) {
    const { x, y } = this.latLngToPixel(
      caravan.location.lat,
      caravan.location.lng
    );

    // Marker color based on status
    const statusColors = {
      moving: 0x10b981,
      resting: 0xf59e0b,
      emergency: 0xef4444,
      shelter: 0x06b6d4,
    };

    const color = statusColors[caravan.status] || 0x10b981;

    // Create marker container
    const markerContainer = this.add.container(x, y);

    // Main marker circle
    const marker = this.add.circle(0, 0, 8, color).setStrokeStyle(2, 0x0f172a);

    // Caravan ID label
    const label = this.add
      .text(0, -20, caravan.id, {
        fontFamily: "Courier New",
        fontSize: "10px",
        color: "#e2e8f0",
        backgroundColor: "#1e293b",
        padding: { x: 4, y: 2 },
      })
      .setOrigin(0.5);

    // Status indicator
    const statusIcon = this.getStatusIcon(caravan.status);
    const icon = this.add
      .text(0, 0, statusIcon, {
        fontFamily: "Courier New",
        fontSize: "12px",
        color: "#0f172a",
      })
      .setOrigin(0.5);

    markerContainer.add([marker, label, icon]);

    // Make marker interactive
    marker.setInteractive();
    marker.on("pointerdown", () => this.selectCaravan(caravan));
    marker.on("pointerover", () => this.showCaravanTooltip(caravan, x, y));
    marker.on("pointerout", () => this.hideCaravanTooltip());

    // Store reference
    markerContainer.caravanData = caravan;
    markerContainer.markerCircle = marker;
    this.caravanMarkers.push(markerContainer);
  }

  getStatusIcon(status) {
    const icons = {
      moving: "→",
      resting: "⏸",
      emergency: "!",
      shelter: "🏠",
    };
    return icons[status] || "?";
  }

  latLngToPixel(lat, lng) {
    const { mapArea } = this;

    // Convert lat/lng to pixel coordinates within map area
    const latRange = this.mapBounds.maxLat - this.mapBounds.minLat;
    const lngRange = this.mapBounds.maxLng - this.mapBounds.minLng;

    const x =
      mapArea.x + ((lng - this.mapBounds.minLng) / lngRange) * mapArea.width;
    const y =
      mapArea.y +
      mapArea.height -
      ((lat - this.mapBounds.minLat) / latRange) * mapArea.height;

    return { x, y };
  }

  selectCaravan(caravan) {
    this.selectedCaravan = caravan;
    this.updateCaravanInfo();

    // Highlight selected marker
    this.caravanMarkers.forEach((marker) => {
      if (marker.caravanData.id === caravan.id) {
        marker.markerCircle.setStrokeStyle(3, 0xfbbf24);
      } else {
        marker.markerCircle.setStrokeStyle(2, 0x0f172a);
      }
    });

    console.log(`📍 Selected caravan: ${caravan.id}`);
  }

  updateCaravanInfo() {
    // Clear existing info
    this.caravanInfoPanel.removeAll(true);

    if (!this.selectedCaravan) {
      this.caravanInfoPanel.add(
        this.add.text(10, 10, "Select a caravan for details", {
          fontFamily: "Courier New",
          fontSize: "10px",
          color: "#94a3b8",
        })
      );
      return;
    }

    const caravan = this.selectedCaravan;
    let yOffset = 10;

    // Title
    this.caravanInfoPanel.add(
      this.add.text(10, yOffset, `📍 ${caravan.id}`, {
        fontFamily: "Courier New",
        fontSize: "12px",
        color: "#10b981",
        fontWeight: "bold",
      })
    );
    yOffset += 20;

    // Leader
    this.caravanInfoPanel.add(
      this.add.text(10, yOffset, `Leader: ${caravan.leader}`, {
        fontFamily: "Courier New",
        fontSize: "9px",
        color: "#cbd5e1",
      })
    );
    yOffset += 15;

    // Members
    this.caravanInfoPanel.add(
      this.add.text(10, yOffset, `Members: ${caravan.members}`, {
        fontFamily: "Courier New",
        fontSize: "9px",
        color: "#cbd5e1",
      })
    );
    yOffset += 15;

    // Status
    const statusColor = caravan.status === "emergency" ? "#ef4444" : "#10b981";
    this.caravanInfoPanel.add(
      this.add.text(10, yOffset, `Status: ${caravan.status}`, {
        fontFamily: "Courier New",
        fontSize: "9px",
        color: statusColor,
      })
    );
    yOffset += 15;

    // Location
    this.caravanInfoPanel.add(
      this.add.text(10, yOffset, `Location: ${caravan.location.current}`, {
        fontFamily: "Courier New",
        fontSize: "9px",
        color: "#cbd5e1",
      })
    );
    yOffset += 15;

    // Coordinates
    this.caravanInfoPanel.add(
      this.add.text(
        10,
        yOffset,
        `${caravan.location.lat.toFixed(3)}°N, ${Math.abs(
          caravan.location.lng
        ).toFixed(3)}°W`,
        {
          fontFamily: "Courier New",
          fontSize: "8px",
          color: "#64748b",
        }
      )
    );
    yOffset += 20;

    // Resources
    if (caravan.resources) {
      this.caravanInfoPanel.add(
        this.add.text(10, yOffset, "Resources:", {
          fontFamily: "Courier New",
          fontSize: "9px",
          color: "#f59e0b",
        })
      );
      yOffset += 15;

      Object.entries(caravan.resources).forEach(([resource, value]) => {
        const color =
          value < 30 ? "#ef4444" : value < 60 ? "#f59e0b" : "#10b981";
        this.caravanInfoPanel.add(
          this.add.text(15, yOffset, `${resource}: ${value}%`, {
            fontFamily: "Courier New",
            fontSize: "8px",
            color: color,
          })
        );
        yOffset += 12;
      });
    }
  }

  showCaravanTooltip(caravan, x, y) {
    // Simple tooltip showing basic info
    this.tooltip = this.add.container(x + 20, y - 20);

    const bg = this.add
      .rectangle(0, 0, 120, 40, 0x1e293b, 0.9)
      .setStrokeStyle(1, 0x334155);

    const text = this.add
      .text(
        0,
        0,
        `${caravan.id}\n${caravan.leader}\nStatus: ${caravan.status}`,
        {
          fontFamily: "Courier New",
          fontSize: "8px",
          color: "#e2e8f0",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.tooltip.add([bg, text]);
  }

  hideCaravanTooltip() {
    if (this.tooltip) {
      this.tooltip.destroy();
      this.tooltip = null;
    }
  }

  blinkCaravanMarkers() {
    this.caravanMarkers.forEach((marker) => {
      if (marker.caravanData.status === "emergency") {
        const alpha = marker.markerCircle.alpha === 1 ? 0.3 : 1;
        marker.markerCircle.setAlpha(alpha);
      }
    });
  }

  updateCaravanPositions() {
    // Refresh caravan data from registry
    this.loadCaravanData();
  }

  zoomMap(factor) {
    // Placeholder for zoom functionality
    console.log(`🔍 Zoom factor: ${factor}`);
  }

  centerMap() {
    // Placeholder for center map functionality
    console.log("📍 Centering map");
  }

  refreshCaravans() {
    console.log("🔄 Refreshing caravan data");
    this.loadCaravanData();
  }

  destroy() {
    if (this.blinkTimer) {
      this.blinkTimer.destroy();
    }
    super.destroy();
  }
}
