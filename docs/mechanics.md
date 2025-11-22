# Game Mechanics Documentation

## Core Mechanics

### Excavation Mechanics

#### Layer System
- Sites are composed of multiple layers
- Each layer represents a different time period
- Deeper layers contain older artifacts
- Layers must be excavated sequentially (top to bottom)

#### Tile Excavation
- Each site is divided into a grid of tiles
- Tiles are excavated individually
- Each tile can contain multiple artifacts
- Tiles may have structures that affect excavation

#### Excavation Time
- Time required depends on:
  - Excavation method (Surface Collection < Excavation < Trench)
  - Site difficulty
  - Number of layers
  - Number of workers assigned

### Artifact Discovery

#### Discovery Process
1. Excavate a tile to a specific layer
2. Chance-based discovery of artifacts
3. Artifacts appear as "Unidentified"
4. Must be identified to reveal full properties

#### Discovery Rates
- Surface Collection: 30-50% chance per tile
- Excavation: 60-80% chance per tile
- Trench: 80-95% chance per tile
- Deeper layers have higher chance of rare artifacts

### Artifact Identification

#### Identification Requirements
- **Basic Artifacts**: Require 1 archaeologist
- **Inscribed Artifacts**: Require 1 archaeologist + 1 linguist
- **Complex Artifacts**: Require 2+ archaeologists
- **Rare Artifacts**: Require specialized knowledge (multiple personnel)

#### Identification Time
- Simple artifacts: Instant
- Complex artifacts: 1-3 turns
- Very rare artifacts: 3-5 turns

#### Identification Benefits
- Reveals full artifact properties
- Increases artifact value (typically 2-5x)
- Unlocks bonuses and set information
- Enables museum display

### Resource Management

#### Personnel Costs
- **Workers**: $50 per worker per task
- **Archaeologists**: $200 per archaeologist per task
- **Linguists**: $500 per linguist per task

#### Personnel Capacity
- Workers: Unlimited (limited by funds)
- Archaeologists: Maximum 5
- Linguists: Maximum 2

#### Personnel Assignment
- Personnel can be assigned to multiple tasks
- Personnel are "busy" during task execution
- Can reassign personnel between tasks

### Task Execution

#### Task Phases
1. **Planning Phase**: Assign resources and select tiles
2. **Execution Phase**: Task runs for specified duration
3. **Completion Phase**: Results revealed (artifacts, tiles, information)

#### Task Types

**Surface Collection**
- Duration: 1 turn
- Workers: 1-3
- Archaeologists: 0-1
- Linguists: 0
- Cost: Low
- Results: Surface artifacts, site information

**Excavation**
- Duration: 2-4 turns
- Workers: 2-5
- Archaeologists: 1-2
- Linguists: 0-1
- Cost: Medium
- Results: Multiple layers, mixed artifacts

**Trench**
- Duration: 4-6 turns
- Workers: 3-6
- Archaeologists: 2-3
- Linguists: 1-2
- Cost: High
- Results: Deep layers, rare artifacts

### Site Management

#### Site Discovery
- Sites appear on map periodically
- Discovery cost: $100-500
- Discovery reveals basic site information
- Must discover before excavation

#### Site Properties
- **Size**: 3x3 to 9x9 tiles
- **Layers**: 3-8 layers deep
- **Difficulty**: Easy, Medium, Hard, Expert
- **Historical Period**: Determines artifact types

#### Site Personnel
- Personnel can be stationed at sites
- Stationed personnel reduce task costs
- Stationed personnel are always available for site tasks

### Artifact Value System

#### Base Value
- Common: $10-50
- Uncommon: $50-200
- Rare: $200-1000
- Epic: $1000-5000
- Legendary: $5000+

#### Value Modifiers
- **Identified**: +100-300% value
- **Complete Set**: +200% value
- **Bonuses**: +10-50% per bonus
- **Historical Significance**: +50-200%
- **Condition**: -50% to +50%

### Inventory System

#### Storage
- Limited inventory slots (e.g., 10-20)
- Artifacts take 1 slot each
- Can expand inventory with purchases

#### Artifact Management
- View artifact details
- Identify artifacts
- Sell artifacts
- Display in museum (if implemented)

### Temperature System

- Temperature affects excavation conditions
- Extreme temperatures slow excavation
- Optimal temperature: 20-30°C
- Temperature changes over time (day/night, seasons)

### Progression Mechanics

#### Experience/Reputation
- Gain reputation from discoveries
- Higher reputation unlocks:
  - Better sites
  - More personnel capacity
  - Better equipment
  - Museum opportunities

#### Research
- Research unlocks artifact knowledge
- Research improves identification speed
- Research reveals site locations
- Research costs money and time

### Random Events

#### Positive Events
- Artifact donation
- Funding increase
- Personnel offer
- Site discovery hint

#### Negative Events
- Equipment failure
- Weather delays
- Site complications
- Personnel illness

### Save System

- Save game state
- Save includes:
  - Player resources
  - Site states
  - Discovered artifacts
  - Task progress
  - Game time

