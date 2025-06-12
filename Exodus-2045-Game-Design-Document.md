# 🎮 Game Design Document (GDD) – _Exodus 2045_

## Climate Migration Coordination Simulator

---

## **1. Core Concept**

**You are not the refugee. You are their lifeline.**

Play as Sarah Martinez, a Level-3 Coordinator at the Exodus Coordination Center, guiding multiple climate refugee caravans across a devastated North American continent. Using satellite communications, GPS tracking, and resource allocation networks, you make life-or-death decisions for hundreds of displaced souls seeking safety in climate-resilient zones.

**Genre:** Real-time Strategy / Crisis Management Simulation  
**Platform:** Web Browser (HTML5)  
**Target Audience:** Adults interested in strategic decision-making, crisis management, and narrative-driven gameplay

---

## **2. Core Gameplay Loop**

### **Primary Activities:**

- **Monitor Multiple Caravans** - Track 3-8 caravans simultaneously via GPS
- **Process Communications** - Receive messages, radio transmissions, and emergency alerts
- **Make Coordination Decisions** - Direct routes, allocate resources, manage crises
- **Resource Network Management** - Coordinate supply drops, medical aid, and fuel deliveries
- **Crisis Response** - Handle emergencies, weather events, and equipment failures
- **Shift Handoff Management** - Prepare detailed briefings and return to assess NPC coordinator performance
- **Relationship Repair** - Rebuild trust with caravan leaders after problematic handoffs

### **Time Management System:**

- **Variable Speed Control** - 1x, 2x, 4x speed with pause functionality
- **Time Scale** - 1 real second = 1 game minute (adjustable)
- **Strategic Pausing** - Stop time for critical decision moments
- **Shift Rotation** - 8-hour coordinator shifts with handoff procedures

---

## **3. Game Mechanics**

### **Communication System**

- **Message Priority Levels** - High (red), Medium (yellow), Low (green)
- **Communication Types:**
  - Radio transmissions with audio cues
  - Email-style status reports
  - Emergency alert broadcasts
  - Weather service warnings
  - Supply depot notifications

### **Multi-Caravan Management**

- **Caravan Tracking** - Real-time GPS positions on interactive map
- **Resource Monitoring** - Food, Water, Fuel, Medicine, Morale for each group
- **Status Updates** - Moving, Resting, Emergency, Shelter, Offline
- **Leader Relationships** - Build trust and rapport with caravan leaders
- **Group Dynamics** - Different caravan personalities and specialties

### **Decision Making**

- **Route Guidance** - Direct caravans through optimal or emergency routes
- **Resource Allocation** - Distribute limited supplies between groups
- **Crisis Response** - Emergency protocols for medical, mechanical, and weather crises
- **Risk Assessment** - Balance speed vs. safety in routing decisions
- **Shift Preparation** - Strategic handoff briefings to minimize NPC coordinator errors
- **Damage Control** - Recovering from mistakes made during off-shift periods

### **Resource Network**

- **Supply Drops** - Coordinate drone deliveries and ground supply stations
- **Medical Aid** - Deploy medical teams and distribute medicine
- **Fuel Stations** - Manage charging stations and fuel depots
- **Safe Shelters** - Temporary shelter coordination during extreme weather

---

## **4. Shift System & Coordinator Management**

### **Coordinator Human Needs**

- **Fatigue System** - Performance degrades after 10+ hours on shift
- **Stress Levels** - Crisis events and difficult decisions increase stress
- **Mandatory Rest** - Must take 12-hour off-shift breaks (not optional)
- **Personal Stakes** - Coordinator's reputation and career affected by outcomes

### **NPC Coordinator Handoffs**

- **Competency Variance** - Different NPC coordinators have different skill levels and personalities
- **Error Probability** - Chance of mistakes during off-shift (5-25% depending on situation complexity)
- **Personality Conflicts** - Some caravan leaders may prefer/distrust different coordinators
- **Information Filtering** - NPC coordinators may downplay problems, exaggerate successes, or omit critical details

### **Handoff Report System**

- **Pre-Shift Briefing** - Player prepares status reports and priority instructions
- **Post-Shift Debrief** - NPC coordinator provides (potentially inaccurate) shift summary
- **Reality Discovery** - Player discovers actual situation through direct communication with caravans
- **Trust Assessment** - Determine reliability of NPC coordinator reports over time

### **Strategic Implications**

- **Preparation Planning** - Set caravans up for success during anticipated off-shift periods
- **Risk Mitigation** - Position caravans safely before mandatory breaks
- **Relationship Management** - Build strong bonds with caravan leaders who can work with any coordinator
- **Crisis Timing** - Major emergencies during off-shift create complex problem-solving scenarios

---

## **5. Visual & Audio Design**

### **Visual Style**

- **Professional Terminal Aesthetic** - Emergency management software interface
- **Color-Coded Priority System** - Green/Yellow/Red for urgency levels
- **Interactive Map Interface** - Satellite view with weather overlays and route visualization
- **Animated UI Elements** - Smooth transitions, blinking alerts, status indicators
- **Character Portraits** - Caravan leaders and key personnel for personal connection

### **Audio Design**

- **Radio Communication** - Static, beeps, voice transmissions
- **Alert System** - Different tones for message priorities and emergencies
- **Ambient Atmosphere** - Terminal hum, distant weather sounds
- **Voice Acting** - Optional voice lines for key messages and emergencies
- **Dynamic Audio Cues** - Audio feedback for all user interactions

---

## **5. Technology Stack**

### **Primary Framework**

- **Phaser 3** - Game engine for animations, audio, and interactive elements
- **JavaScript/TypeScript** - Core game logic and state management
- **HTML5 Canvas** - Rendering and visual effects

### **Development Tools**

- **Visual Studio Code** - Primary development environment
- **Git** - Version control
- **Phaser Editor** - Optional visual scene editing

### **Asset Pipeline**

- **Audio:** Web Audio API for dynamic sound generation
- **Graphics:** SVG icons, CSS animations, Phaser graphics API
- **Data:** JSON for caravan data, events, and game configuration

---

## **6. Game World & Setting**

### **Timeframe:** 2045-2050

Climate change has made large portions of North America uninhabitable. Mass migration is underway as people flee from:

- **Extreme heat zones** (former Southwest)
- **Flooded coastal cities** (former East/West coasts)
- **Drought-devastated farmland** (former Midwest)
- **Wildfire-ravaged forests** (former Pacific Northwest)

### **Safe Zones (Destinations):**

- **New Seattle Climate Zone** - Engineered city with climate domes
- **Great Lakes Collective** - Freshwater-secure communities
- **Canadian Border Sanctuaries** - International refugee settlements
- **Mountain Fortress Cities** - High-altitude climate-controlled habitats

### **Technology Level:**

- **Satellite Communications** - GPS and internet still functional
- **AI-Assisted Systems** - Automated weather prediction and route optimization
- **Electric/Solar Vehicles** - Caravans use renewable energy systems
- **Drone Networks** - Supply delivery and reconnaissance capabilities

---

## **7. Inspiration & References**

### **Primary Inspirations:**

- **911 Operator** - Emergency dispatch simulation and crisis management
- **This is the Police** - Management decisions affecting multiple people's lives
- **Oregon Trail** - Journey survival mechanics and resource management
- **Papers, Please** - Professional role-playing and moral decision-making

### **Thematic References:**

- **The Road** - Post-apocalyptic survival atmosphere
- **Children of Men** - Climate refugee crisis themes
- **Snowpiercer** - Class dynamics in survival situations
- **Emergency management software** - Real-world crisis coordination interfaces

---

## **8. Core Features for MVP**

### **Phase 1: Foundation (Weeks 1-3)**

- Basic Phaser setup with coordinator terminal interface
- Single caravan tracking with GPS movement
- Simple message system with priority levels
- Time control system (play/pause/speed)
- Basic resource monitoring display

### **Phase 2: Communication (Weeks 4-6)**

- Multi-caravan management (3-5 caravans)
- Interactive message system with response options
- Audio feedback system for alerts and interactions
- Crisis event system with emergency protocols
- Resource allocation interface
- Basic shift handoff system with NPC coordinator

### **Phase 3: Polish (Weeks 7-9)**

- Enhanced map interface with weather overlays
- Character development and leader relationships
- Advanced crisis scenarios and branching outcomes
- Professional audio design and voice lines
- Complex NPC coordinator personality system
- Coordinator fatigue and stress mechanics
- Save/load system with shift progression

---

## **9. Success Metrics**

### **Player Engagement:**

- **Average Session Length** - Target: 30-45 minutes per shift
- **Return Rate** - Target: 70% of players return for multiple shifts
- **Decision Depth** - Players report feeling genuine responsibility for caravan outcomes

### **Immersion Indicators:**

- **Role-Playing Engagement** - Players identify as coordinator rather than game player
- **Emotional Investment** - Players express concern for specific caravan leaders
- **Professional Feel** - Interface feels authentic to emergency management work

### **Strategic Depth:**

- **Meaningful Choices** - Decisions have clear consequences and tradeoffs
- **Multi-Caravan Complexity** - Players successfully juggle multiple groups
- **Crisis Management** - Emergency scenarios create tension and require skill

---

## **11. Unique Selling Points**

1. **Novel Perspective** - Play as coordinator, not survivor
2. **Professional Immersion** - Authentic emergency management experience
3. **Human Coordinator System** - Manage your own needs while managing others
4. **Imperfect Handoff Mechanics** - Deal with consequences of NPC coordinator decisions
5. **Climate Fiction Setting** - Relevant near-future themes
6. **Real-Time Strategy Elements** - Balance multiple priorities simultaneously
7. **Emotional Investment** - Personal relationships with caravan leaders
8. **Crisis Management Simulation** - Realistic emergency response scenarios
9. **Shift Dynamics** - Unique gameplay around mandatory rest periods and workplace relationships

---

## **11. Development Roadmap**

### **Q1 2024: Core Development**

- Phaser foundation and coordinator interface
- Multi-caravan tracking system
- Communication and decision systems
- Time management and game loop

### **Q2 2024: Content & Polish**

- Event variety and narrative depth
- Audio implementation and voice acting
- Visual effects and professional polish
- Beta testing and feedback iteration

### **Q3 2024: Launch Preparation**

- Final balancing and optimization
- Launch marketing and community building
- Post-launch content planning

---

_This design document reflects our evolved vision of Exodus 2045 as a unique crisis management simulation that combines strategic gameplay with meaningful human stories in a climate-changed world._
