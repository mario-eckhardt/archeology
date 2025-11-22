/**
 * Identification System
 * Handles artifact identification and analysis
 */

import { Artefact, ArtefactModel, ArtefactType } from '../models/Artefact';
import { ArtefactBonus } from '../models/Artefact';

export interface IdentificationRequirements {
  archaeologists: number;
  linguists: number;
  time: number; // in turns
}

export interface IdentificationResult {
  success: boolean;
  identifiedArtefact: Artefact | null;
  bonuses: ArtefactBonus[];
  information: string;
}

export class IdentificationSystem {
  /**
   * Check if an artifact can be identified with available resources
   */
  canIdentify(
    artifact: Artefact,
    availableArchaeologists: number,
    availableLinguists: number
  ): { canIdentify: boolean; requirements: IdentificationRequirements } {
    const requirements = this.getIdentificationRequirements(artifact);

    const canIdentify =
      availableArchaeologists >= requirements.archaeologists &&
      availableLinguists >= requirements.linguists;

    return { canIdentify, requirements };
  }

  /**
   * Identify an artifact
   */
  identifyArtifact(
    artifact: Artefact,
    archaeologists: number,
    linguists: number
  ): IdentificationResult {
    const { canIdentify, requirements } = this.canIdentify(
      artifact,
      archaeologists,
      linguists
    );

    if (!canIdentify) {
      return {
        success: false,
        identifiedArtefact: null,
        bonuses: [],
        information: 'Insufficient personnel for identification',
      };
    }

    if (artifact.identified) {
      return {
        success: false,
        identifiedArtefact: artifact,
        bonuses: artifact.bonuses,
        information: 'Artifact already identified',
      };
    }

    // Create identified version
    const artifactModel = new ArtefactModel(
      artifact.tileId,
      artifact.provenience,
      artifact.type,
      artifact.rarity
    );

    // Identify based on artifact type
    const identificationData = this.getIdentificationData(artifact.type);
    
    artifactModel.identify(
      identificationData.name,
      identificationData.style,
      identificationData.material,
      identificationData.age,
      identificationData.inscription
    );

    // Add bonuses if inscription is present
    const bonuses: ArtefactBonus[] = [];
    if (identificationData.inscription) {
      if (identificationData.inscription.includes('ruler') || 
          identificationData.inscription.includes('king')) {
        bonuses.push({ type: 'Mentioning ruler', value: 2 });
      }
      if (identificationData.inscription.includes('place') ||
          identificationData.inscription.includes('city')) {
        bonuses.push({ type: 'Mentioning place name', value: 1 });
      }
    }

    // Apply bonuses
    bonuses.forEach(bonus => artifactModel.addBonus(bonus));

    // Check for set membership
    const set = this.checkSetMembership(artifact.type, identificationData);
    if (set) {
      artifactModel.setSet(set);
    }

    const identifiedArtefact = artifactModel.getArtefact();

    return {
      success: true,
      identifiedArtefact,
      bonuses,
      information: `Successfully identified as ${identificationData.name}`,
    };
  }

  /**
   * Get identification requirements for an artifact
   */
  private getIdentificationRequirements(
    artifact: Artefact
  ): IdentificationRequirements {
    // Basic artifacts require 1 archaeologist
    const basicTypes = [
      ArtefactType.POTTERY,
      ArtefactType.TOOL,
      ArtefactType.WEAPON,
    ];

    if (basicTypes.includes(artifact.type)) {
      return {
        archaeologists: 1,
        linguists: 0,
        time: 1,
      };
    }

    // Inscribed artifacts require archaeologist + linguist
    const inscribedTypes = [
      ArtefactType.CUNEIFORM_TABLET,
      ArtefactType.STAMPED_BRICK,
      ArtefactType.CYLINDER_SEAL,
    ];

    if (inscribedTypes.includes(artifact.type)) {
      return {
        archaeologists: 1,
        linguists: 1,
        time: 2,
      };
    }

    // Complex artifacts require multiple archaeologists
    const complexTypes = [
      ArtefactType.STATUE,
      ArtefactType.JEWELRY,
    ];

    if (complexTypes.includes(artifact.type)) {
      return {
        archaeologists: 2,
        linguists: 0,
        time: 3,
      };
    }

    // Unidentified artifacts - default requirements
    return {
      archaeologists: 1,
      linguists: 0,
      time: 1,
    };
  }

  /**
   * Get identification data for artifact types
   */
  private getIdentificationData(type: ArtefactType): {
    name: string;
    style: string;
    material: string;
    age: string;
    inscription: string | null;
  } {
    const data: Record<ArtefactType, {
      name: string;
      style: string;
      material: string;
      age: string;
      inscription: string | null;
    }> = {
      [ArtefactType.STAMPED_BRICK]: {
        name: 'Stamped Brick',
        style: 'Neo-Sumerian',
        material: 'Clay',
        age: 'Ur III',
        inscription: 'Royal Building Inscription',
      },
      [ArtefactType.CUNEIFORM_TABLET]: {
        name: 'Cuneiform Tablet',
        style: 'Akkadian',
        material: 'Clay',
        age: 'Old Babylonian',
        inscription: 'Administrative Record',
      },
      [ArtefactType.CYLINDER_SEAL]: {
        name: 'Cylinder Seal',
        style: 'Neo-Sumerian',
        material: 'Stone',
        age: 'Ur III',
        inscription: 'Owner Inscription',
      },
      [ArtefactType.POTTERY]: {
        name: 'Pottery Vessel',
        style: 'Mesopotamian',
        material: 'Clay',
        age: 'Various',
        inscription: null,
      },
      [ArtefactType.JEWELRY]: {
        name: 'Gold Jewelry',
        style: 'Mesopotamian',
        material: 'Gold',
        age: 'Various',
        inscription: null,
      },
      [ArtefactType.STATUE]: {
        name: 'Stone Statue',
        style: 'Mesopotamian',
        material: 'Stone',
        age: 'Various',
        inscription: null,
      },
      [ArtefactType.TOOL]: {
        name: 'Bronze Tool',
        style: 'Mesopotamian',
        material: 'Bronze',
        age: 'Various',
        inscription: null,
      },
      [ArtefactType.WEAPON]: {
        name: 'Bronze Weapon',
        style: 'Mesopotamian',
        material: 'Bronze',
        age: 'Various',
        inscription: null,
      },
      [ArtefactType.UNIDENTIFIED]: {
        name: 'Artifact (Unidentified)',
        style: 'Unknown',
        material: 'Unknown',
        age: 'Unknown',
        inscription: null,
      },
    };

    return data[type] || data[ArtefactType.UNIDENTIFIED];
  }

  /**
   * Check if artifact is part of a set
   */
  private checkSetMembership(
    type: ArtefactType,
    identificationData: { name: string; style: string; age: string }
  ): string | null {
    // Example: Gold artifacts from certain periods might be part of "The Local Chief" set
    if (type === ArtefactType.JEWELRY && identificationData.age === 'Ur III') {
      return 'The Local Chief';
    }

    // Add more set logic here
    return null;
  }
}

