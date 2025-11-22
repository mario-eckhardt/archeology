/**
 * Artefact Model
 * Represents discovered items from excavations
 */

export enum ArtefactType {
  STAMPED_BRICK = 'stamped_brick',
  CUNEIFORM_TABLET = 'cuneiform_tablet',
  CYLINDER_SEAL = 'cylinder_seal',
  POTTERY = 'pottery',
  JEWELRY = 'jewelry',
  STATUE = 'statue',
  TOOL = 'tool',
  WEAPON = 'weapon',
  UNIDENTIFIED = 'unidentified',
}

export enum Rarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export interface ArtefactBonus {
  type: string; // e.g., "Mentioning ruler", "Mentioning place name"
  value: number; // Bonus multiplier or fixed value
}

export interface Artefact {
  id: string;
  name: string;
  type: ArtefactType;
  rarity: Rarity;
  value: number;
  identified: boolean;
  tileId: string;
  provenience: string; // Site name
  style: string; // e.g., "Neo-Sumerian", "Akkadian"
  material: string; // e.g., "Clay", "Gold", "Stone"
  age: string; // e.g., "Ur III", "Old Babylonian"
  inscription: string | null;
  set: string | null; // Part of a set (e.g., "The Local Chief")
  bonuses: ArtefactBonus[];
  discoveryDate: Date;
  identificationDate: Date | null;
}

export class ArtefactModel {
  private artefact: Artefact;

  constructor(
    tileId: string,
    provenience: string,
    type: ArtefactType = ArtefactType.UNIDENTIFIED,
    rarity: Rarity = Rarity.COMMON
  ) {
    this.artefact = {
      id: this.generateId(),
      name: type === ArtefactType.UNIDENTIFIED ? 'Artifact (Unidentified)' : this.getDefaultName(type),
      type,
      rarity,
      value: this.calculateBaseValue(rarity),
      identified: type !== ArtefactType.UNIDENTIFIED,
      tileId,
      provenience,
      style: 'Unknown',
      material: 'Unknown',
      age: 'Unknown',
      inscription: null,
      set: null,
      bonuses: [],
      discoveryDate: new Date(),
      identificationDate: null,
    };
  }

  getArtefact(): Artefact {
    return { ...this.artefact };
  }

  identify(
    name: string,
    style: string,
    material: string,
    age: string,
    inscription: string | null = null
  ): void {
    if (!this.artefact.identified) {
      this.artefact.identified = true;
      this.artefact.name = name;
      this.artefact.style = style;
      this.artefact.material = material;
      this.artefact.age = age;
      this.artefact.inscription = inscription;
      this.artefact.identificationDate = new Date();
      
      // Increase value after identification (typically 2-5x)
      this.artefact.value = Math.floor(this.artefact.value * (2 + Math.random() * 3));
    }
  }

  addBonus(bonus: ArtefactBonus): void {
    this.artefact.bonuses.push(bonus);
    // Apply bonus to value
    this.artefact.value = Math.floor(this.artefact.value * (1 + bonus.value * 0.1));
  }

  setSet(setName: string): void {
    this.artefact.set = setName;
  }

  updateValue(newValue: number): void {
    this.artefact.value = newValue;
  }

  private calculateBaseValue(rarity: Rarity): number {
    switch (rarity) {
      case Rarity.COMMON:
        return 10 + Math.floor(Math.random() * 40); // $10-50
      case Rarity.UNCOMMON:
        return 50 + Math.floor(Math.random() * 150); // $50-200
      case Rarity.RARE:
        return 200 + Math.floor(Math.random() * 800); // $200-1000
      case Rarity.EPIC:
        return 1000 + Math.floor(Math.random() * 4000); // $1000-5000
      case Rarity.LEGENDARY:
        return 5000 + Math.floor(Math.random() * 10000); // $5000+
      default:
        return 10;
    }
  }

  private getDefaultName(type: ArtefactType): string {
    const names: Record<ArtefactType, string> = {
      [ArtefactType.STAMPED_BRICK]: 'Stamped Brick',
      [ArtefactType.CUNEIFORM_TABLET]: 'Cuneiform Tablet',
      [ArtefactType.CYLINDER_SEAL]: 'Cylinder Seal',
      [ArtefactType.POTTERY]: 'Pottery',
      [ArtefactType.JEWELRY]: 'Jewelry',
      [ArtefactType.STATUE]: 'Statue',
      [ArtefactType.TOOL]: 'Tool',
      [ArtefactType.WEAPON]: 'Weapon',
      [ArtefactType.UNIDENTIFIED]: 'Artifact (Unidentified)',
    };
    return names[type] || 'Artifact';
  }

  private generateId(): string {
    return `artefact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

