// Game Controller - Connects UI to game logic
// Browser-compatible implementation

// Game State
class GameState {
    constructor() {
        this.player = {
            id: 'player_1',
            money: 1000,
            workers: 3,
            archaeologists: 1,
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
        this.exhibitedArtifacts = {}; // Map of slotIndex -> artifactId
        this.exhibitedArtifactsData = {}; // Map of slotIndex -> artifact object (for display)
        this.storageCapacity = 20; // Base storage capacity
        this.selectedStructure = null; // 'tent' or 'dig_house'
        this.discoveredSites = new Set(['Tell Abu Salabikh']); // Track discovered sites
        this.museumRooms = [
            {
                id: 'room_1',
                name: 'Main Hall',
                unlocked: true,
                cases: [
                    { id: 'case_1_1', unlocked: true, slots: 4 },
                    { id: 'case_1_2', unlocked: false, slots: 3 },
                    { id: 'case_1_3', unlocked: false, slots: 5 }
                ]
            },
            {
                id: 'room_2',
                name: 'Ancient Artifacts Wing',
                unlocked: false,
                cases: [
                    { id: 'case_2_1', unlocked: false, slots: 4 },
                    { id: 'case_2_2', unlocked: false, slots: 3 }
                ]
            }
        ]; // Museum structure: rooms with cases
    }
}

// Simplified Game Models (browser-compatible)
class PlayerModel {
    constructor(initialMoney = 1000) {
        this.player = {
            id: 'player_' + Date.now(),
            money: initialMoney,
            workers: 3,
            archaeologists: 1,
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
            // Increase value by 50-100% when identified
            this.artefact.value = Math.floor(this.artefact.value * (1.5 + Math.random() * 0.5));
        }
    }

    calculateBaseValue(rarity) {
        switch (rarity) {
            case 'common': return 10 + Math.floor(Math.random() * 40);
            case 'uncommon': return 50 + Math.floor(Math.random() * 100);
            case 'rare': return 200 + Math.floor(Math.random() * 300);
            case 'very_rare': return 800 + Math.floor(Math.random() * 1200);
            case 'legendary': return 3000 + Math.floor(Math.random() * 5000);
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
                rarity: this.randomRarity(['common', 'common', 'common', 'uncommon']) // 75% common, 25% uncommon
            };
        }

        if (taskType === 'excavation') {
            const types = ['pottery', 'stamped_brick', 'cuneiform_tablet', 'cylinder_seal', 'tool', 'jewelry', 'statue', 'weapon'];
            // Weighted distribution: 30% common, 25% uncommon, 30% rare, 10% very_rare, 5% legendary
            const rarity = this.randomRarity(['common', 'common', 'common', 'uncommon', 'uncommon', 'uncommon', 'rare', 'rare', 'rare', 'rare', 'rare', 'very_rare', 'very_rare', 'legendary']);
            return {
                type: types[Math.floor(Math.random() * types.length)],
                rarity: rarity
            };
        }

        if (taskType === 'trench') {
            const valuableTypes = ['cuneiform_tablet', 'cylinder_seal', 'jewelry', 'statue'];
            // Weighted distribution: 10% uncommon, 50% rare, 30% very_rare, 10% legendary
            const rarity = this.randomRarity(['uncommon', 'rare', 'rare', 'rare', 'rare', 'rare', 'very_rare', 'very_rare', 'very_rare', 'legendary']);
            return {
                type: valuableTypes[Math.floor(Math.random() * valuableTypes.length)],
                rarity: rarity
            };
        }

        return { type: 'unidentified', rarity: 'common' };
    }

    randomRarity(weightedArray) {
        return weightedArray[Math.floor(Math.random() * weightedArray.length)];
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
        // Only Rare+ items can be identified
        const rareRarities = ['rare', 'very_rare', 'legendary'];
        if (!rareRarities.includes(artifact.rarity)) {
            return { archaeologists: 999, linguists: 999, time: 999 }; // Prevent identification
        }

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
        this.renderArtifacts();
                console.log('Game initialized successfully');
            } catch (error) {
                console.error('Error during initialization:', error);
            }
        }, 10);
    }

    setupEventListeners() {
        // Excavation method buttons
        const surfaceCollectionBtn = document.getElementById('surface-collection-btn');
        const excavationBtn = document.getElementById('excavation-btn');
        const trenchBtn = document.getElementById('trench-btn');
        
        if (surfaceCollectionBtn) {
            surfaceCollectionBtn.addEventListener('click', () => {
                this.selectExcavationMethod('surface_collection');
            });
        }
        if (excavationBtn) {
            excavationBtn.addEventListener('click', () => {
                this.selectExcavationMethod('excavation');
            });
        }
        if (trenchBtn) {
            trenchBtn.addEventListener('click', () => {
                this.selectExcavationMethod('trench');
            });
        }

        // Structure buttons
        const tentBtn = document.getElementById('tent-btn');
        const digHouseBtn = document.getElementById('dig-house-btn');
        
        if (tentBtn) {
            tentBtn.addEventListener('click', () => {
                this.selectStructure('tent');
            });
        }
        if (digHouseBtn) {
            digHouseBtn.addEventListener('click', () => {
                this.selectStructure('dig_house');
            });
        }

        // Hire personnel buttons
        const hireWorkerBtn = document.getElementById('hire-worker-btn');
        const hireArchaeologistBtn = document.getElementById('hire-archaeologist-btn');
        const hireLinguistBtn = document.getElementById('hire-linguist-btn');
        
        if (hireWorkerBtn) {
            hireWorkerBtn.addEventListener('click', () => {
                this.hirePersonnel('worker');
            });
        }
        if (hireArchaeologistBtn) {
            hireArchaeologistBtn.addEventListener('click', () => {
                this.hirePersonnel('archaeologist');
            });
        }
        if (hireLinguistBtn) {
            hireLinguistBtn.addEventListener('click', () => {
                this.hirePersonnel('linguist');
            });
        }

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

        // Museum button
        document.getElementById('museum-btn').addEventListener('click', () => {
            if (document.getElementById('museum-view').style.display === 'none' || 
                document.getElementById('museum-view').style.display === '') {
                this.showMuseum();
            } else {
                this.hideMuseum();
            }
        });

        // Layer controls removed
    }

    selectExcavationMethod(method) {
        this.state.selectedExcavationMethod = method;
        this.state.selectedStructure = null; // Clear structure selection
        document.querySelectorAll('.excavation-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.structure-btn').forEach(btn => btn.classList.remove('active'));
        
        // Map method names to button IDs
        const buttonIdMap = {
            'surface_collection': 'surface-collection-btn',
            'excavation': 'excavation-btn',
            'trench': 'trench-btn'
        };
        
        const buttonId = buttonIdMap[method];
        if (buttonId) {
            const btn = document.getElementById(buttonId);
            if (btn) {
                btn.classList.add('active');
            }
        }
        
        this.state.selectedTiles = [];
        this.updateTileSelection();
    }

    selectStructure(structure) {
        this.state.selectedStructure = structure;
        this.state.selectedExcavationMethod = null; // Clear excavation method selection
        document.querySelectorAll('.excavation-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.structure-btn').forEach(btn => btn.classList.remove('active'));
        if (structure === 'tent') {
            document.getElementById('tent-btn').classList.add('active');
        } else if (structure === 'dig_house') {
            document.getElementById('dig-house-btn').classList.add('active');
        }
        this.state.selectedTiles = [];
        this.updateTileSelection();
    }

    hirePersonnel(type) {
        const costs = {
            'worker': 50,
            'archaeologist': 200,
            'linguist': 500
        };
        
        const maxCounts = {
            'worker': 10,
            'archaeologist': 5,
            'linguist': 2
        };
        
        const cost = costs[type];
        const maxCount = maxCounts[type];
        const player = this.playerModel.getPlayer();
        
        // Check current count
        let currentCount = 0;
        if (type === 'worker') {
            currentCount = player.workers;
        } else if (type === 'archaeologist') {
            currentCount = player.archaeologists;
        } else if (type === 'linguist') {
            currentCount = player.linguists;
        }
        
        if (currentCount >= maxCount) {
            this.showNotification(`Maximum ${type}s already hired (${maxCount})`, 'info');
            return;
        }
        
        if (player.money < cost) {
            this.showNotification(`Insufficient funds! Need $${cost}`, 'error');
            return;
        }
        
        // Hire one person
        if (type === 'worker') {
            this.playerModel.hireWorkers(1);
            this.showNotification('Hired 1 worker', 'success');
        } else if (type === 'archaeologist') {
            this.playerModel.hireArchaeologists(1);
            this.showNotification('Hired 1 archaeologist', 'success');
        } else if (type === 'linguist') {
            this.playerModel.hireLinguists(1);
            this.showNotification('Hired 1 linguist', 'success');
        }
        
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
            { name: 'Tell Abu Salabikh', x: 45, y: 40 },
            { name: 'Nippur', x: 60, y: 50 },
            { name: 'Ur', x: 30, y: 35 },
            { name: 'Babylon', x: 70, y: 60 },
            { name: 'Uruk', x: 25, y: 55 },
            { name: 'Kish', x: 50, y: 30 }
        ];
        
        mapContainer.innerHTML = '';
        
        mapSites.forEach(site => {
            const isDiscovered = this.state.discoveredSites.has(site.name);
            
            const siteMarker = document.createElement('div');
            siteMarker.className = 'map-site-marker';
            siteMarker.dataset.siteName = site.name;
            siteMarker.style.left = `${site.x}%`;
            siteMarker.style.top = `${site.y}%`;
            
            if (isDiscovered) {
                siteMarker.classList.add('discovered');
                
                // Only show name if discovered
                const siteLabel = document.createElement('div');
                siteLabel.className = 'map-site-label';
                siteLabel.textContent = site.name;
                siteMarker.appendChild(siteLabel);
            }
            
            siteMarker.addEventListener('click', () => {
                this.selectSiteFromMap(site.name, isDiscovered);
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

    selectSiteFromMap(siteName, isDiscovered) {
        // If clicking on Abu Salabikh, go back to site view
        if (siteName === 'Tell Abu Salabikh') {
            this.hideMap();
            // Site is already loaded, just ensure view is updated
            this.updateSiteView();
            this.showNotification('Returning to Tell Abu Salabikh', 'info');
        } else if (isDiscovered) {
            // Site is discovered, show notification
            this.showNotification(`${siteName} is already discovered`, 'info');
        } else {
            // Show sounding modal for undiscovered sites
            this.showSoundingModal(siteName);
        }
    }

    showSoundingModal(siteName) {
        // Remove any existing modal
        const existingModal = document.getElementById('sounding-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.id = 'sounding-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Undiscovered Site</h3>
                <p>This site has not been explored yet. Perform a sounding to discover its name.</p>
                <div class="modal-actions">
                    <button class="action-btn" onclick="gameController.performSounding('${siteName}')">
                        Sounding ($200)
                    </button>
                    <button class="action-btn" onclick="document.getElementById('sounding-modal').remove()" style="background: #999;">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    performSounding(siteName) {
        const player = this.playerModel.getPlayer();
        const cost = 200;
        
        if (player.money < cost) {
            this.showNotification(`Insufficient funds! Need $${cost}`, 'error');
            return;
        }
        
        // Spend money
        this.playerModel.spendMoney(cost);
        
        // Discover the site
        this.state.discoveredSites.add(siteName);
        
        // Update UI
        this.updateUI();
        
        // Remove modal
        const modal = document.getElementById('sounding-modal');
        if (modal) {
            modal.remove();
        }
        
        // Refresh map to show the name
        this.showMap();
        
        this.showNotification(`Discovered: ${siteName}!`, 'success');
    }

    showMuseum() {
        const museumView = document.getElementById('museum-view');
        const mainContainer = document.querySelector('.main-container');
        const museumBtn = document.getElementById('museum-btn');
        
        // Hide main content
        if (mainContainer) {
            mainContainer.style.display = 'none';
        }
        
        // Highlight museum button
        if (museumBtn) {
            museumBtn.classList.add('active');
        }
        
        // Generate exhibition slots
        this.generateExhibitionSlots();
        
        museumView.style.display = 'flex';
    }

    hideMuseum() {
        const museumView = document.getElementById('museum-view');
        const mainContainer = document.querySelector('.main-container');
        const museumBtn = document.getElementById('museum-btn');
        
        // Show main content again
        if (mainContainer) {
            mainContainer.style.display = 'grid';
        }
        
        // Remove highlight from museum button
        if (museumBtn) {
            museumBtn.classList.remove('active');
        }
        
        museumView.style.display = 'none';
    }

    generateExhibitionSlots() {
        const container = document.getElementById('museum-interior');
        if (!container) return;
        
        // Ensure exhibitedArtifactsData is initialized
        if (!this.state.exhibitedArtifactsData) {
            this.state.exhibitedArtifactsData = {};
        }
        if (!this.state.exhibitedArtifacts) {
            this.state.exhibitedArtifacts = {};
        }
        
        container.innerHTML = '';
        
        let globalSlotIndex = 0;
        
        console.log('Generating exhibition slots. Exhibited artifacts:', this.state.exhibitedArtifacts);
        console.log('Exhibited artifacts data:', this.state.exhibitedArtifactsData);
        
        this.state.museumRooms.forEach((room, roomIndex) => {
            const roomElement = document.createElement('div');
            roomElement.className = 'museum-room';
            roomElement.dataset.roomId = room.id;
            
            if (!room.unlocked) {
                roomElement.classList.add('locked');
            }
            
            const roomHeader = document.createElement('div');
            roomHeader.className = 'museum-room-header';
            
            const roomTitle = document.createElement('h3');
            roomTitle.textContent = room.name;
            roomHeader.appendChild(roomTitle);
            
            // Add unlock room button if locked
            if (!room.unlocked) {
                const unlockRoomBtn = document.createElement('button');
                unlockRoomBtn.className = 'unlock-btn';
                unlockRoomBtn.textContent = `Unlock Room ($${this.getRoomUnlockCost(roomIndex)})`;
                unlockRoomBtn.onclick = () => {
                    this.unlockRoom(roomIndex);
                };
                roomHeader.appendChild(unlockRoomBtn);
            }
            
            roomElement.appendChild(roomHeader);
            
            if (room.unlocked) {
                const casesContainer = document.createElement('div');
                casesContainer.className = 'museum-cases';
                
                room.cases.forEach((displayCase, caseIndex) => {
                    const caseElement = document.createElement('div');
                    caseElement.className = 'display-case';
                    caseElement.dataset.caseId = displayCase.id;
                    
                    if (!displayCase.unlocked) {
                        caseElement.classList.add('locked');
                    }
                    
                    const caseHeader = document.createElement('div');
                    caseHeader.className = 'display-case-header';
                    
                    // Add unlock case button if locked
                    if (!displayCase.unlocked) {
                        const unlockCaseBtn = document.createElement('button');
                        unlockCaseBtn.className = 'unlock-btn small';
                        unlockCaseBtn.textContent = `Unlock ($${this.getCaseUnlockCost(roomIndex, caseIndex)})`;
                        unlockCaseBtn.onclick = () => {
                            this.unlockCase(roomIndex, caseIndex);
                        };
                        caseHeader.appendChild(unlockCaseBtn);
                        caseElement.appendChild(caseHeader);
                    }
                    
                    if (displayCase.unlocked) {
                        const slotsGrid = document.createElement('div');
                        slotsGrid.className = 'exhibition-grid';
                        
                        for (let slotIndex = 0; slotIndex < displayCase.slots; slotIndex++) {
                            const slot = document.createElement('div');
                            slot.className = 'exhibition-slot';
                            slot.dataset.slotIndex = globalSlotIndex;
                            
                            // Check if there's an artifact in this slot
                            // Ensure we check with the same type (number) as stored
                            const slotKey = Number(globalSlotIndex);
                            const displayedArtifactId = this.state.exhibitedArtifacts ? 
                                (this.state.exhibitedArtifacts[slotKey] || this.state.exhibitedArtifacts[String(slotKey)]) : null;
                            
                            console.log(`Rendering slot ${slotKey} (${typeof slotKey}): checking for artifact, found ID:`, displayedArtifactId);
                            console.log(`Available keys in exhibitedArtifacts:`, this.state.exhibitedArtifacts ? Object.keys(this.state.exhibitedArtifacts) : 'none');
                            console.log(`Available keys in exhibitedArtifactsData:`, this.state.exhibitedArtifactsData ? Object.keys(this.state.exhibitedArtifactsData) : 'none');
                            
                            if (displayedArtifactId) {
                                slot.classList.add('filled');
                                // Get artifact from exhibited artifacts data (since it's removed from inventory)
                                // Check both number and string keys
                                const artifact = this.state.exhibitedArtifactsData ? 
                                    (this.state.exhibitedArtifactsData[slotKey] || this.state.exhibitedArtifactsData[String(slotKey)]) : null;
                                
                                console.log(`Slot ${globalSlotIndex}: artifactId=${displayedArtifactId}, artifact data:`, artifact);
                                
                                if (artifact) {
                                    const icon = document.createElement('div');
                                    icon.className = 'exhibition-icon';
                                    icon.textContent = this.getArtifactIcon(artifact.type);
                                    slot.appendChild(icon);
                                    
                                    const label = document.createElement('div');
                                    label.className = 'exhibition-label';
                                    label.textContent = artifact.name;
                                    slot.appendChild(label);
                                    
                                    // Add remove button
                                    const removeBtn = document.createElement('button');
                                    removeBtn.className = 'exhibition-remove';
                                    removeBtn.textContent = '×';
                                    removeBtn.onclick = (e) => {
                                        e.stopPropagation();
                                        this.removeFromExhibition(slotKey);
                                    };
                                    slot.appendChild(removeBtn);
                                } else {
                                    console.warn(`Artifact data missing for slot ${slotKey}, artifactId: ${displayedArtifactId}`);
                                    // Artifact ID exists but data is missing - try to find in inventory as fallback
                                    const fallbackArtifact = this.state.artifacts.find(a => a.id === displayedArtifactId);
                                    if (fallbackArtifact) {
                                        console.log(`Found fallback artifact in inventory for slot ${slotKey}`);
                                        // Restore the data
                                        if (!this.state.exhibitedArtifactsData) {
                                            this.state.exhibitedArtifactsData = {};
                                        }
                                        this.state.exhibitedArtifactsData[slotKey] = JSON.parse(JSON.stringify(fallbackArtifact));
                                        
                                        const icon = document.createElement('div');
                                        icon.className = 'exhibition-icon';
                                        icon.textContent = this.getArtifactIcon(fallbackArtifact.type);
                                        slot.appendChild(icon);
                                        
                                        const label = document.createElement('div');
                                        label.className = 'exhibition-label';
                                        label.textContent = fallbackArtifact.name;
                                        slot.appendChild(label);
                                        
                                        const removeBtn = document.createElement('button');
                                        removeBtn.className = 'exhibition-remove';
                                        removeBtn.textContent = '×';
                                        removeBtn.onclick = (e) => {
                                            e.stopPropagation();
                                            this.removeFromExhibition(slotKey);
                                        };
                                        slot.appendChild(removeBtn);
                                    } else {
                                        console.error(`Cannot find artifact ${displayedArtifactId} anywhere for slot ${slotKey}`);
                                    }
                                }
                            } else {
                                // Empty slot - add click handler
                                slot.addEventListener('click', () => {
                                    console.log(`Slot ${slotKey} clicked, showing artifact selector`);
                                    this.showArtifactSelector(slotKey);
                                });
                            }
                            
                            slotsGrid.appendChild(slot);
                            globalSlotIndex++;
                        }
                        
                        caseElement.appendChild(slotsGrid);
                    }
                    
                    casesContainer.appendChild(caseElement);
                });
                
                roomElement.appendChild(casesContainer);
            }
            
            container.appendChild(roomElement);
        });
    }

    getRoomUnlockCost(roomIndex) {
        // First room is free, subsequent rooms cost more
        return roomIndex === 0 ? 0 : 500 * (roomIndex + 1);
    }

    getCaseUnlockCost(roomIndex, caseIndex) {
        // Cases cost based on position
        return 200 * (caseIndex + 1);
    }

    unlockRoom(roomIndex) {
        const room = this.state.museumRooms[roomIndex];
        if (!room || room.unlocked) return;
        
        const cost = this.getRoomUnlockCost(roomIndex);
        const player = this.playerModel.getPlayer();
        
        if (player.money < cost) {
            this.showNotification(`Insufficient funds! Need $${cost}`, 'error');
            return;
        }
        
        this.playerModel.spendMoney(cost);
        room.unlocked = true;
        this.updateUI();
        this.generateExhibitionSlots();
        this.showNotification(`Unlocked ${room.name}!`, 'success');
    }

    unlockCase(roomIndex, caseIndex) {
        const room = this.state.museumRooms[roomIndex];
        if (!room || !room.unlocked) {
            this.showNotification('Room must be unlocked first!', 'error');
            return;
        }
        
        const displayCase = room.cases[caseIndex];
        if (!displayCase || displayCase.unlocked) return;
        
        const cost = this.getCaseUnlockCost(roomIndex, caseIndex);
        const player = this.playerModel.getPlayer();
        
        if (player.money < cost) {
            this.showNotification(`Insufficient funds! Need $${cost}`, 'error');
            return;
        }
        
        this.playerModel.spendMoney(cost);
        displayCase.unlocked = true;
        this.updateUI();
        this.generateExhibitionSlots();
        this.showNotification('Display case unlocked!', 'success');
    }

    addNewRoom(roomName) {
        const roomId = `room_${this.state.museumRooms.length + 1}`;
        const newRoom = {
            id: roomId,
            name: roomName,
            unlocked: false,
            cases: [
                { id: `${roomId}_case_1`, unlocked: false, slots: 3 + Math.floor(Math.random() * 3) } // 3-5 slots
            ]
        };
        this.state.museumRooms.push(newRoom);
    }

    addNewCase(roomIndex) {
        const room = this.state.museumRooms[roomIndex];
        if (!room) return;
        
        const caseId = `${room.id}_case_${room.cases.length + 1}`;
        const newCase = {
            id: caseId,
            unlocked: false,
            slots: 3 + Math.floor(Math.random() * 3) // 3-5 slots
        };
        room.cases.push(newCase);
    }

    showArtifactSelector(slotIndex) {
        // Create modal for selecting artifact
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.id = 'artifact-selector-modal';
        
        const availableArtifacts = this.state.artifacts.filter(a => {
            // Only show artifacts that aren't already exhibited
            const exhibitedIds = this.state.exhibitedArtifacts ? Object.values(this.state.exhibitedArtifacts) : [];
            return !exhibitedIds.includes(a.id);
        });
        
        if (availableArtifacts.length === 0) {
            this.showNotification('No available artifacts to display!', 'info');
            return;
        }
        
        modal.innerHTML = `
            <div class="modal-content artifact-selector-content">
                <h3>Select Artifact to Display</h3>
                <div class="artifact-selector-grid">
                    ${availableArtifacts.map(artifact => `
                        <div class="artifact-selector-item" onclick="gameController.addToExhibition(${slotIndex}, '${artifact.id}')">
                            <div class="artifact-selector-icon">${this.getArtifactIcon(artifact.type)}</div>
                            <div class="artifact-selector-name">${artifact.name}</div>
                            <div class="artifact-selector-value">$${artifact.value}</div>
                        </div>
                    `).join('')}
                </div>
                <button class="action-btn" onclick="document.getElementById('artifact-selector-modal').remove()">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    addToExhibition(slotIndex, artifactId) {
        if (!this.state.exhibitedArtifacts) {
            this.state.exhibitedArtifacts = {};
        }
        if (!this.state.exhibitedArtifactsData) {
            this.state.exhibitedArtifactsData = {};
        }
        
        // Find artifact in inventory
        const artifactIndex = this.state.artifacts.findIndex(a => a.id === artifactId);
        if (artifactIndex === -1) {
            this.showNotification('Artifact not found in inventory!', 'error');
            return;
        }
        
        const artifact = this.state.artifacts[artifactIndex];
        
        // Add to exhibition (store both ID and data)
        // Ensure slotIndex is stored as a number for consistency
        const slotKey = Number(slotIndex);
        this.state.exhibitedArtifacts[slotKey] = artifactId;
        this.state.exhibitedArtifactsData[slotKey] = JSON.parse(JSON.stringify(artifact)); // Deep copy
        
        console.log(`Added artifact to exhibition: slot ${slotKey} (${typeof slotKey}), artifact:`, artifact);
        console.log('Exhibited artifacts:', this.state.exhibitedArtifacts);
        console.log('Exhibited artifacts data keys:', Object.keys(this.state.exhibitedArtifactsData));
        console.log('Exhibited artifacts data:', this.state.exhibitedArtifactsData);
        
        // Remove from inventory
        this.state.artifacts.splice(artifactIndex, 1);
        
        // Update displays
        this.generateExhibitionSlots();
        this.renderArtifacts();
        this.updateUI();
        
        // Close selector modal
        const modal = document.getElementById('artifact-selector-modal');
        if (modal) {
            modal.remove();
        }
        
        this.showNotification('Artifact added to exhibition!', 'success');
    }

    removeFromExhibition(slotIndex) {
        if (this.state.exhibitedArtifacts && this.state.exhibitedArtifacts[slotIndex]) {
            // Get artifact data from exhibited artifacts
            let artifact = this.state.exhibitedArtifactsData ? this.state.exhibitedArtifactsData[slotIndex] : null;
            
            if (!artifact) {
                // Fallback: try to find in artifacts array
                const artifactId = this.state.exhibitedArtifacts[slotIndex];
                const foundArtifact = this.state.artifacts.find(a => a.id === artifactId);
                if (!foundArtifact) {
                    // Just remove from exhibition if we can't find it
                    delete this.state.exhibitedArtifacts[slotIndex];
                    if (this.state.exhibitedArtifactsData) {
                        delete this.state.exhibitedArtifactsData[slotIndex];
                    }
                    this.generateExhibitionSlots();
                    this.showNotification('Artifact removed from exhibition', 'info');
                    return;
                }
                artifact = foundArtifact;
            }
            
            // Check if inventory has space
            if (this.state.artifacts.length >= this.state.storageCapacity) {
                this.showNotification('Inventory full! Cannot return artifact to inventory.', 'warning');
                return;
            }
            
            // Return artifact to inventory
            this.state.artifacts.push(artifact);
            
            // Remove from exhibition
            delete this.state.exhibitedArtifacts[slotIndex];
            delete this.state.exhibitedArtifactsData[slotIndex];
            
            // Update displays
            this.generateExhibitionSlots();
            this.renderArtifacts();
            this.updateUI();
            
            this.showNotification('Artifact returned to inventory', 'info');
        }
    }

    generateTiles() {
        // Create 9 tiles in a 3x3 grid with multiple layers
        this.state.tiles.clear();
        
        const gridSize = 3;
        // Positions that will have a second layer (center and adjacent tiles)
        const secondLayerPositions = [
            { x: 1, y: 1 }, // center
            { x: 1, y: 0 }, // top center
            { x: 0, y: 1 }, // left center
            { x: 2, y: 1 }, // right center
            { x: 1, y: 2 }  // bottom center
        ];
        
        // Positions that will have a third layer (just center)
        const thirdLayerPositions = [
            { x: 1, y: 1 } // center only
        ];
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                // Base layer tile
                const tile = {
                    id: `tile_${x}_${y}_0`,
                    position: { x, y },
                    layer: 0,
                    excavated: false,
                    artifacts: [],
                    structure: 'none'
                };
                this.state.tiles.set(tile.id, tile);
                
                // Add second layer tile for certain positions
                if (secondLayerPositions.some(pos => pos.x === x && pos.y === y)) {
                    const secondLayerTile = {
                        id: `tile_${x}_${y}_1`,
                        position: { x, y },
                        layer: 1,
                        excavated: false,
                        artifacts: [],
                        structure: 'none'
                    };
                    this.state.tiles.set(secondLayerTile.id, secondLayerTile);
                }
                
                // Add third layer tile for center position
                if (thirdLayerPositions.some(pos => pos.x === x && pos.y === y)) {
                    const thirdLayerTile = {
                        id: `tile_${x}_${y}_2`,
                        position: { x, y },
                        layer: 2,
                        excavated: false,
                        artifacts: [],
                        structure: 'none'
                    };
                    this.state.tiles.set(thirdLayerTile.id, thirdLayerTile);
                }
            }
        }
        
        console.log(`Generated ${this.state.tiles.size} tiles in 3x3 grid with multiple layers`);
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
        const center = Math.floor(gridSize / 2);
        
        // First, find the highest layer for each position
        const maxLayerByPosition = new Map();
        this.state.tiles.forEach((tile) => {
            const posKey = `${tile.position.x}_${tile.position.y}`;
            const currentMax = maxLayerByPosition.get(posKey) || -1;
            if ((tile.layer || 0) > currentMax) {
                maxLayerByPosition.set(posKey, tile.layer || 0);
            }
        });
        
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
            
            // Add structure icon if tile has a structure (only on top layer)
            // Calculate this before the positioning code
            const posKeyForStructure = `${tile.position.x}_${tile.position.y}`;
            const maxLayerForStructure = maxLayerByPosition.get(posKeyForStructure) || 0;
            const isTopLayerForStructure = (tile.layer || 0) === maxLayerForStructure;
            
            if (isTopLayerForStructure && tile.structure && tile.structure !== 'none') {
                const structureIcon = document.createElement('div');
                structureIcon.className = 'tile-structure';
                if (tile.structure === 'tent') {
                    structureIcon.textContent = '⛺';
                    structureIcon.title = 'Tent';
                } else if (tile.structure === 'dig_house') {
                    structureIcon.textContent = '🏠';
                    structureIcon.title = 'Dig House';
                }
                tileElement.appendChild(structureIcon);
            }

            // Calculate isometric position (isometric projection)
            // For a 3x3 grid, center it in the container
            const tileWidth = 120;
            const tileHeight = 60;
            const spacingX = 85; // Horizontal spacing in isometric view
            const spacingY = 42; // Vertical spacing in isometric view
            const layerOffset = -15; // Vertical offset per layer (negative = higher)
            
            // Isometric projection: x and y affect both horizontal and vertical position
            // Formula: isoX = (x - y) * spacing, isoY = (x + y) * spacing/2
            const isoX = (tile.position.x - tile.position.y) * spacingX;
            const isoY = (tile.position.x + tile.position.y) * spacingY;
            
            // Adjust vertical position based on layer (higher layers are positioned higher)
            const layerAdjustment = (tile.layer || 0) * layerOffset;
            
            // Center in container (use 50% positioning)
            // Account for rotated diamond dimensions
            tileElement.style.left = `calc(50% + ${isoX - tileWidth/2}px)`;
            tileElement.style.top = `calc(50% + ${isoY - tileHeight/2 + layerAdjustment}px)`;
            tileElement.style.zIndex = (tile.layer || 0) + 1; // Higher layers have higher z-index
            
            // Only the topmost tile at each position is selectable
            const posKey = `${tile.position.x}_${tile.position.y}`;
            const maxLayer = maxLayerByPosition.get(posKey) || 0;
            const isTopLayer = (tile.layer || 0) === maxLayer;
            
            if (!isTopLayer) {
                tileElement.classList.add('non-selectable');
                tileElement.style.pointerEvents = 'none';
                tileElement.style.opacity = '0.6'; // Make lower layers slightly transparent
            } else {
                tileElement.addEventListener('click', () => {
                    this.toggleTileSelection(tileId);
                });
            }

            container.appendChild(tileElement);
        });
    }

    toggleTileSelection(tileId) {
        // Handle structure placement
        if (this.state.selectedStructure) {
            this.placeStructure(tileId, this.state.selectedStructure);
            return;
        }

        // Handle excavation method selection
        if (!this.state.selectedExcavationMethod && !this.state.selectedStructure) {
            this.showNotification('Please select an excavation method or structure first!', 'info');
            return;
        }

        if (!this.state.selectedExcavationMethod) {
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

    placeStructure(tileId, structureType) {
        const player = this.playerModel.getPlayer();
        const tile = this.state.tiles.get(tileId);
        if (!tile) return;

        // Check if any tile at this position already has a structure
        const posKey = `${tile.position.x}_${tile.position.y}`;
        let hasStructure = false;
        this.state.tiles.forEach((t) => {
            if (`${t.position.x}_${t.position.y}` === posKey && t.structure && t.structure !== 'none') {
                hasStructure = true;
            }
        });

        if (hasStructure) {
            this.showNotification('This position already has a structure!', 'info');
            return;
        }

        const costs = {
            'tent': 100,
            'dig_house': 500
        };
        const storageBonuses = {
            'tent': 10,
            'dig_house': 100
        };

        const cost = costs[structureType];
        const storageBonus = storageBonuses[structureType];

        if (!cost || !storageBonus) {
            this.showNotification('Invalid structure type!', 'error');
            return;
        }

        if (player.money < cost) {
            this.showNotification(`Insufficient funds! Need $${cost}`, 'error');
            return;
        }

        // Spend money
        this.playerModel.spendMoney(cost);

        // Update tile structure (update all layers at this position)
        this.state.tiles.forEach((t, id) => {
            if (`${t.position.x}_${t.position.y}` === posKey) {
                t.structure = structureType;
            }
        });

        // Increase storage capacity
        this.state.storageCapacity += storageBonus;

        // Update UI
        this.updateUI();
        this.renderTiles();
        this.showNotification(`${structureType === 'tent' ? 'Tent' : 'Dig House'} placed! +${storageBonus} storage`, 'success');
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
        if (this.state.artifacts.length < this.state.storageCapacity) {
            this.state.artifacts.push(artifact);
        } else {
            this.showNotification('Storage full! Build a tent or dig house to increase capacity.', 'warning');
        }
    }

    // createInventorySlots and updateInventoryDisplay removed - merged into renderArtifacts

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
        const container = document.getElementById('inventory-grid');
        if (!container) return;
        
        container.innerHTML = '';

        if (this.state.artifacts.length === 0) {
            // Show empty slots based on storage capacity
            for (let i = 0; i < this.state.storageCapacity; i++) {
                const slot = document.createElement('div');
                slot.className = 'artifact-icon-slot';
                slot.style.opacity = '0.3';
                container.appendChild(slot);
            }
            // Update inventory count in top bar
            document.getElementById('inventory-count').textContent = `0 / ${this.state.storageCapacity}`;
            return;
        }

        this.state.artifacts.forEach(artifact => {
            const slot = document.createElement('div');
            slot.className = 'artifact-icon-slot';
            slot.dataset.artifactId = artifact.id;
            
            // Add rarity class
            if (artifact.rarity) {
                slot.classList.add(`rarity-${artifact.rarity}`);
            }
            
            if (artifact.identified) {
                slot.classList.add('identified');
            } else {
                slot.classList.add('unidentified');
            }

            // Icon
            const icon = document.createElement('div');
            icon.textContent = this.getArtifactIcon(artifact.type);
            slot.appendChild(icon);

            // Click handler to show tooltip
            slot.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showArtifactTooltip(artifact, slot);
            });

            container.appendChild(slot);
        });

        // Fill remaining slots with empty placeholders
        const remaining = this.state.storageCapacity - this.state.artifacts.length;
        for (let i = 0; i < remaining; i++) {
            const slot = document.createElement('div');
            slot.className = 'artifact-icon-slot';
            slot.style.opacity = '0.3';
            container.appendChild(slot);
        }

        // Update inventory count in top bar
        document.getElementById('inventory-count').textContent = `${this.state.artifacts.length} / ${this.state.storageCapacity}`;
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
        this.showNotification(`Sold ${artifact.name} for $${artifact.value}`, 'success');
    }

    updateUI() {
        const player = this.playerModel.getPlayer();
        document.getElementById('money').textContent = player.money;
        document.getElementById('workers').textContent = player.workers;
        document.getElementById('archaeologists').textContent = player.archaeologists;
        document.getElementById('linguists').textContent = player.linguists;
        // Update inventory count with current storage capacity
        const inventoryCountEl = document.getElementById('inventory-count');
        if (inventoryCountEl) {
            inventoryCountEl.textContent = `${this.state.artifacts.length} / ${this.state.storageCapacity}`;
        }
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

    showArtifactTooltip(artifact, slotElement) {
        // Remove any existing tooltip
        const existingTooltip = document.querySelector('.artifact-tooltip-popup');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'artifact-tooltip-popup';
        if (artifact.identified) {
            tooltip.classList.add('identified');
        }

        // Get rarity display name
        const rarityNames = {
            'common': 'Common',
            'uncommon': 'Uncommon',
            'rare': 'Rare',
            'very_rare': 'Very Rare',
            'legendary': 'Legendary'
        };
        const rarityName = rarityNames[artifact.rarity] || 'Common';
        
        tooltip.innerHTML = `
            <div class="artifact-tooltip-close" onclick="this.parentElement.remove()">×</div>
            <div class="artifact-tooltip-header">
                <div class="artifact-tooltip-icon">${this.getArtifactIcon(artifact.type)}</div>
                <div class="artifact-tooltip-title">${artifact.name}</div>
                <div class="artifact-tooltip-rarity rarity-${artifact.rarity || 'common'}">${rarityName}</div>
                <div class="artifact-tooltip-value">$${artifact.value}</div>
            </div>
            <div class="artifact-tooltip-details">
                <p><strong>Provenience:</strong> ${artifact.provenience}</p>
                <p><strong>Style:</strong> ${artifact.style}</p>
                <p><strong>Material:</strong> ${artifact.material}</p>
                <p><strong>Age:</strong> ${artifact.age}</p>
                ${artifact.inscription ? `<p><strong>Inscription:</strong> ${artifact.inscription}</p>` : ''}
                ${artifact.set ? `<p><strong>Part of Set:</strong> ${artifact.set}</p>` : ''}
            </div>
            ${artifact.bonuses.length > 0 ? `
                <div class="artifact-tooltip-bonuses">
                    ${artifact.bonuses.map(b => `<div class="bonus-item">+${b.value} ${b.type}</div>`).join('')}
                </div>
            ` : ''}
            <div class="artifact-tooltip-actions">
                ${!artifact.identified && ['rare', 'very_rare', 'legendary'].includes(artifact.rarity) ? `
                    <button class="artifact-btn identify-btn" onclick="gameController.identifyArtifact('${artifact.id}'); this.closest('.artifact-tooltip-popup').remove();">
                        Identify
                    </button>
                ` : ''}
                <button class="artifact-btn sell-btn" onclick="gameController.sellArtifact('${artifact.id}'); this.closest('.artifact-tooltip-popup').remove();">
                    Sell ($${artifact.value})
                </button>
            </div>
        `;

        document.body.appendChild(tooltip);

        // Position tooltip to be visible
        const slotRect = slotElement.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = slotRect.right + 10;
        let top = slotRect.top + (slotRect.height / 2) - (tooltipRect.height / 2);

        // If tooltip would go off right edge, show on left side
        if (left + tooltipRect.width > viewportWidth - 10) {
            left = slotRect.left - tooltipRect.width - 10;
        }

        // If tooltip would go off bottom, adjust upward
        if (top + tooltipRect.height > viewportHeight - 10) {
            top = viewportHeight - tooltipRect.height - 10;
        }

        // If tooltip would go off top, adjust downward
        if (top < 10) {
            top = 10;
        }

        // Ensure it doesn't go off left edge
        if (left < 10) {
            left = 10;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;

        // Close on click outside
        setTimeout(() => {
            const closeOnOutsideClick = (e) => {
                if (!tooltip.contains(e.target) && !slotElement.contains(e.target)) {
                    tooltip.remove();
                    document.removeEventListener('click', closeOnOutsideClick);
                }
            };
            document.addEventListener('click', closeOnOutsideClick);
        }, 10);
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

