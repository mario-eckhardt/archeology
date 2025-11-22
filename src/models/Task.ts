/**
 * Task Model
 * Represents excavation operations that coordinate activities
 */

export enum TaskType {
  SURFACE_COLLECTION = 'surface_collection',
  EXCAVATION = 'excavation',
  TRENCH = 'trench',
}

export enum TaskStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Task {
  id: string;
  type: TaskType;
  status: TaskStatus;
  startTime: Date | null;
  endTime: Date | null;
  estimatedDuration: number; // in turns
  workers: number;
  archaeologists: number;
  linguists: number;
  siteIds: string[]; // Sites involved in this task
  tileIds: string[]; // Tiles targeted by this task
  cost: number;
  playerId: string;
}

export class TaskModel {
  private task: Task;

  constructor(
    type: TaskType,
    playerId: string,
    workers: number = 0,
    archaeologists: number = 0,
    linguists: number = 0
  ) {
    this.task = {
      id: this.generateId(),
      type,
      status: TaskStatus.PLANNING,
      startTime: null,
      endTime: null,
      estimatedDuration: this.getEstimatedDuration(type),
      workers,
      archaeologists,
      linguists,
      siteIds: [],
      tileIds: [],
      cost: this.calculateCost(type, workers, archaeologists, linguists),
      playerId,
    };
  }

  getTask(): Task {
    return { ...this.task };
  }

  start(): void {
    if (this.task.status === TaskStatus.PLANNING) {
      this.task.status = TaskStatus.IN_PROGRESS;
      this.task.startTime = new Date();
      const endDate = new Date();
      endDate.setTime(endDate.getTime() + this.task.estimatedDuration * 60000); // Assuming 1 turn = 1 minute
      this.task.endTime = endDate;
    }
  }

  complete(): void {
    if (this.task.status === TaskStatus.IN_PROGRESS) {
      this.task.status = TaskStatus.COMPLETED;
      this.task.endTime = new Date();
    }
  }

  cancel(): void {
    this.task.status = TaskStatus.CANCELLED;
  }

  addSite(siteId: string): void {
    if (!this.task.siteIds.includes(siteId)) {
      this.task.siteIds.push(siteId);
    }
  }

  addTile(tileId: string): void {
    if (!this.task.tileIds.includes(tileId)) {
      this.task.tileIds.push(tileId);
    }
  }

  isCompleted(): boolean {
    if (this.task.status !== TaskStatus.IN_PROGRESS || !this.task.endTime) {
      return false;
    }
    return new Date() >= this.task.endTime;
  }

  private getEstimatedDuration(type: TaskType): number {
    switch (type) {
      case TaskType.SURFACE_COLLECTION:
        return 1;
      case TaskType.EXCAVATION:
        return 3;
      case TaskType.TRENCH:
        return 5;
      default:
        return 1;
    }
  }

  private calculateCost(
    type: TaskType,
    workers: number,
    archaeologists: number,
    linguists: number
  ): number {
    const baseCost = type === TaskType.SURFACE_COLLECTION ? 50 :
                     type === TaskType.EXCAVATION ? 200 : 500;
    
    const workerCost = workers * 50;
    const archaeologistCost = archaeologists * 200;
    const linguistCost = linguists * 500;

    return baseCost + workerCost + archaeologistCost + linguistCost;
  }

  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

