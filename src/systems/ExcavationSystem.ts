/**
 * Excavation System
 * Handles excavation operations and artifact discovery
 */

import { Task, TaskType, TaskModel } from '../models/Task';
import { Tile, TileModel, StructureType } from '../models/Tile';
import { Artefact, ArtefactModel, ArtefactType, Rarity } from '../models/Artefact';
import { Site, SiteModel } from '../models/Site';

export interface ExcavationResult {
  tiles: Tile[];
  artifacts: Artefact[];
  structures: StructureType[];
  information: string[];
}

export class ExcavationSystem {
  /**
   * Execute an excavation task and return results
   */
  executeExcavation(
    task: Task,
    site: Site,
    tiles: Tile[]
  ): ExcavationResult {
    const result: ExcavationResult = {
      tiles: [],
      artifacts: [],
      structures: [],
      information: [],
    };

    // Determine discovery chance based on task type
    const discoveryChance = this.getDiscoveryChance(task.type);
    
    // Process each tile in the task
    for (const tile of tiles) {
      if (!tile.excavated) {
        // Excavate the tile
        const tileModel = new TileModel(
          tile.siteId,
          tile.position,
          tile.layer,
          tile.structure
        );
        tileModel.excavate();
        result.tiles.push(tileModel.getTile());

        // Check for structure discovery
        const structure = this.discoverStructure(task.type, site.difficulty);
        if (structure !== StructureType.NONE) {
          tileModel.setStructure(structure);
          result.structures.push(structure);
        }

        // Check for artifact discovery
        if (Math.random() < discoveryChance) {
          const artifact = this.discoverArtifact(
            tile.id,
            site.name,
            task.type,
            site.historicalPeriod
          );
          result.artifacts.push(artifact);
          tileModel.addArtifact(artifact.id);
        }
      }
    }

    return result;
  }

  /**
   * Get discovery chance based on task type
   */
  private getDiscoveryChance(taskType: TaskType): number {
    switch (taskType) {
      case TaskType.SURFACE_COLLECTION:
        return 0.3 + Math.random() * 0.2; // 30-50%
      case TaskType.EXCAVATION:
        return 0.6 + Math.random() * 0.2; // 60-80%
      case TaskType.TRENCH:
        return 0.8 + Math.random() * 0.15; // 80-95%
      default:
        return 0.5;
    }
  }

  /**
   * Discover an artifact based on excavation method and site context
   */
  private discoverArtifact(
    tileId: string,
    provenience: string,
    taskType: TaskType,
    historicalPeriod: string
  ): Artefact {
    // Determine artifact type and rarity based on task type
    const { type, rarity } = this.determineArtifactType(taskType, historicalPeriod);
    
    const artifactModel = new ArtefactModel(tileId, provenience, type, rarity);
    
    // If it's a trench excavation, higher chance of rare artifacts
    if (taskType === TaskType.TRENCH && Math.random() < 0.3) {
      const bonusRarity = this.upgradeRarity(rarity);
      artifactModel.updateValue(this.calculateValueForRarity(bonusRarity));
    }

    return artifactModel.getArtefact();
  }

  /**
   * Determine artifact type based on excavation method and period
   */
  private determineArtifactType(
    taskType: TaskType,
    historicalPeriod: string
  ): { type: ArtefactType; rarity: Rarity } {
    // Base probabilities for artifact types in Mesopotamia
    const artifactTypes: ArtefactType[] = [
      ArtefactType.POTTERY,
      ArtefactType.STAMPED_BRICK,
      ArtefactType.CUNEIFORM_TABLET,
      ArtefactType.CYLINDER_SEAL,
      ArtefactType.TOOL,
      ArtefactType.JEWELRY,
      ArtefactType.STATUE,
      ArtefactType.WEAPON,
    ];

    // Surface collection: mostly common pottery and tools
    if (taskType === TaskType.SURFACE_COLLECTION) {
      const commonTypes = [ArtefactType.POTTERY, ArtefactType.TOOL, ArtefactType.STAMPED_BRICK];
      return {
        type: commonTypes[Math.floor(Math.random() * commonTypes.length)],
        rarity: Rarity.COMMON,
      };
    }

    // Excavation: mixed types and rarities
    if (taskType === TaskType.EXCAVATION) {
      const type = artifactTypes[Math.floor(Math.random() * artifactTypes.length)];
      const rarity = this.randomRarity([Rarity.COMMON, Rarity.UNCOMMON, Rarity.RARE]);
      return { type, rarity };
    }

    // Trench: higher chance of rare and valuable artifacts
    if (taskType === TaskType.TRENCH) {
      const valuableTypes = [
        ArtefactType.CUNEIFORM_TABLET,
        ArtefactType.CYLINDER_SEAL,
        ArtefactType.JEWELRY,
        ArtefactType.STATUE,
      ];
      const type = valuableTypes[Math.floor(Math.random() * valuableTypes.length)];
      const rarity = this.randomRarity([Rarity.UNCOMMON, Rarity.RARE, Rarity.EPIC]);
      return { type, rarity };
    }

    // Default fallback
    return { type: ArtefactType.UNIDENTIFIED, rarity: Rarity.COMMON };
  }

  /**
   * Discover structures based on excavation method
   */
  private discoverStructure(
    taskType: TaskType,
    difficulty: string
  ): StructureType {
    // Deeper excavations have higher chance of finding structures
    if (taskType === TaskType.TRENCH && Math.random() < 0.4) {
      const structures = [
        StructureType.WALL,
        StructureType.FLOOR,
        StructureType.BUILDING,
        StructureType.TEMPLE,
        StructureType.PALACE,
      ];
      return structures[Math.floor(Math.random() * structures.length)];
    }

    if (taskType === TaskType.EXCAVATION && Math.random() < 0.2) {
      return Math.random() < 0.5 ? StructureType.WALL : StructureType.FLOOR;
    }

    return StructureType.NONE;
  }

  /**
   * Get random rarity from a list
   */
  private randomRarity(rarities: Rarity[]): Rarity {
    return rarities[Math.floor(Math.random() * rarities.length)];
  }

  /**
   * Upgrade rarity (for special discoveries)
   */
  private upgradeRarity(rarity: Rarity): Rarity {
    const rarityOrder = [
      Rarity.COMMON,
      Rarity.UNCOMMON,
      Rarity.RARE,
      Rarity.EPIC,
      Rarity.LEGENDARY,
    ];
    const currentIndex = rarityOrder.indexOf(rarity);
    if (currentIndex < rarityOrder.length - 1) {
      return rarityOrder[currentIndex + 1];
    }
    return rarity;
  }

  /**
   * Calculate value for a given rarity
   */
  private calculateValueForRarity(rarity: Rarity): number {
    switch (rarity) {
      case Rarity.COMMON:
        return 10 + Math.floor(Math.random() * 40);
      case Rarity.UNCOMMON:
        return 50 + Math.floor(Math.random() * 150);
      case Rarity.RARE:
        return 200 + Math.floor(Math.random() * 800);
      case Rarity.EPIC:
        return 1000 + Math.floor(Math.random() * 4000);
      case Rarity.LEGENDARY:
        return 5000 + Math.floor(Math.random() * 10000);
      default:
        return 10;
    }
  }
}

