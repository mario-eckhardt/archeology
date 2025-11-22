// Game Controller - Connects UI to game logic
// Browser-compatible implementation

// Game State
class GameState {
    constructor() {
        this.player = {
            id: 'player_1',
            money: 1000,
            workers: 0,
            archaeologists: 0,
            linguists: 0,
            reputation: 0
        };
        this.sites = [];
        this.currentSite = null;
        this.tiles = new Map();
        this.artifacts = [];
        this.inventory = [];
        this.activeTask = null;
        this.selectedExcavationMethod = null;
        this.selectedTiles = [];
    }
}

// Simplified Game Models (browser-compatible)
class PlayerModel {
    constructor(initialMoney = 1000) {
        this.player = {
            id: 'player_' + Date.now(),
            money: initialMoney,
            workers: 0,
            archaeologists: 0,
            linguists: 0,
            reputation: 0
        };
    }

    getPlayer() {
        return { ...this.player };
    }

    addMoney(amount) {
        this.player.money += amount;
    }

    spendMoney(amount) {
        if (this.player.money >= amount) {
            this.player.money -= amount;
            return true;
        }
        return false;
    }

    hireWorkers(count, costPerWorker = 50) {
        const totalCost = count * costPerWorker;
        if (this.spendMoney(totalCost)) {
            this.player.workers += count;
            return true;
        }
        return false;
    }

    hireArchaeologists(count, costPerArchaeologist = 200) {
        const totalCost = count * costPerArchaeologist;
        if (this.spendMoney(totalCost)) {
            this.player.archaeologists += count;
            return true;
        }
        return false;
    }

    hireLinguists(count, costPerLinguist = 500) {
        const totalCost = count * costPerLinguist;
        if (this.spendMoney(totalCost)) {
            this.player.linguists += count;
            return true;
        }
        return false;
    }
}

class SiteModel {
    constructor(name, size, mapLocation, difficulty = 'medium', layers = 5, historicalPeriod = 'Unknown') {
        this.site = {
            id: 'site_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
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
            historicalPeriod,
            discoveredTiles: []
        };
    }

    getSite() {
        return { ...this.site };
    }

    discover() {
        this.site.discovered = true;
    }

    startExcavation() {
        if (this.site.discovered && !this.site.excavationStarted) {
            this.site.excavationStarted = true;
        }
    }
}

class TileModel {
    constructor(siteId, position, layer = 0, structure = 'none', maxLayers = 2) {
        this.tile = {
            id: 'tile_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            siteId,
            position,
            layer,
            maxLayers,
            structure,
            excavated: false,
            artifacts: [],
            excavationDate: null
        };
    }

    getTile() {
        return { ...this.tile };
    }

    excavate() {
        if (!this.tile.excavated) {
            this.tile.excavated = true;
            this.tile.excavationDate = new Date();
        }
    }

    addArtifact(artifactId) {
        if (!this.tile.artifacts.includes(artifactId)) {
            this.tile.artifacts.push(artifactId);
        }
    }
}

class TaskModel {
    constructor(type, playerId, workers = 0, archaeologists = 0, linguists = 0) {
        this.task = {
            id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            type,
            status: 'planning',
            startTime: null,
            endTime: null,
            estimatedDuration: this.getEstimatedDuration(type),
            workers,
            archaeologists,
            linguists,
            siteIds: [],
            tileIds: [],
            cost: this.calculateCost(type, workers, archaeologists, linguists),
            playerId
        };
    }

    getTask() {
        return { ...this.task };
    }

    start() {
        if (this.task.status === 'planning') {
            this.task.status = 'in_progress';
            this.task.startTime = new Date();
            const endDate = new Date();
            endDate.setTime(endDate.getTime() + this.task.estimatedDuration * 1000); // Convert to milliseconds
            this.task.endTime = endDate;
        }
    }

    complete() {
        if (this.task.status === 'in_progress') {
            this.task.status = 'completed';
            this.task.endTime = new Date();
        }
    }

    addSite(siteId) {
        if (!this.task.siteIds.includes(siteId)) {
            this.task.siteIds.push(siteId);
        }
    }

    addTile(tileId) {
        if (!this.task.tileIds.includes(tileId)) {
            this.task.tileIds.push(tileId);
        }
    }

    isCompleted() {
        if (this.task.status !== 'in_progress' || !this.task.endTime) {
            return false;
        }
        return new Date() >= this.task.endTime;
    }

    getEstimatedDuration(type) {
        switch (type) {
            case 'surface_collection': return 2; // seconds for demo
            case 'excavation': return 5;
            case 'trench': return 8;
            default: return 2;
        }
    }

    calculateCost(type, workers, archaeologists, linguists) {
        const baseCost = type === 'surface_collection' ? 50 :
                         type === 'excavation' ? 200 : 500;
        const workerCost = workers * 50;
        const archaeologistCost = archaeologists * 200;
        const linguistCost = linguists * 500;
        return baseCost + workerCost + archaeologistCost + linguistCost;
    }
}

class ArtefactModel {
    constructor(tileId, provenience, type = 'unidentified', rarity = 'common') {
        this.artefact = {
            id: 'artefact_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: type === 'unidentified' ? 'Artifact (Unidentified)' : this.getDefaultName(type),
            type,
            rarity,
            value: this.calculateBaseValue(rarity),
            identified: type !== 'unidentified',
            tileId,
            provenience,
            style: 'Unknown',
            material: 'Unknown',
            age: 'Unknown',
            inscription: null,
            set: null,
            bonuses: [],
            discoveryDate: new Date(),
            identificationDate: null
        };
    }

    getArtefact() {
        return { ...this.artefact };
    }

    identify(name, style, material, age, inscription = null) {
        if (!this.artefact.identified) {
            this.artefact.identified = true;
            this.artefact.name = name;
            this.artefact.style = style;
            this.artefact.material = material;
            this.artefact.age = age;
            this.artefact.inscription = inscription;
            this.artefact.identificationDate = new Date();
            this.artefact.value = Math.floor(this.artefact.value * (2 + Math.random() * 3));
        }
    }

    calculateBaseValue(rarity) {
        switch (rarity) {
            case 'common': return 10 + Math.floor(Math.random() * 40);
            case 'uncommon': return 50 + Math.floor(Math.random() * 150);
            case 'rare': return 200 + Math.floor(Math.random() * 800);
            case 'epic': return 1000 + Math.floor(Math.random() * 4000);
            case 'legendary': return 5000 + Math.floor(Math.random() * 10000);
            default: return 10;
        }
    }

    getDefaultName(type) {
        const names = {
            'stamped_brick': 'Stamped Brick',
            'cuneiform_tablet': 'Cuneiform Tablet',
            'cylinder_seal': 'Cylinder Seal',
            'pottery': 'Pottery',
            'jewelry': 'Jewelry',
            'statue': 'Statue',
            'tool': 'Tool',
            'weapon': 'Weapon',
            'unidentified': 'Artifact (Unidentified)'
        };
        return names[type] || 'Artifact';
    }
}

// Excavation System
class ExcavationSystem {
    executeExcavation(task, site, tiles) {
        const result = {
            tiles: [],
            artifacts: [],
            structures: [],
            information: []
        };

        const discoveryChance = this.getDiscoveryChance(task.type);

        for (const tile of tiles) {
            if (!tile.excavated) {
                const tileModel = new TileModel(tile.siteId, tile.position, tile.layer, tile.structure, tile.maxLayers);
                tileModel.excavate();
                result.tiles.push(tileModel.getTile());

                if (Math.random() < discoveryChance) {
                    const artifact = this.discoverArtifact(tile.id, site.name, task.type, site.historicalPeriod);
                    result.artifacts.push(artifact);
                    tileModel.addArtifact(artifact.id);
                }
            }
        }

        return result;
    }

    getDiscoveryChance(taskType) {
        switch (taskType) {
            case 'surface_collection': return 0.3 + Math.random() * 0.2;
            case 'excavation': return 0.6 + Math.random() * 0.2;
            case 'trench': return 0.8 + Math.random() * 0.15;
            default: return 0.5;
        }
    }

    discoverArtifact(tileId, provenience, taskType, historicalPeriod) {
        const { type, rarity } = this.determineArtifactType(taskType, historicalPeriod);
        return new ArtefactModel(tileId, provenience, type, rarity).getArtefact();
    }

    determineArtifactType(taskType, historicalPeriod) {
        if (taskType === 'surface_collection') {
            const commonTypes = ['pottery', 'tool', 'stamped_brick'];
            return {
                type: commonTypes[Math.floor(Math.random() * commonTypes.length)],
                rarity: 'common'
            };
        }

        if (taskType === 'excavation') {
            const types = ['pottery', 'stamped_brick', 'cuneiform_tablet', 'cylinder_seal', 'tool', 'jewelry', 'statue', 'weapon'];
            const rarities = ['common', 'uncommon', 'rare'];
            return {
                type: types[Math.floor(Math.random() * types.length)],
                rarity: rarities[Math.floor(Math.random() * rarities.length)]
            };
        }

        if (taskType === 'trench') {
            const valuableTypes = ['cuneiform_tablet', 'cylinder_seal', 'jewelry', 'statue'];
            const rarities = ['uncommon', 'rare', 'epic'];
            return {
                type: valuableTypes[Math.floor(Math.random() * valuableTypes.length)],
                rarity: rarities[Math.floor(Math.random() * rarities.length)]
            };
        }

        return { type: 'unidentified', rarity: 'common' };
    }
}

// Identification System
class IdentificationSystem {
    identifyArtifact(artifact, archaeologists, linguists) {
        if (artifact.identified) {
            return { success: false, identifiedArtefact: artifact, information: 'Already identified' };
        }

        const requirements = this.getIdentificationRequirements(artifact);
        if (archaeologists < requirements.archaeologists || linguists < requirements.linguists) {
            return { success: false, identifiedArtefact: null, information: 'Insufficient personnel' };
        }

        const artifactModel = new ArtefactModel(artifact.tileId, artifact.provenience, artifact.type, artifact.rarity);
        const identificationData = this.getIdentificationData(artifact.type);

        artifactModel.identify(
            identificationData.name,
            identificationData.style,
            identificationData.material,
            identificationData.age,
            identificationData.inscription
        );

        const bonuses = [];
        if (identificationData.inscription) {
            if (identificationData.inscription.includes('ruler') || identificationData.inscription.includes('king')) {
                bonuses.push({ type: 'Mentioning ruler', value: 2 });
            }
            if (identificationData.inscription.includes('place') || identificationData.inscription.includes('city')) {
                bonuses.push({ type: 'Mentioning place name', value: 1 });
            }
        }

        bonuses.forEach(bonus => {
            artifactModel.artefact.bonuses.push(bonus);
            artifactModel.artefact.value = Math.floor(artifactModel.artefact.value * (1 + bonus.value * 0.1));
        });

        return {
            success: true,
            identifiedArtefact: artifactModel.getArtefact(),
            bonuses,
            information: `Successfully identified as ${identificationData.name}`
        };
    }

    getIdentificationRequirements(artifact) {
        const basicTypes = ['pottery', 'tool', 'weapon'];
        if (basicTypes.includes(artifact.type)) {
            return { archaeologists: 1, linguists: 0, time: 1 };
        }

        const inscribedTypes = ['cuneiform_tablet', 'stamped_brick', 'cylinder_seal'];
        if (inscribedTypes.includes(artifact.type)) {
            return { archaeologists: 1, linguists: 1, time: 2 };
        }

        const complexTypes = ['statue', 'jewelry'];
        if (complexTypes.includes(artifact.type)) {
            return { archaeologists: 2, linguists: 0, time: 3 };
        }

        return { archaeologists: 1, linguists: 0, time: 1 };
    }

    getIdentificationData(type) {
        const data = {
            'stamped_brick': {
                name: 'Stamped Brick',
                style: 'Neo-Sumerian',
                material: 'Clay',
                age: 'Ur III',
                inscription: 'Royal Building Inscription'
            },
            'cuneiform_tablet': {
                name: 'Cuneiform Tablet',
                style: 'Akkadian',
                material: 'Clay',
                age: 'Old Babylonian',
                inscription: 'Administrative Record'
            },
            'cylinder_seal': {
                name: 'Cylinder Seal',
                style: 'Neo-Sumerian',
                material: 'Stone',
                age: 'Ur III',
                inscription: 'Owner Inscription'
            },
            'pottery': {
                name: 'Pottery Vessel',
                style: 'Mesopotamian',
                material: 'Clay',
                age: 'Various',
                inscription: null
            },
            'jewelry': {
                name: 'Gold Jewelry',
                style: 'Mesopotamian',
                material: 'Gold',
                age: 'Various',
                inscription: null
            },
            'statue': {
                name: 'Stone Statue',
                style: 'Mesopotamian',
                material: 'Stone',
                age: 'Various',
                inscription: null
            },
            'tool': {
                name: 'Bronze Tool',
                style: 'Mesopotamian',
                material: 'Bronze',
                age: 'Various',
                inscription: null
            },
            'weapon': {
                name: 'Bronze Weapon',
                style: 'Mesopotamian',
                material: 'Bronze',
                age: 'Various',
                inscription: null
            },
            'unidentified': {
                name: 'Artifact (Unidentified)',
                style: 'Unknown',
                material: 'Unknown',
                age: 'Unknown',
                inscription: null
            }
        };
        return data[type] || data['unidentified'];
    }
}

// Game Controller
class GameController {
    constructor() {
        this.state = new GameState();
        this.playerModel = new PlayerModel(1000);
        this.excavationSystem = new ExcavationSystem();
        this.identificationSystem = new IdentificationSystem();
        this.init();
    }

    init() {
        // Wait a tiny bit to ensure DOM is fully ready
        setTimeout(() => {
            try {
                this.setupEventListeners();
                this.updateUI();
                this.createInitialSite();
                this.createInventorySlots();
                console.log('Game initialized successfully');
            } catch (error) {
                console.error('Error during initialization:', error);
            }
        }, 10);
    }

    setupEventListeners() {
        // Excavation method buttons
        document.getElementById('surface-collection-btn').addEventListener('click', () => {
            this.selectExcavationMethod('surface_collection');
        });
        document.getElementById('excavation-btn').addEventListener('click', () => {
            this.selectExcavationMethod('excavation');
        });
        document.getElementById('trench-btn').addEventListener('click', () => {
            this.selectExcavationMethod('trench');
        });

        // Hire personnel
        document.getElementById('hire-btn').addEventListener('click', () => {
            this.hirePersonnel();
        });

        // Site controls
        document.getElementById('start-excavation-btn').addEventListener('click', () => {
            this.startExcavation();
        });

        // Map button
        document.getElementById('map-btn').addEventListener('click', () => {
            this.showMap();
        });

        // Close map button
        document.getElementById('close-map-modal').addEventListener('click', () => {
            this.hideMap();
        });

        // Layer controls removed
    }

    selectExcavationMethod(method) {
        this.state.selectedExcavationMethod = method;
        document.querySelectorAll('.excavation-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${method.replace('_', '-')}-btn`).classList.add('active');
        this.state.selectedTiles = [];
        this.updateTileSelection();
    }

    hirePersonnel() {
        const workers = parseInt(document.getElementById('workers-input').value) || 0;
        const archaeologists = parseInt(document.getElementById('archaeologists-input').value) || 0;
        const linguists = parseInt(document.getElementById('linguists-input').value) || 0;

        const totalCost = workers * 50 + archaeologists * 200 + linguists * 500;
        const player = this.playerModel.getPlayer();

        if (player.money < totalCost) {
            this.showNotification('Insufficient funds!', 'error');
            return;
        }

        if (workers > 0) this.playerModel.hireWorkers(workers);
        if (archaeologists > 0) this.playerModel.hireArchaeologists(archaeologists);
        if (linguists > 0) this.playerModel.hireLinguists(linguists);

        this.showNotification(`Hired ${workers} workers, ${archaeologists} archaeologists, ${linguists} linguists`, 'success');
        this.updateUI();
    }

    createInitialSite() {
        console.log('Creating initial site...');
        const siteModel = new SiteModel('Tell Abu Salabikh', 3, { x: 10, y: 15 }, 'medium', 4, 'Ur III');
        siteModel.discover();
        siteModel.startExcavation();
        this.state.currentSite = siteModel.getSite();
        this.state.sites.push(this.state.currentSite);
        this.state.selectedTiles = [];
        
        console.log('Site created, generating tiles...');
        this.generateTiles();
        this.updateSiteView();
        console.log('Initial site setup complete');
    }

    showMap() {
        const mapView = document.getElementById('map-view');
        const mapContainer = document.getElementById('map-container');
        const mainContainer = document.querySelector('.main-container');
        
        // Hide main content
        if (mainContainer) {
            mainContainer.style.display = 'none';
        }
        
        // Define sites on the map
        const mapSites = [
            { name: 'Tell Abu Salabikh', x: 45, y: 40, discovered: true },
            { name: 'Nippur', x: 60, y: 50, discovered: false },
            { name: 'Ur', x: 30, y: 35, discovered: false },
            { name: 'Babylon', x: 70, y: 60, discovered: false },
            { name: 'Uruk', x: 25, y: 55, discovered: false },
            { name: 'Kish', x: 50, y: 30, discovered: false }
        ];
        
        mapContainer.innerHTML = '';
        
        mapSites.forEach(site => {
            const siteMarker = document.createElement('div');
            siteMarker.className = 'map-site-marker';
            siteMarker.dataset.siteName = site.name;
            siteMarker.style.left = `${site.x}%`;
            siteMarker.style.top = `${site.y}%`;
            
            if (site.discovered) {
                siteMarker.classList.add('discovered');
            }
            
            const siteLabel = document.createElement('div');
            siteLabel.className = 'map-site-label';
            siteLabel.textContent = site.name;
            siteMarker.appendChild(siteLabel);
            
            siteMarker.addEventListener('click', () => {
                this.selectSiteFromMap(site.name);
            });
            
            mapContainer.appendChild(siteMarker);
        });
        
        mapView.style.display = 'flex';
    }

    hideMap() {
        const mapView = document.getElementById('map-view');
        const mainContainer = document.querySelector('.main-container');
        
        // Show main content again
        if (mainContainer) {
            mainContainer.style.display = 'grid';
        }
        
        mapView.style.display = 'none';
    }

    selectSiteFromMap(siteName) {
        // If clicking on Abu Salabikh, go back to site view
        if (siteName === 'Tell Abu Salabikh') {
            this.hideMap();
            // Site is already loaded, just ensure view is updated
            this.updateSiteView();
            this.showNotification('Returning to Tell Abu Salabikh', 'info');
        } else {
            // For other sites, show that they're not yet discovered
            this.showNotification(`${siteName} has not been discovered yet!`, 'info');
        }
    }

    generateTiles() {
        // Completely simplified - just create 9 tiles in a 3x3 grid
        this.state.tiles.clear();
        
        const gridSize = 3;
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const tile = {
                    id: `tile_${x}_${y}`,
                    position: { x, y },
                    excavated: false,
                    artifacts: [],
                    structure: 'none'
                };
                this.state.tiles.set(tile.id, tile);
            }
        }
        
        console.log(`Generated ${this.state.tiles.size} tiles in 3x3 grid`);
    }
    
    updateSiteView() {
        if (!this.state.currentSite) {
            console.warn('No current site to display');
            return;
        }

        const siteNameEl = document.getElementById('site-name');

        if (!siteNameEl) {
            console.error('Required DOM elements not found');
            return;
        }

        siteNameEl.textContent = this.state.currentSite.name;

        this.renderTiles();
    }

    renderTiles() {
        const container = document.getElementById('tile-container');
        if (!container) {
            console.error('Tile container not found');
            return;
        }

        // Always generate tiles if empty
        if (this.state.tiles.size === 0) {
            console.log('Generating tiles...');
            this.generateTiles();
        }

        container.innerHTML = '';
        container.className = 'tile-container isometric-grid';

        console.log(`Rendering ${this.state.tiles.size} tiles`);

        // Render tiles in isometric grid
        const gridSize = 3;
        this.state.tiles.forEach((tile, tileId) => {
            const tileElement = document.createElement('div');
            tileElement.className = 'tile isometric-tile';
            tileElement.dataset.tileId = tileId;
            tileElement.dataset.x = tile.position.x;
            tileElement.dataset.y = tile.position.y;
            
            // Check if tile is excavated
            if (tile.excavated) {
                tileElement.classList.add('excavated');
            }
            if (tile.artifacts.length > 0) {
                tileElement.classList.add('has-artifact');
            }
            if (this.state.selectedTiles.includes(tileId)) {
                tileElement.classList.add('selected');
            }

            // Calculate isometric position (isometric projection)
            // For a 3x3 grid, center it in the container
            const tileSize = 60;
            const spacingX = 55; // Horizontal spacing in isometric view
            const spacingY = 28; // Vertical spacing in isometric view
            const centerX = 200; // Center of container
            const centerY = 150;
            
            // Isometric projection: x and y affect both horizontal and vertical position
            // Formula: isoX = (x - y) * spacing, isoY = (x + y) * spacing/2
            const isoX = (tile.position.x - tile.position.y) * spacingX;
            const isoY = (tile.position.x + tile.position.y) * spacingY;
            
            tileElement.style.left = `${centerX + isoX - tileSize/2}px`;
            tileElement.style.top = `${centerY + isoY - tileSize/2}px`;
            
            tileElement.addEventListener('click', () => {
                this.toggleTileSelection(tileId);
            });

            container.appendChild(tileElement);
        });
    }

    toggleTileSelection(tileId) {
        if (!this.state.selectedExcavationMethod) {
            this.showNotification('Please select an excavation method first!', 'info');
            return;
        }

        const tile = this.state.tiles.get(tileId);
        if (!tile) return;
        
        // Check if already excavated
        if (tile.excavated) {
            this.showNotification('This tile is already excavated!', 'info');
            return;
        }
        
        const index = this.state.selectedTiles.indexOf(tileId);
        if (index > -1) {
            this.state.selectedTiles.splice(index, 1);
        } else {
            this.state.selectedTiles.push(tileId);
        }
        this.updateTileSelection();
    }

    updateTileSelection() {
        this.renderTiles();
        document.getElementById('start-excavation-btn').disabled = 
            !this.state.selectedExcavationMethod || this.state.selectedTiles.length === 0;
    }

    startExcavation() {
        if (!this.state.selectedExcavationMethod || this.state.selectedTiles.length === 0) {
            return;
        }

        const player = this.playerModel.getPlayer();
        const selectedTiles = this.state.selectedTiles.map(id => this.state.tiles.get(id));

        // Determine personnel requirements
        let workers = 1, archaeologists = 0, linguists = 0;
        if (this.state.selectedExcavationMethod === 'excavation') {
            workers = 3;
            archaeologists = 1;
        } else if (this.state.selectedExcavationMethod === 'trench') {
            workers = 5;
            archaeologists = 2;
            linguists = 1;
        }

        // Check if we have enough personnel
        if (player.workers < workers || player.archaeologists < archaeologists || player.linguists < linguists) {
            this.showNotification('Insufficient personnel!', 'error');
            return;
        }

        // Create and start task
        const taskModel = new TaskModel(
            this.state.selectedExcavationMethod,
            player.id,
            workers,
            archaeologists,
            linguists
        );
        taskModel.addSite(this.state.currentSite.id);
        selectedTiles.forEach(tile => taskModel.addTile(tile.id));

        const task = taskModel.getTask();
        if (!this.playerModel.spendMoney(task.cost)) {
            this.showNotification('Insufficient funds!', 'error');
            return;
        }

        taskModel.start();
        this.state.activeTask = taskModel;
        this.showTaskModal(taskModel);
    }

    showTaskModal(taskModel) {
        const modal = document.getElementById('task-modal');
        const progressFill = document.getElementById('task-progress-fill');
        const taskStatus = document.getElementById('task-status');
        const closeBtn = document.getElementById('close-task-modal');

        modal.classList.add('show');
        closeBtn.style.display = 'none';

        const startTime = Date.now();
        const duration = taskModel.getTask().estimatedDuration * 1000;

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            progressFill.style.width = progress + '%';

            if (progress >= 100) {
                clearInterval(interval);
                this.completeTask(taskModel);
                taskStatus.textContent = 'Excavation Complete!';
                closeBtn.style.display = 'block';
            } else {
                taskStatus.textContent = `Excavating... ${Math.floor(progress)}%`;
            }
        }, 100);
    }

    completeTask(taskModel) {
        const task = taskModel.getTask();
        const selectedTiles = this.state.selectedTiles.map(id => this.state.tiles.get(id));
        const result = this.excavationSystem.executeExcavation(task, this.state.currentSite, selectedTiles);

        // Update tiles
        result.tiles.forEach(excavatedTile => {
            const tile = this.state.tiles.get(excavatedTile.id);
            if (tile) {
                tile.excavated = true;
                excavatedTile.artifacts.forEach(artifactId => {
                    if (!tile.artifacts.includes(artifactId)) {
                        tile.artifacts.push(artifactId);
                    }
                });
            }
        });

        // Add artifacts to inventory
        result.artifacts.forEach(artifact => {
            this.state.artifacts.push(artifact);
            this.addToInventory(artifact);
        });

        taskModel.complete();
        this.state.activeTask = null;
        this.state.selectedTiles = [];
        this.updateUI();
        this.updateSiteView();
        this.renderArtifacts();

        if (result.artifacts.length > 0) {
            this.showNotification(`Found ${result.artifacts.length} artifact(s)!`, 'success');
        }
    }

    // Layer navigation removed - no longer needed

    addToInventory(artifact) {
        if (this.state.inventory.length < 20) {
            this.state.inventory.push(artifact);
        }
    }

    createInventorySlots() {
        const container = document.getElementById('inventory-slots');
        container.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.dataset.slotIndex = i;
            container.appendChild(slot);
        }
        this.updateInventoryDisplay();
    }

    updateInventoryDisplay() {
        const slots = document.querySelectorAll('.inventory-slot');
        slots.forEach((slot, index) => {
            slot.innerHTML = '';
            slot.classList.remove('filled');
            if (this.state.inventory[index]) {
                slot.classList.add('filled');
                const icon = document.createElement('div');
                icon.className = 'slot-icon';
                icon.textContent = this.getArtifactIcon(this.state.inventory[index].type);
                slot.appendChild(icon);
                
                // Add click handler to view artifact
                slot.addEventListener('click', () => {
                    this.viewArtifact(this.state.inventory[index].id);
                });
            }
        });
        document.getElementById('inventory-count').textContent = `${this.state.inventory.length} / 20`;
    }
    
    viewArtifact(artifactId) {
        const artifact = this.state.artifacts.find(a => a.id === artifactId);
        if (artifact) {
            // Scroll to artifact in list
            const card = document.querySelector(`[data-artifact-id="${artifactId}"]`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.style.animation = 'pulse 0.5s';
                setTimeout(() => card.style.animation = '', 500);
            }
        }
    }

    getArtifactIcon(type) {
        const icons = {
            'stamped_brick': '🧱',
            'cuneiform_tablet': '📜',
            'cylinder_seal': '🔷',
            'pottery': '🏺',
            'jewelry': '💍',
            'statue': '🗿',
            'tool': '🔧',
            'weapon': '⚔️',
            'unidentified': '❓'
        };
        return icons[type] || '❓';
    }

    renderArtifacts() {
        const container = document.getElementById('artifacts-list');
        container.innerHTML = '';

        this.state.artifacts.forEach(artifact => {
            const card = document.createElement('div');
            card.className = 'artifact-card';
            card.dataset.artifactId = artifact.id;
            if (artifact.identified) {
                card.classList.add('identified');
            }

            card.innerHTML = `
                <div class="artifact-header">
                    <div class="artifact-icon">${this.getArtifactIcon(artifact.type)}</div>
                    <div class="artifact-title">${artifact.name}</div>
                    <div class="artifact-value">$${artifact.value}</div>
                </div>
                <div class="artifact-details">
                    <p><strong>Provenience:</strong> ${artifact.provenience}</p>
                    <p><strong>Style:</strong> ${artifact.style}</p>
                    <p><strong>Material:</strong> ${artifact.material}</p>
                    <p><strong>Age:</strong> ${artifact.age}</p>
                    ${artifact.inscription ? `<p><strong>Inscription:</strong> ${artifact.inscription}</p>` : ''}
                    ${artifact.set ? `<p><strong>Part of Set:</strong> ${artifact.set}</p>` : ''}
                </div>
                ${artifact.bonuses.length > 0 ? `
                    <div class="artifact-bonuses">
                        ${artifact.bonuses.map(b => `<div class="bonus-item">+${b.value} ${b.type}</div>`).join('')}
                    </div>
                ` : ''}
                <div class="artifact-actions">
                    ${!artifact.identified ? `
                        <button class="artifact-btn identify-btn" onclick="gameController.identifyArtifact('${artifact.id}')">
                            Identify
                        </button>
                    ` : ''}
                    <button class="artifact-btn sell-btn" onclick="gameController.sellArtifact('${artifact.id}')">
                        Sell ($${artifact.value})
                    </button>
                </div>
            `;

            container.appendChild(card);
        });
    }

    identifyArtifact(artifactId) {
        const artifact = this.state.artifacts.find(a => a.id === artifactId);
        if (!artifact) return;

        const player = this.playerModel.getPlayer();
        const result = this.identificationSystem.identifyArtifact(
            artifact,
            player.archaeologists,
            player.linguists
        );

        if (result.success) {
            const index = this.state.artifacts.findIndex(a => a.id === artifactId);
            this.state.artifacts[index] = result.identifiedArtefact;
            this.renderArtifacts();
            this.updateInventoryDisplay();
            this.showNotification(result.information, 'success');
        } else {
            this.showNotification(result.information, 'error');
        }
    }

    sellArtifact(artifactId) {
        const artifact = this.state.artifacts.find(a => a.id === artifactId);
        if (!artifact) return;

        this.playerModel.addMoney(artifact.value);
        this.state.artifacts = this.state.artifacts.filter(a => a.id !== artifactId);
        this.state.inventory = this.state.inventory.filter(a => a.id !== artifactId);
        this.updateUI();
        this.renderArtifacts();
        this.updateInventoryDisplay();
        this.showNotification(`Sold ${artifact.name} for $${artifact.value}`, 'success');
    }

    updateUI() {
        const player = this.playerModel.getPlayer();
        document.getElementById('money').textContent = player.money;
        document.getElementById('workers').textContent = `${player.workers} Workers`;
        document.getElementById('archaeologists').textContent = `${player.archaeologists} / 5`;
        document.getElementById('linguists').textContent = `${player.linguists} / 2`;
    }

    showNotification(message, type = 'info') {
        const notifications = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notifications.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize game when page loads
let gameController;
document.addEventListener('DOMContentLoaded', () => {
    gameController = new GameController();
    
    // Close task modal
    document.getElementById('close-task-modal').addEventListener('click', () => {
        document.getElementById('task-modal').classList.remove('show');
    });
});

