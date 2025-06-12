/**
 * Layout Utilities for Phaser UI Development
 * Makes Phaser positioning feel more like CSS
 */

export class LayoutUtils {
  static createPanel(scene, x, y, width, height, options = {}) {
    const {
      backgroundColor = 0x1e293b,
      borderColor = 0x334155,
      borderWidth = 1,
      padding = 10,
      title = null,
      titleColor = "#f59e0b",
    } = options;

    const panel = scene.add.container(x, y);

    // Background
    const bg = scene.add
      .rectangle(0, 0, width, height, backgroundColor)
      .setOrigin(0, 0)
      .setStrokeStyle(borderWidth, borderColor);

    panel.add(bg);

    // Title if provided
    if (title) {
      const titleText = scene.add.text(padding, padding, title, {
        fontFamily: "Courier New",
        fontSize: "12px",
        color: titleColor,
        fontWeight: "bold",
      });
      panel.add(titleText);
    }

    // Helper methods
    panel.addContent = (
      element,
      contentX = padding,
      contentY = title ? padding + 25 : padding
    ) => {
      element.setPosition(contentX, contentY);
      panel.add(element);
      return element;
    };

    panel.createRow = (y, height = 30) => {
      return new LayoutRow(
        scene,
        panel,
        padding,
        y,
        width - padding * 2,
        height
      );
    };

    return panel;
  }

  static createButton(scene, text, options = {}) {
    const {
      width = 120,
      height = 30,
      backgroundColor = 0x475569,
      hoverColor = 0x64748b,
      activeColor = 0x10b981,
      textColor = "#e2e8f0",
      fontSize = "12px",
      onClick = () => {},
    } = options;

    const button = scene.add.container(0, 0);

    const bg = scene.add
      .rectangle(0, 0, width, height, backgroundColor)
      .setInteractive();

    const buttonText = scene.add
      .text(0, 0, text, {
        fontFamily: "Courier New",
        fontSize,
        color: textColor,
      })
      .setOrigin(0.5, 0.5);

    button.add([bg, buttonText]);
    button.setSize(width, height);

    // Store references for state changes
    button.bg = bg;
    button.text = buttonText;
    button.isActive = false;

    // Interactions
    bg.on("pointerover", () => {
      if (!button.isActive) bg.setFillStyle(hoverColor);
    });

    bg.on("pointerout", () => {
      if (!button.isActive) bg.setFillStyle(backgroundColor);
    });

    bg.on("pointerdown", onClick);

    // Helper methods
    button.setActive = (active) => {
      button.isActive = active;
      bg.setFillStyle(active ? activeColor : backgroundColor);
      buttonText.setColor(active ? "#0f172a" : textColor);
    };

    button.setText = (newText) => {
      buttonText.setText(newText);
    };

    return button;
  }

  static createGrid(
    scene,
    container,
    x,
    y,
    columns,
    cellWidth,
    cellHeight,
    gap = 10
  ) {
    const grid = {
      x,
      y,
      columns,
      cellWidth,
      cellHeight,
      gap,
      items: [],
    };

    grid.addItem = (element, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const itemX = x + col * (cellWidth + gap);
      const itemY = y + row * (cellHeight + gap);

      element.setPosition(itemX, itemY);
      container.add(element);
      grid.items.push(element);

      return element;
    };

    return grid;
  }

  // Navigation/Tab system
  static createTabSystem(scene, x, y, tabs, options = {}) {
    const {
      tabWidth = 200,
      tabHeight = 40,
      gap = 10,
      activeColor = 0x10b981,
      inactiveColor = 0x475569,
      onTabChange = () => {},
    } = options;

    const tabContainer = scene.add.container(x, y);
    const tabButtons = [];
    let activeTab = 0;

    tabs.forEach((tab, index) => {
      const tabX = index * (tabWidth + gap);
      const button = LayoutUtils.createButton(scene, tab.label, {
        width: tabWidth,
        height: tabHeight,
        onClick: () => {
          if (activeTab !== index) {
            // Deactivate old tab
            tabButtons[activeTab].setActive(false);
            // Activate new tab
            activeTab = index;
            tabButtons[index].setActive(true);
            onTabChange(tab, index);
          }
        },
      });

      button.setPosition(tabX, 0);
      tabContainer.add(button);
      tabButtons.push(button);
    });

    // Set initial active tab
    tabButtons[0].setActive(true);

    return {
      container: tabContainer,
      buttons: tabButtons,
      setActiveTab: (index) => {
        tabButtons[activeTab].setActive(false);
        activeTab = index;
        tabButtons[index].setActive(true);
      },
    };
  }

  // Responsive helpers
  static getResponsiveSize(scene, percentage) {
    return {
      width: scene.scale.width * (percentage / 100),
      height: scene.scale.height * (percentage / 100),
    };
  }

  static centerOn(scene, element) {
    element.setPosition(scene.scale.width / 2, scene.scale.height / 2);
    return element;
  }

  // Layout constants for consistent spacing
  static SPACING = {
    TINY: 4,
    SMALL: 8,
    MEDIUM: 16,
    LARGE: 24,
    XLARGE: 32,
  };

  static COLORS = {
    BACKGROUND: 0x0f172a,
    PANEL: 0x1e293b,
    BORDER: 0x334155,
    PRIMARY: 0x10b981,
    SECONDARY: 0x475569,
    WARNING: 0xf59e0b,
    ERROR: 0xef4444,
    TEXT_PRIMARY: "#e2e8f0",
    TEXT_SECONDARY: "#94a3b8",
    TEXT_SUCCESS: "#10b981",
  };
}

class LayoutRow {
  constructor(scene, parent, x, y, width, height) {
    this.scene = scene;
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.items = [];
    this.currentX = 0;
  }

  addItem(element, itemWidth, margin = 5) {
    element.setPosition(this.x + this.currentX, this.y);
    this.parent.add(element);
    this.items.push(element);
    this.currentX += itemWidth + margin;
    return element;
  }

  addSpacer(width) {
    this.currentX += width;
    return this;
  }

  addFlexSpacer() {
    // Calculate remaining space and distribute
    const usedWidth = this.currentX;
    const remaining = this.width - usedWidth;
    this.currentX += remaining;
    return this;
  }
}
