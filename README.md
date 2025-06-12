# 🛰️ Exodus 2045 - Climate Migration Coordination Simulator

**MODERN DEVELOPMENT VERSION**

A real-time crisis management simulation where you play as Sarah Martinez, a Level-3 Coordinator guiding climate refugee caravans across a devastated continent.

## 🚀 **Quick Start**

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)

### Setup & Run

```bash
# Clone or download the project
git clone <your-repo-url>
cd exodus-2045

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will automatically open at `http://localhost:3000`

## 🎮 **Controls**

- **Space** - Toggle pause/play
- **1, 2, 4** - Time speed (1x, 2x, 4x)
- **Mouse** - Click buttons and interact with panels

## 📁 **Project Structure**

```
exodus-2045/
├── package.json            ← Dependencies and scripts
├── vite.config.js          ← Vite configuration
├── index.html              ← Main HTML entry point
├── src/
│   ├── main.js             ← Game initialization & config
│   └── scenes/
│       ├── BootScene.js    ← Loading & initialization
│       ├── CoordinatorTerminal.js ← Main game interface
│       ├── GameUI.js       ← Notifications & overlays
│       └── MapView.js      ← GPS tracking (Phase 2)
├── assets/                 ← Game assets (future)
└── README.md
```

## ✅ **What Works Right Now**

- 🛰️ **Professional coordinator terminal interface**
- 📊 **Resource monitoring panel** with global resource tracking
- 📧 **Message system** with priority indicators (high/medium/low)
- 📍 **Caravan tracking display** with real-time status
- ⏱️ **Real-time game clock** with speed controls (pause, 1x, 2x, 4x)
- 🚨 **Notification system** with animated alerts
- 🎨 **Professional terminal styling** with color-coded interface
- ⌨️ **Keyboard shortcuts** for time control
- 📱 **Responsive design** that adapts to window size

## 🚧 **What's Coming (Phase 2)**

- 🗺️ **Interactive GPS map** with caravan positions
- 🚨 **Crisis event system** with decision trees
- 📻 **Radio communications** with audio feedback
- 🎯 **Resource allocation** with supply drop coordination
- 👥 **Multi-caravan management** (3-8 caravans simultaneously)
- 🌪️ **Weather system** with environmental hazards
- 💾 **Save/load system** with shift progression

## 🛠️ **Tech Stack**

- **Phaser 3** - Game engine for graphics and interaction
- **Vite** - Fast development server and build tool
- **ES6 Modules** - Modern JavaScript with proper imports/exports
- **Node.js/npm** - Package management and development tools

## 🎯 **Development Features**

- ✅ **Hot Module Reloading** - Changes appear instantly
- ✅ **Source Maps** - Easy debugging
- ✅ **Modern JavaScript** - ES6+ features supported
- ✅ **Proper Scene Management** - Phaser best practices
- ✅ **Event-Driven Architecture** - Clean communication between systems
- ✅ **Centralized State Management** - Global game state registry

## 🌐 **Browser Support**

Works on any modern browser:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 🎨 **Visual Design**

- **Professional emergency management interface**
- **Terminal-style UI** with green-on-black color scheme
- **Color-coded priority system** (Red/Yellow/Green)
- **Monospace fonts** for authentic technical feel
- **Animated loading sequences** and smooth transitions
- **Responsive panels** that adapt to screen size

## 📚 **Development Workflow**

### Development Commands

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build locally
```

### Adding New Features

1. **Scenes** - Add new scenes in `src/scenes/`
2. **Systems** - Add game systems in `src/systems/` (future)
3. **Data** - Add game data in `src/data/` (future)
4. **Assets** - Add images/audio in `assets/`

### Code Structure

- **Clean ES6 modules** with proper imports/exports
- **Scene-based architecture** following Phaser conventions
- **Event-driven communication** between game systems
- **Centralized state management** via Phaser registry

## 🚀 **Deployment**

### Build for Production

```bash
npm run build
```

Deploy the `dist/` folder to any static hosting:

- **Netlify** - Drag and drop `dist/` folder
- **Vercel** - Connect GitHub repo for auto-deployment
- **GitHub Pages** - Upload `dist/` contents
- **Any web server** - Static file hosting

## 🐛 **Troubleshooting**

### Common Issues

**Game doesn't load:**

- Check browser console (F12) for errors
- Ensure Node.js v16+ is installed
- Run `npm install` to install dependencies

**Development server won't start:**

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Port already in use:**

```bash
# Use different port
npm run dev -- --port 3001
```

## 🎮 **Game Features**

### Current Gameplay

- **Monitor global resources** (supply drops, drones, fuel depots, medical teams)
- **Track caravan status** (Alpha-7 with leader Maria Santos)
- **Manage communications** with priority-coded messages
- **Control game time** with realistic time progression
- **Professional coordinator experience** with authentic interface

### Phase 2 Goals

- **Multi-caravan coordination** with complex decision trees
- **Resource allocation puzzles** with supply/demand balancing
- **Crisis management scenarios** with time pressure
- **Relationship building** with caravan leaders
- **Strategic route planning** with hazard avoidance

---

**🛰️ "In 2045, you don't just play a game. You coordinate survival." 🛰️**

### Current Status: ✅ **Phase 1 Complete - Foundation Ready**

The coordinator terminal is fully operational and ready for Phase 2 feature development!
