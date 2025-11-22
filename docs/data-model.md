# Data Model Documentation

This document describes the core data model for the Archeology game series.

## Entity Relationship Diagram

The game is built around five main entities with the following relationships:

```
Player (1) ────< (many) Task
Player (1) ────< (many) Site
Site (1) ────< (many) Tile
Tile (1) ────< (many) Artefact
Task (1) ────< (many) Site (dashed - operational)
Task (1) ────< (many) Tile (dashed - operational)
Task (1) ────< (many) Artefact (dashed - operational)
```

## Entity Definitions

### Player

The player entity represents the archaeologist managing the expedition.

**Attributes:**
- `money` (number): Available funds for operations

**Relationships:**
- One-to-many with `Task`: A player can have multiple active tasks
- One-to-many with `Site`: A player can manage multiple excavation sites

### Task

Tasks represent operations that coordinate excavation activities.

**Attributes:**
- `type` (enum): Type of task (Surface Collection, Excavation, Trench)
- `start` (date/time): Task start time
- `end` (date/time): Task end time
- `workers` (number): Number of workers assigned
- `archeologists` (number): Number of archaeologists assigned
- `linguists` (number): Number of linguists assigned

**Relationships:**
- Many-to-one with `Player`: Tasks belong to a player
- Many-to-many with `Site` (operational): Tasks can involve multiple sites
- Many-to-many with `Tile` (operational): Tasks can target specific tiles
- Many-to-many with `Artefact` (operational): Tasks can produce artifacts

### Site

Sites represent archaeological locations that can be excavated.

**Attributes:**
- `size` (number): Size of the site
- `mapLocation` (coordinates): Location on the map
- `discovered` (boolean): Whether the site has been discovered
- `excavationStarted` (boolean): Whether excavation has begun
- `workers` (number): Workers currently at the site
- `archeologists` (number): Archaeologists currently at the site
- `linguists` (number): Linguists currently at the site

**Relationships:**
- Many-to-one with `Player`: Sites belong to a player
- One-to-many with `Tile`: Sites contain multiple tiles
- Many-to-many with `Task` (operational): Sites can be involved in tasks

### Tile

Tiles represent individual excavation units within a site.

**Attributes:**
- `position` (coordinates): Position within the site (x, y)
- `layer` (number): Depth layer of the tile
- `structure` (string/enum): Type of structure or feature found

**Relationships:**
- Many-to-one with `Site`: Tiles belong to a site
- One-to-many with `Artefact`: Tiles can contain multiple artifacts
- Many-to-many with `Task` (operational): Tiles can be targeted by tasks

### Artefact

Artefacts represent discovered items from excavations.

**Attributes:**
- `name` (string): Name of the artifact (or "Unidentified" if not yet identified)
- `type` (enum): Type of artifact (e.g., Stamped Brick, Pottery, Jewelry)
- `rarity` (enum): Rarity level (Common, Uncommon, Rare, Epic, Legendary)
- `value` (number): Monetary value
- `identified` (boolean): Whether the artifact has been identified
- `provenience` (string): Site of origin
- `style` (string): Cultural style (e.g., Neo-Sumerian)
- `material` (string): Material composition (e.g., Clay, Gold)
- `age` (string): Historical period (e.g., Ur III)
- `inscription` (string): Inscription details if applicable
- `set` (string): Part of a set (e.g., "The Local Chief")
- `bonuses` (array): Special bonuses (e.g., "+2 Mentioning ruler", "+1 Mentioning place name")

**Relationships:**
- Many-to-one with `Tile`: Artefacts are found in tiles
- Many-to-many with `Task` (operational): Artefacts can be discovered through tasks

## Implementation Notes

- The dashed relationships (Task ↔ Site, Task ↔ Tile, Task ↔ Artefact) represent operational associations rather than ownership
- Tasks coordinate activities but don't own the entities they work with
- The model supports multiple excavation methods through the Task type attribute
- Artefact identification is a key gameplay mechanic, represented by the `identified` boolean

