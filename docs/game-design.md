# Game Design Document

## Archeology in Mesopotamia

### Game Concept

**Archeology in Mesopotamia** is a simulation game where players manage archaeological expeditions in 19th century Mesopotamia. Players must balance resources, plan excavations, and discover artifacts while managing a team of workers, archaeologists, and linguists.

### Core Gameplay Loop

1. **Discovery**: Find new archaeological sites on the map
2. **Planning**: Allocate resources (workers, archaeologists, linguists) to tasks
3. **Excavation**: Execute excavation tasks using different methods
4. **Discovery**: Uncover tiles and artifacts layer by layer
5. **Identification**: Use linguists and archaeologists to identify artifacts
6. **Value**: Sell or display artifacts to earn money
7. **Expansion**: Use earnings to expand operations and discover more sites

### Excavation Methods

#### Surface Collection
- **Cost**: Low
- **Speed**: Fast
- **Depth**: Surface layer only
- **Artifact Quality**: Lower value, common artifacts
- **Use Case**: Initial site survey, quick exploration

#### Excavation
- **Cost**: Medium
- **Speed**: Medium
- **Depth**: Multiple layers
- **Artifact Quality**: Mixed quality
- **Use Case**: Standard excavation operations

#### Trench
- **Cost**: High
- **Speed**: Slow
- **Depth**: Deep layers
- **Artifact Quality**: Higher value, rare artifacts
- **Use Case**: Deep exploration, finding valuable artifacts

### Resource Management

#### Money
- Earned by selling artifacts
- Spent on hiring personnel, equipment, and site operations
- Starting amount: $1000

#### Workers
- Basic labor for excavation tasks
- Required for all excavation types
- Cost: Low
- Capacity: Limited by available funds

#### Archaeologists
- Specialized personnel for artifact identification
- Required for deeper excavations
- Can identify artifacts
- Cost: Medium
- Capacity: Limited (e.g., 1-5)

#### Linguists
- Specialized personnel for reading inscriptions
- Required for identifying inscribed artifacts
- Can unlock artifact bonuses
- Cost: High
- Capacity: Very limited (e.g., 0-2)

### Artifact System

#### Identification
- Artifacts start as "Unidentified"
- Require archaeologists and/or linguists to identify
- Identified artifacts have higher value and reveal bonuses

#### Artifact Properties
- **Provenience**: Site of origin
- **Style**: Cultural period (e.g., Neo-Sumerian, Akkadian)
- **Material**: Composition (Clay, Gold, Stone, etc.)
- **Age**: Historical period (Ur III, Old Babylonian, etc.)
- **Inscription**: Text content (if applicable)
- **Set**: Part of a collection
- **Bonuses**: Special attributes that increase value

#### Artifact Types (Mesopotamia)
- Stamped Bricks
- Cuneiform Tablets
- Cylinder Seals
- Pottery
- Jewelry
- Statues
- Tools
- Weapons

### Site System

#### Site Discovery
- Sites appear on the map
- Must be discovered before excavation
- Discovery may require initial investment

#### Site Properties
- **Size**: Determines number of tiles
- **Location**: Map coordinates
- **Layers**: Number of excavation layers
- **Difficulty**: Affects excavation costs and time

#### Tile System
- Sites are divided into tiles (e.g., 3x3 grid)
- Each tile has multiple layers
- Tiles can contain structures or features
- Artifacts are found within specific tiles and layers

### Task System

Tasks coordinate excavation activities:
- **Planning**: Assign personnel and resources
- **Execution**: Takes time based on method and site difficulty
- **Completion**: Reveals tiles, artifacts, or site information
- **Multiple Tasks**: Can run simultaneously at different sites

### UI Elements

#### Top Bar
- Money display
- Worker count
- Archaeologist count
- Linguist count
- Temperature indicator
- Map button
- Messages/notifications
- Museum button

#### Main View
- Site visualization (3D isometric tile stack)
- Excavation method buttons
- Inventory slots
- Artifact cards
- Task management

#### Artifact Cards
- Display artifact information
- Show identification status
- List properties and bonuses
- Show value

### Progression

#### Early Game
- Limited resources
- Basic excavations
- Common artifacts
- Single site focus

#### Mid Game
- Multiple sites
- Specialized personnel
- Rare artifacts
- Set collections

#### Late Game
- Large-scale operations
- Legendary artifacts
- Complete collections
- Museum exhibitions

### Story Elements

While primarily a simulation, the game includes:
- Historical context about 19th century archaeology
- Information about Mesopotamian civilizations
- Artifact descriptions with historical significance
- Progression through different periods (Ur III, Old Babylonian, Neo-Babylonian, etc.)

### Future Series Installments

Each installment will feature:
- Unique historical period and location
- Period-specific artifacts and styles
- Different excavation challenges
- Historical context and story elements
- Shared core mechanics for familiarity

