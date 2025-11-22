/**
 * Resource Manager
 * Handles resource allocation and management
 */

import { Player, PlayerModel } from '../models/Player';
import { Task, TaskType } from '../models/Task';
import { Site } from '../models/Site';

export interface ResourceAllocation {
  workers: number;
  archaeologists: number;
  linguists: number;
  cost: number;
}

export class ResourceManager {
  private player: PlayerModel;

  constructor(player: PlayerModel) {
    this.player = player;
  }

  /**
   * Calculate resource requirements for a task
   */
  calculateTaskResources(
    taskType: TaskType,
    siteDifficulty: string
  ): ResourceAllocation {
    const baseAllocation = this.getBaseAllocation(taskType);
    const difficultyMultiplier = this.getDifficultyMultiplier(siteDifficulty);

    return {
      workers: Math.ceil(baseAllocation.workers * difficultyMultiplier),
      archaeologists: Math.ceil(baseAllocation.archaeologists * difficultyMultiplier),
      linguists: Math.ceil(baseAllocation.linguists * difficultyMultiplier),
      cost: this.calculateCost(
        baseAllocation,
        difficultyMultiplier
      ),
    };
  }

  /**
   * Check if player has sufficient resources for a task
   */
  canAffordTask(
    taskType: TaskType,
    siteDifficulty: string,
    workers: number,
    archaeologists: number,
    linguists: number
  ): { canAfford: boolean; missingResources: string[] } {
    const player = this.player.getPlayer();
    const required = this.calculateTaskResources(taskType, siteDifficulty);
    const missing: string[] = [];

    if (player.money < required.cost) {
      missing.push(`Money (need ${required.cost}, have ${player.money})`);
    }

    if (player.workers < workers) {
      missing.push(`Workers (need ${workers}, have ${player.workers})`);
    }

    if (player.archaeologists < archaeologists) {
      missing.push(
        `Archaeologists (need ${archaeologists}, have ${player.archaeologists})`
      );
    }

    if (player.linguists < linguists) {
      missing.push(`Linguists (need ${linguists}, have ${player.linguists})`);
    }

    return {
      canAfford: missing.length === 0,
      missingResources: missing,
    };
  }

  /**
   * Allocate resources to a task
   */
  allocateResources(
    taskType: TaskType,
    siteDifficulty: string,
    workers: number,
    archaeologists: number,
    linguists: number
  ): boolean {
    const { canAfford, missingResources } = this.canAffordTask(
      taskType,
      siteDifficulty,
      workers,
      archaeologists,
      linguists
    );

    if (!canAfford) {
      console.warn('Cannot afford task. Missing:', missingResources);
      return false;
    }

    const required = this.calculateTaskResources(taskType, siteDifficulty);
    
    // Spend money
    if (!this.player.spendMoney(required.cost)) {
      return false;
    }

    // Note: In a real implementation, you might want to track
    // which workers/archaeologists/linguists are assigned to which tasks
    // For now, we just check availability

    return true;
  }

  /**
   * Get base resource allocation for task type
   */
  private getBaseAllocation(taskType: TaskType): ResourceAllocation {
    switch (taskType) {
      case TaskType.SURFACE_COLLECTION:
        return {
          workers: 1,
          archaeologists: 0,
          linguists: 0,
          cost: 50,
        };
      case TaskType.EXCAVATION:
        return {
          workers: 3,
          archaeologists: 1,
          linguists: 0,
          cost: 250,
        };
      case TaskType.TRENCH:
        return {
          workers: 5,
          archaeologists: 2,
          linguists: 1,
          cost: 2000,
        };
      default:
        return {
          workers: 1,
          archaeologists: 0,
          linguists: 0,
          cost: 50,
        };
    }
  }

  /**
   * Get difficulty multiplier
   */
  private getDifficultyMultiplier(difficulty: string): number {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 0.8;
      case 'medium':
        return 1.0;
      case 'hard':
        return 1.5;
      case 'expert':
        return 2.0;
      default:
        return 1.0;
    }
  }

  /**
   * Calculate total cost
   */
  private calculateCost(
    baseAllocation: ResourceAllocation,
    multiplier: number
  ): number {
    const workerCost = baseAllocation.workers * 50 * multiplier;
    const archaeologistCost = baseAllocation.archaeologists * 200 * multiplier;
    const linguistCost = baseAllocation.linguists * 500 * multiplier;
    const baseCost = baseAllocation.cost * multiplier;

    return Math.ceil(baseCost + workerCost + archaeologistCost + linguistCost);
  }

  /**
   * Sell artifact and add money to player
   */
  sellArtifact(artifactValue: number): void {
    this.player.addMoney(artifactValue);
  }

  /**
   * Get current player state
   */
  getPlayerState(): Player {
    return this.player.getPlayer();
  }
}

