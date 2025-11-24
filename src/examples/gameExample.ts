/**
 * Example usage of the game systems
 * Demonstrates how to set up and play the game
 */

import { PlayerModel } from '../models/Player';
import { TaskModel, TaskType } from '../models/Task';
import { SiteModel, SiteDifficulty } from '../models/Site';
import { TileModel } from '../models/Tile';
import { ExcavationSystem } from '../systems/ExcavationSystem';
import { IdentificationSystem } from '../systems/IdentificationSystem';
import { ResourceManager } from '../systems/ResourceManager';

export function runGameExample() {
  console.log('=== Archeology in Mesopotamia - Game Example ===\n');

  // Initialize player
  const playerModel = new PlayerModel(1000); // Start with $1000
  console.log('Player initialized with $1000\n');

  // Hire some personnel
  playerModel.hireWorkers(5);
  playerModel.hireArchaeologists(2);
  playerModel.hireLinguists(1);
  
  const player = playerModel.getPlayer();
  console.log(`Hired personnel:`);
  console.log(`- Workers: ${player.workers}`);
  console.log(`- Archaeologists: ${player.archaeologists}`);
  console.log(`- Linguists: ${player.linguists}`);
  console.log(`- Remaining money: $${player.money}\n`);

  // Discover a site
  const siteModel = new SiteModel(
    'Site 1',
    3, // 3x3 grid
    { x: 10, y: 15 },
    SiteDifficulty.MEDIUM,
    5, // 5 layers
    'Ur III'
  );
  siteModel.discover();
  siteModel.startExcavation();
  
  const site = siteModel.getSite();
  console.log(`Discovered site: ${site.name}`);
  console.log(`- Size: ${site.size}x${site.size}`);
  console.log(`- Difficulty: ${site.difficulty}`);
  console.log(`- Historical Period: ${site.historicalPeriod}\n`);

  // Create tiles for the site
  const tiles: any[] = [];
  for (let y = 0; y < site.size; y++) {
    for (let x = 0; x < site.size; x++) {
      const tileModel = new TileModel(site.id, { x, y }, 0);
      tiles.push(tileModel.getTile());
    }
  }
  console.log(`Created ${tiles.length} tiles for excavation\n`);

  // Create a task
  const taskModel = new TaskModel(
    TaskType.EXCAVATION,
    player.id,
    3, // workers
    1, // archaeologists
    0  // linguists
  );
  
  // Add site and tiles to task
  taskModel.addSite(site.id);
  tiles.slice(0, 3).forEach(tile => taskModel.addTile(tile.id));
  
  const task = taskModel.getTask();
  console.log(`Created task: ${task.type}`);
  console.log(`- Workers: ${task.workers}`);
  console.log(`- Archaeologists: ${task.archaeologists}`);
  console.log(`- Cost: $${task.cost}\n`);

  // Check if we can afford it
  const resourceManager = new ResourceManager(playerModel);
  const { canAfford, missingResources } = resourceManager.canAffordTask(
    task.type,
    site.difficulty,
    task.workers,
    task.archaeologists,
    task.linguists
  );

  if (!canAfford) {
    console.log('Cannot afford task. Missing:', missingResources);
    return;
  }

  // Allocate resources
  resourceManager.allocateResources(
    task.type,
    site.difficulty,
    task.workers,
    task.archaeologists,
    task.linguists
  );

  // Start the task
  taskModel.start();
  console.log('Task started!\n');

  // Execute excavation
  const excavationSystem = new ExcavationSystem();
  const targetTiles = tiles.slice(0, 3);
  const result = excavationSystem.executeExcavation(task, site, targetTiles);

  console.log('Excavation Results:');
  console.log(`- Tiles excavated: ${result.tiles.length}`);
  console.log(`- Artifacts found: ${result.artifacts.length}`);
  console.log(`- Structures found: ${result.structures.length}\n`);

  // Display found artifacts
  if (result.artifacts.length > 0) {
    console.log('Found Artifacts:');
    result.artifacts.forEach((artifact, index) => {
      console.log(`\n${index + 1}. ${artifact.name}`);
      console.log(`   - Type: ${artifact.type}`);
      console.log(`   - Rarity: ${artifact.rarity}`);
      console.log(`   - Value: $${artifact.value}`);
      console.log(`   - Identified: ${artifact.identified ? 'Yes' : 'No'}`);
    });
  }

  // Try to identify an artifact
  if (result.artifacts.length > 0) {
    const artifact = result.artifacts[0];
    if (!artifact.identified) {
      console.log(`\nAttempting to identify: ${artifact.name}...`);
      
      const identificationSystem = new IdentificationSystem();
      const identificationResult = identificationSystem.identifyArtifact(
        artifact,
        player.archaeologists,
        player.linguists
      );

      if (identificationResult.success && identificationResult.identifiedArtefact) {
        const identified = identificationResult.identifiedArtefact;
        console.log(`\nSuccessfully identified!`);
        console.log(`- Name: ${identified.name}`);
        console.log(`- Style: ${identified.style}`);
        console.log(`- Material: ${identified.material}`);
        console.log(`- Age: ${identified.age}`);
        console.log(`- New Value: $${identified.value}`);
        
        if (identified.bonuses.length > 0) {
          console.log(`- Bonuses:`);
          identified.bonuses.forEach(bonus => {
            console.log(`  +${bonus.value} ${bonus.type}`);
          });
        }
      } else {
        console.log(`Identification failed: ${identificationResult.information}`);
      }
    }
  }

  // Complete the task
  taskModel.complete();
  console.log('\nTask completed!');

  // Show final player state
  const finalPlayer = playerModel.getPlayer();
  console.log(`\nFinal State:`);
  console.log(`- Money: $${finalPlayer.money}`);
  console.log(`- Reputation: ${finalPlayer.reputation}`);
}

// Uncomment to run:
// runGameExample();



