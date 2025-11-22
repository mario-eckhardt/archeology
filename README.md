# Archeology in Mesopotamia

A simulation game about archaeology set in 19th century Mesopotamia. This is the first installment in the "Archeology in..." series, which will explore different historical periods and locations.

## Game Overview

**Archeology in Mesopotamia** is a simulation game that combines resource management, strategic excavation planning, and artifact discovery. Players take on the role of an archaeologist in the 19th century, managing excavation sites, workers, and resources while uncovering ancient artifacts from Mesopotamian civilizations.

### Core Features

- **Site Management**: Discover and excavate archaeological sites across Mesopotamia
- **Resource Management**: Manage money, workers, archaeologists, and linguists
- **Excavation Mechanics**: Use different excavation methods (Surface Collection, Excavation, Trench)
- **Artifact Discovery**: Uncover and identify artifacts with varying rarity and value
- **Task System**: Plan and execute archaeological tasks with resource allocation
- **Progressive Discovery**: Uncover layers of history through systematic excavation

### Game Series Vision

This game is designed as the first in a series, with potential future installments including:
- Archeology in Egypt
- Archeology in Greece
- Archeology in Rome
- Archeology in the Incas
- Archeology in the Stone Age
- Modern Archaeology

Each installment will share similar core mechanics but feature unique scenarios, artifacts, and historical contexts.

## Project Structure

```
archeology/
├── README.md
├── docs/                    # Documentation
│   ├── game-design.md      # Game design document
│   ├── data-model.md       # Entity relationship documentation
│   └── mechanics.md        # Game mechanics documentation
├── src/                     # Source code
│   ├── models/             # Data models (Player, Site, Task, Tile, Artefact)
│   ├── systems/            # Game systems (excavation, identification, etc.)
│   ├── ui/                 # User interface components
│   └── utils/              # Utility functions
├── data/                    # Game data
│   ├── artifacts/          # Artifact definitions
│   ├── sites/              # Site definitions
│   └── scenarios/          # Scenario data
└── assets/                  # Game assets (images, sounds, etc.)
```

## Data Model

The game is built around five core entities:

- **Player**: Manages money and resources
- **Site**: Archaeological sites with size, location, and personnel
- **Tile**: Individual excavation units within a site (position, layer, structure)
- **Artefact**: Discovered items with properties (name, type, rarity, value, identification status)
- **Task**: Operations that coordinate excavation activities across sites, tiles, and artifacts

See `docs/data-model.md` for detailed entity relationships.

## Development Status

🚧 **Early Development** - Project structure and core systems are being established.

### Current Implementation

✅ **Completed:**
- Core data models (Player, Task, Site, Tile, Artefact)
- Excavation system with artifact discovery
- Artifact identification system
- Resource management system
- Game data (Mesopotamian artifacts and sites)
- Example game implementation

✅ **Completed:**
- HTML frontend with full game interface
- Interactive game loop and state management
- Browser-based playable version

🚧 **In Progress:**
- Save/load system
- Enhanced 3D visualization

📋 **Planned:**
- Visual rendering (3D isometric view)
- Sound effects and music
- Story elements and historical context
- Museum/exhibition system

## Technology Stack

**Current:** TypeScript/Node.js (core game logic)

**Planned:** 
- Game engine: To be determined (Unity, Godot, or Web-based)
- Rendering: 3D isometric view of excavation sites
- UI Framework: To be determined based on target platform

## Getting Started

### Quick Start (HTML Frontend)

The easiest way to play the game is using the HTML frontend:

1. Open `index.html` in a web browser
2. Start playing immediately - no installation required!

The HTML frontend includes:
- Full game interface matching the design
- Interactive excavation system
- Artifact discovery and identification
- Resource management
- No build step required

### Development Setup

For TypeScript development:

#### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

#### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the example game
npm run example
```

### Project Structure

```
archeology/
├── README.md
├── package.json
├── tsconfig.json
├── docs/                    # Documentation
│   ├── game-design.md      # Game design document
│   ├── data-model.md       # Entity relationship documentation
│   └── mechanics.md        # Game mechanics documentation
├── src/                     # Source code
│   ├── models/             # Data models
│   │   ├── Player.ts       # Player entity
│   │   ├── Task.ts         # Task entity
│   │   ├── Site.ts         # Site entity
│   │   ├── Tile.ts         # Tile entity
│   │   └── Artefact.ts     # Artefact entity
│   ├── systems/            # Game systems
│   │   ├── ExcavationSystem.ts      # Excavation mechanics
│   │   ├── IdentificationSystem.ts  # Artifact identification
│   │   └── ResourceManager.ts       # Resource management
│   └── examples/           # Example implementations
│       └── gameExample.ts  # Complete game example
├── data/                    # Game data
│   ├── artifacts/          # Artifact definitions
│   │   └── mesopotamia.json
│   └── sites/              # Site definitions
│       └── mesopotamia.json
└── assets/                  # Game assets (to be added)
```

## Usage Example

See `src/examples/gameExample.ts` for a complete example of:
- Creating a player and hiring personnel
- Discovering and excavating sites
- Finding and identifying artifacts
- Managing resources

## Contributing

This is an early-stage project. Contributions and suggestions are welcome!

## License

MIT
