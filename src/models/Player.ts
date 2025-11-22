/**
 * Player Model
 * Represents the archaeologist managing the expedition
 */

export interface Player {
  id: string;
  money: number;
  workers: number;
  archaeologists: number;
  linguists: number;
  reputation: number;
  discoveredSites: string[]; // Site IDs
  activeTasks: string[]; // Task IDs
}

export class PlayerModel {
  private player: Player;

  constructor(initialMoney: number = 1000) {
    this.player = {
      id: this.generateId(),
      money: initialMoney,
      workers: 0,
      archaeologists: 0,
      linguists: 0,
      reputation: 0,
      discoveredSites: [],
      activeTasks: [],
    };
  }

  getPlayer(): Player {
    return { ...this.player };
  }

  addMoney(amount: number): void {
    this.player.money += amount;
  }

  spendMoney(amount: number): boolean {
    if (this.player.money >= amount) {
      this.player.money -= amount;
      return true;
    }
    return false;
  }

  hireWorkers(count: number, costPerWorker: number = 50): boolean {
    const totalCost = count * costPerWorker;
    if (this.spendMoney(totalCost)) {
      this.player.workers += count;
      return true;
    }
    return false;
  }

  hireArchaeologists(count: number, costPerArchaeologist: number = 200): boolean {
    const totalCost = count * costPerArchaeologist;
    if (this.spendMoney(totalCost)) {
      this.player.archaeologists += count;
      return true;
    }
    return false;
  }

  hireLinguists(count: number, costPerLinguist: number = 500): boolean {
    const totalCost = count * costPerLinguist;
    if (this.spendMoney(totalCost)) {
      this.player.linguists += count;
      return true;
    }
    return false;
  }

  addReputation(amount: number): void {
    this.player.reputation += amount;
  }

  discoverSite(siteId: string): void {
    if (!this.player.discoveredSites.includes(siteId)) {
      this.player.discoveredSites.push(siteId);
    }
  }

  addTask(taskId: string): void {
    if (!this.player.activeTasks.includes(taskId)) {
      this.player.activeTasks.push(taskId);
    }
  }

  removeTask(taskId: string): void {
    this.player.activeTasks = this.player.activeTasks.filter(id => id !== taskId);
  }

  private generateId(): string {
    return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

