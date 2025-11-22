/**
 * Site Model
 * Represents archaeological sites that can be excavated
 */

export enum SiteDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

export interface Site {
  id: string;
  name: string;
  size: number; // Grid size (e.g., 3 for 3x3, 5 for 5x5)
  mapLocation: { x: number; y: number };
  discovered: boolean;
  excavationStarted: boolean;
  difficulty: SiteDifficulty;
  layers: number; // Number of excavation layers
  workers: number;
  archaeologists: number;
  linguists: number;
  playerId: string;
  historicalPeriod: string; // e.g., "Ur III", "Old Babylonian"
  discoveredTiles: string[]; // Tile IDs that have been discovered
}

export class SiteModel {
  private site: Site;

  constructor(
    name: string,
    size: number,
    mapLocation: { x: number; y: number },
    difficulty: SiteDifficulty = SiteDifficulty.MEDIUM,
    layers: number = 5,
    historicalPeriod: string = 'Unknown',
    playerId: string = ''
  ) {
    this.site = {
      id: this.generateId(),
      name,
      size,
      mapLocation,
      discovered: false,
      excavationStarted: false,
      difficulty,
      layers,
      workers: 0,
      archaeologists: 0,
      linguists: 0,
      playerId,
      historicalPeriod,
      discoveredTiles: [],
    };
  }

  getSite(): Site {
    return { ...this.site };
  }

  discover(): void {
    this.site.discovered = true;
  }

  startExcavation(): void {
    if (this.site.discovered && !this.site.excavationStarted) {
      this.site.excavationStarted = true;
    }
  }

  assignWorkers(count: number): void {
    this.site.workers = count;
  }

  assignArchaeologists(count: number): void {
    this.site.archaeologists = count;
  }

  assignLinguists(count: number): void {
    this.site.linguists = count;
  }

  addDiscoveredTile(tileId: string): void {
    if (!this.site.discoveredTiles.includes(tileId)) {
      this.site.discoveredTiles.push(tileId);
    }
  }

  getTotalTiles(): number {
    return this.site.size * this.site.size;
  }

  getDiscoveryProgress(): number {
    return this.site.discoveredTiles.length / this.getTotalTiles();
  }

  private generateId(): string {
    return `site_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

