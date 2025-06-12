# 🛰️ Exodus 2045 - Climate Migration Coordination Simulator

A real-time crisis management simulation where you play as Sarah Martinez, a Level-3 Coordinator at the Exodus Coordination Center, guiding multiple climate refugee caravans across a devastated North American continent.

## 🎮 Game Overview

**You are not the refugee. You are their lifeline.**

Using satellite communications, GPS tracking, and resource allocation networks, you make life-or-death decisions for hundreds of displaced souls seeking safety in climate-resilient zones.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd exodus-2045
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run serve` - Serve production build with host access

### Project Structure

```
exodus-2045/
├── src/
│   ├── scenes/                 # Phaser game scenes
│   │   ├── CoordinatorTerminal.js
│   │   ├── MapView.js
│   │   └── GameUI.js
│   ├── systems/               # Game systems (Phase 2)
│   │   ├── CaravanManager.js
│   │   ├── MessageSystem.js
│   │   ├── ResourceManager.js
│   │   └── TimeController.js
│   ├── data/                  # Game data files
│   │   ├── caravans.json
│   │   ├── events.json
│   │   └── routes.json
│   ├── assets/                # Game assets
│   │   ├── audio/
│   │   ├── images/
│   │   └── fonts/
│   └── main.js               # Entry point
├── public/
│   └── index.html            # HTML template
└── package.json
```

## 🎯 Development Phases

### Phase 1: Foundation ✅ (Current)
- [x] Basic Phaser setup with coordinator terminal interface
- [x] Time control system (play/pause/speed)
- [x] Basic resource monitoring display
- [x] Simple message system with priority levels
- [ ] Single caravan tracking with GPS movement

### Phase 2: Communication (Upcoming)
- [ ] Multi-caravan management (3-5 caravans)
- [ ] Interactive message system with response options
- [ ] Audio feedback system for alerts and interactions
- [ ] Crisis event system with emergency protocols
- [ ] Resource allocation interface
- [ ] Basic shift handoff system with NPC coordinator

### Phase 3: Polish (Future)
- [ ] Enhanced map interface with weather overlays
- [ ] Character development and leader relationships
- [ ] Advanced crisis scenarios and branching outcomes
- [ ] Professional audio design and voice lines
- [ ] Complex NPC coordinator personality system
- [ ] Coordinator fatigue and stress mechanics
- [ ] Save/load system with shift progression

## 🎮 Controls

### Keyboard Shortcuts
- `Space` - Toggle pause/play
- `1` - 1x speed
- `2` - 2x speed
- `4` - 4x speed

### Mouse Controls
- Click buttons for actions
- Hover for button feedback
- Interactive message and caravan panels

## 🛰️ Game Features

### Core Mechanics
- **Real-time Crisis Management** - Handle multiple emergencies simultaneously
- **Multi-caravan Coordination** - Guide 3-8 refugee groups across hostile terrain
- **Resource Network Management** - Coordinate supply drops, medical aid, fuel deliveries
- **Professional Interface** - Authentic emergency management software experience
- **Time Management** - Variable speed control with strategic pausing
- **Communication Systems** - Process messages, radio transmissions, emergency alerts

### Unique Features
- **Human Coordinator System** - Manage your own fatigue and stress levels
- **Shift Handoff Mechanics** - Deal with consequences of NPC coordinator decisions
- **Relationship Building** - Develop trust with caravan leaders
- **Climate Fiction Setting** - Relevant near-future themes and scenarios

## 🎨 Visual Style

- **Professional Terminal Aesthetic** - Emergency management software interface
- **Color-coded Priority System** - Green/Yellow/Red for urgency levels
- **Monospace Typography** - Courier New for authentic terminal feel
- **Dark Color Scheme** - Easy on the eyes for long gaming sessions
- **Minimal, Functional Design** - Focus on information clarity and usability

## 📚 Technical Details

### Tech Stack
- **Phaser 3** - Game engine for animations, audio, and interactive elements
- **JavaScript/ES6+** - Core game logic and state management
- **Vite** - Fast development build tool
- **HTML5 Canvas** - Rendering and visual effects
- **Web Audio API** - Dynamic sound generation

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

This is currently a solo development project, but feedback and suggestions are welcome!

### Reporting Issues
- Check existing issues first
- Provide clear reproduction steps
- Include browser and OS information

### Feature Requests
- Align with the game design document
- Consider the three-phase development plan
- Focus on crisis management and coordination themes

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

### Inspiration
- **911 Operator** - Emergency dispatch simulation
- **This is the Police** - Management decisions affecting lives
- **Oregon Trail** - Journey survival mechanics
- **Papers, Please** - Professional role-playing

### Thematic References
- **The Road** - Post-apocalyptic atmosphere
- **Children of Men** - Climate refugee themes
- **Snowpiercer** - Survival dynamics
- Real emergency management systems

---

*"In 2045, you don't just play a game. You coordinate survival."*

🛰️ **Sarah Martinez, Exodus Coordinator** 🛰️