/**
 * Tile Model
 * Represents individual excavation units within a site
 */

export enum StructureType {
  NONE = 'none',
  WALL = 'wall',
  FLOOR = 'floor',
  PIT = 'pit',
  BURIAL = 'burial',
  BUILDING = 'building',
  TEMPLE = 'temple',
  PALACE = 'palace',
}

export interface Tile {
  id: string;
  siteId: string;
  position: { x: number; y: number };
  layer: number; // 0 = surface, higher = deeper
  structure: StructureType;
  excavated: boolean;
  artifacts: string[]; // Artifact IDs found in this tile
  excavationDate: Date | null;
}

export class TileModel {
  private tile: Tile;

  constructor(
    siteId: string,
    position: { x: number; y: number },
    layer: number = 0,
    structure: StructureType = StructureType.NONE
  ) {
    this.tile = {
      id: this.generateId(),
      siteId,
      position,
      layer,
      structure,
      excavated: false,
      artifacts: [],
      excavationDate: null,
    };
  }

  getTile(): Tile {
    return { ...this.tile };
  }

  excavate(): void {
    if (!this.tile.excavated) {
      this.tile.excavated = true;
      this.tile.excavationDate = new Date();
    }
  }

  addArtifact(artifactId: string): void {
    if (!this.tile.artifacts.includes(artifactId)) {
      this.tile.artifacts.push(artifactId);
    }
  }

  removeArtifact(artifactId: string): void {
    this.tile.artifacts = this.tile.artifacts.filter(id => id !== artifactId);
  }

  setStructure(structure: StructureType): void {
    this.tile.structure = structure;
  }

  isExcavated(): boolean {
    return this.tile.excavated;
  }

  private generateId(): string {
    return `tile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

