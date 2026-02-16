import { T, S, AS, CFG, MAP, isMobile } from '../config.js';

class GameScene extends Phaser.Scene {
    constructor() { super('GameScene'); }

    create() {
        this.hasKey = false;
        this.cellDoorOpen = false;
        this.exitDoorOpen = false;
        this.puzzleActive = false;
        this.escaped = false;
        this.nearDoor = null;
        this.playerDir = 'down';
        this.playerAnimTime = 0;
        this.actionPressed = false;

        this.cameras.main.setBackgroundColor('#0a0a0a');

        this.walls = this.physics.add.staticGroup();
        this.doors = [];
        this.interactables = [];
        this.lockers = [];
        this.crates = [];
        this.fences = [];
        this.securityPanels = [];
        // new tile arrays
        this.safeTiles = [];
        this.binaryPanelTiles = [];
        this.cipherTiles = [];
        this.computerTiles = [];
        this.scheduleTiles = [];
        this.wirePuzzleTiles = [];
        this.patternDoors = [];
        this.tallyTiles = [];
        this.morseTiles = [];
        this.pressurePlates = [];
        this.pushableCrates = [];
        this.graffitiTiles = [];
        this.diarySpawnPoints = [];
        this.cheeseSpawnPoints = [];

        for (let row = 0; row < MAP.length; row++) {
            for (let col = 0; col < MAP[row].length; col++) {
                const x = col * T + T / 2;
                const y = row * T + T / 2;
                const tile = MAP[row][col];

                if (tile === 1) {
                    this.walls.create(x, y, 'wall').setDisplaySize(T, T).refreshBody();
                } else if (tile === 2) {
                    this.walls.create(x, y, 'bars').setDisplaySize(T, T).refreshBody();
                } else if (tile === 3) {
                    this.add.image(x, y, 'floor').setDisplaySize(T, T);
                    const door = this.physics.add.staticImage(x, y, 'door_locked').setDisplaySize(T, T).refreshBody();
                    door.setData('type', 'door');
                    door.setData('row', row);
                    door.setData('col', col);
                    this.doors.push(door);
                    this.walls.add(door);
                } else if (tile === 4) {
                    this.add.image(x, y, 'bed').setDisplaySize(T, T);
                } else if (tile === 5) {
                    this.add.image(x, y, 'toilet').setDisplaySize(T, T);
                } else if (tile === 6) {
                    this.add.image(x, y, 'vent').setDisplaySize(T, T);
                    const ventZone = this.add.zone(x, y, T, T);
                    this.physics.add.existing(ventZone, true);
                    ventZone.setData('type', 'vent');
                    this.interactables.push(ventZone);
                } else if (tile === 7) {
                    this.add.image(x, y, 'floor').setDisplaySize(T, T);
                    this.walls.create(x, y, 'table').setDisplaySize(T, T).refreshBody();
                } else if (tile === 8) {
                    this.add.image(x, y, 'floor').setDisplaySize(T, T);
                    const locker = this.physics.add.staticImage(x, y, 'locker').setDisplaySize(T, T).refreshBody();
                    locker.setData('type', 'locker');
                    locker.setData('row', row);
                    locker.setData('col', col);
                    locker.setData('searched', false);
                    this.walls.add(locker);
                    this.lockers.push(locker);
                } else if (tile === 9) {
                    this.add.image(x, y, 'floor').setDisplaySize(T, T);
                    const crate = this.physics.add.staticImage(x, y, 'crate').setDisplaySize(T, T).refreshBody();
                    crate.setData('type', 'crate');
                    crate.setData('row', row);
                    crate.setData('col', col);
                    crate.setData('searched', false);
                    this.walls.add(crate);
                    this.crates.push(crate);
                } else if (tile === 10) {
                    this.add.image(x, y, 'floor_dirty').setDisplaySize(T, T);
                    const fence = this.physics.add.staticImage(x, y, 'fence').setDisplaySize(T, T).refreshBody();
                    fence.setData('type', 'fence');
                    fence.setData('row', row);
                    fence.setData('col', col);
                    fence.setData('cut', false);
                    this.walls.add(fence);
                    this.fences.push(fence);
                } else if (tile === 11) {
                    this.walls.create(x, y, 'security_panel').setDisplaySize(T, T).refreshBody();
                    this.securityPanels.push({ x, y, row, col });
                } else if (tile === 12) {
                    this.add.image(x, y, 'floor_dirty').setDisplaySize(T, T);
                } else if (tile === 13) {
                    this.add.image(x, y, 'floor_dirty').setDisplaySize(T, T);
                    this.walls.create(x, y, 'safe').setDisplaySize(T, T).refreshBody();
                    this.safeTiles.push({ x, y, row, col });
                } else if (tile === 14) {
                    this.add.image(x, y, 'floor_dirty').setDisplaySize(T, T);
                    // diary page — created as pickup zone after map loop
                    this.diarySpawnPoints.push({ x, y, row, col, idx: this.diarySpawnPoints.length });
                } else if (tile === 15) {
                    this.add.image(x, y, 'floor_dirty').setDisplaySize(T, T);
                    this.walls.create(x, y, 'binary_panel').setDisplaySize(T, T).refreshBody();
                    this.binaryPanelTiles.push({ x, y, row, col });
                } else if (tile === 16) {
                    this.add.image(x, y, 'floor_dirty').setDisplaySize(T, T);
                    this.walls.create(x, y, 'cipher_station').setDisplaySize(T, T).refreshBody();
                    this.cipherTiles.push({ x, y, row, col });
                } else if (tile === 17) {
                    this.add.image(x, y, 'floor_dirty').setDisplaySize(T, T);
                    this.walls.create(x, y, 'computer').setDisplaySize(T, T).refreshBody();
                    this.computerTiles.push({ x, y, row, col });
                } else if (tile === 18) {
                    this.add.image(x, y, 'floor').setDisplaySize(T, T);
                    this.walls.create(x, y, 'schedule_board').setDisplaySize(T, T).refreshBody();
                    this.scheduleTiles.push({ x, y, row, col });
                } else if (tile === 19) {
                    this.add.image(x, y, 'floor_dirty').setDisplaySize(T, T);
                    this.walls.create(x, y, 'wire_puzzle').setDisplaySize(T, T).refreshBody();
                    this.wirePuzzleTiles.push({ x, y, row, col });
                } else if (tile === 20) {
                    this.add.image(x, y, 'floor').setDisplaySize(T, T);
                    const pdoor = this.physics.add.staticImage(x, y, 'pattern_door').setDisplaySize(T, T).refreshBody();
                    pdoor.setData('type', 'pattern_door');
                    pdoor.setData('row', row); pdoor.setData('col', col);
                    this.walls.add(pdoor);
                    this.patternDoors.push(pdoor);
                } else if (tile === 21) {
                    this.add.image(x, y, 'floor_dirty').setDisplaySize(T, T);
                    this.walls.create(x, y, 'tally_wall').setDisplaySize(T, T).refreshBody();
                    this.tallyTiles.push({ x, y, row, col });
                } else if (tile === 22) {
                    this.add.image(x, y, 'floor_dirty').setDisplaySize(T, T);
                    this.cheeseSpawnPoints.push({ x, y, row, col });
                } else if (tile === 23) {
                    this.add.image(x, y, 'floor_dirty').setDisplaySize(T, T);
                    this.walls.create(x, y, 'morse_radio').setDisplaySize(T, T).refreshBody();
                    this.morseTiles.push({ x, y, row, col });
                } else if (tile === 24) {
                    this.add.image(x, y, 'pressure_plate').setDisplaySize(T, T);
                    this.pressurePlates.push({ x, y, row, col, occupied: false });
                } else if (tile === 25) {
                    this.add.image(x, y, 'floor_dirty').setDisplaySize(T, T);
                    const pcrate = this.physics.add.staticImage(x, y, 'pushable_crate').setDisplaySize(T, T).refreshBody();
                    pcrate.setData('type', 'pushable_crate');
                    pcrate.setData('row', row); pcrate.setData('col', col);
                    this.walls.add(pcrate);
                    this.pushableCrates.push(pcrate);
                } else if (tile === 26) {
                    this.walls.create(x, y, 'graffiti_wall').setDisplaySize(T, T).refreshBody();
                    this.graffitiTiles.push({ x, y, row, col, idx: this.graffitiTiles.length });
                } else {
                    this.add.image(x, y, 'floor').setDisplaySize(T, T);
                }
            }
        }

        for (let row = 0; row < MAP.length; row++) {
            for (let col = 0; col < MAP[row].length; col++) {
                if (MAP[row][col] === 1 && row + 1 < MAP.length && MAP[row+1][col] !== 1) {
                    this.add.rectangle(
                        col * T + T/2, (row+1) * T + 4, T, 8, 0x000000, 0.25
                    ).setDepth(1);
                }
            }
        }

        const keyX = 2 * T + T / 2;
        const keyY = 1 * T + T / 2 + 6;
        this.keySprite = this.add.image(keyX, keyY, 'key').setScale(0.9 * AS).setDepth(2);
        this.keyGlow = this.add.image(keyX, keyY, 'particle').setScale(3 * AS).setAlpha(0.3).setTint(0xffdd44).setDepth(1);
        this.tweens.add({ targets: this.keyGlow, alpha: 0.1, scale: 4 * AS, duration: 1000, yoyo: true, repeat: -1 });

        const keyZone = this.add.zone(keyX, keyY, T, T);
        this.physics.add.existing(keyZone, true);
        keyZone.setData('type', 'key');
        this.interactables.push(keyZone);

        const hintX = 16 * T + T / 2;
        const hintY = 2 * T + T / 2;
        this.hintSprite = this.add.image(hintX, hintY, 'hint').setScale(0.7 * AS).setDepth(2);
        const hintZone = this.add.zone(hintX, hintY, T, T);
        this.physics.add.existing(hintZone, true);
        hintZone.setData('type', 'hint');
        this.interactables.push(hintZone);

        const kcX = 3 * T + T / 2;
        const kcY = 15 * T + T / 2;
        this.keycardSprite = this.add.image(kcX, kcY, 'keycard').setScale(1.2 * AS).setDepth(2);
        this.keycardGlow = this.add.image(kcX, kcY, 'particle').setScale(2.5 * AS).setAlpha(0.25).setTint(0x4488ff).setDepth(1);
        this.tweens.add({ targets: this.keycardGlow, alpha: 0.08, scale: 3.5 * AS, duration: 1200, yoyo: true, repeat: -1 });
        const kcZone = this.add.zone(kcX, kcY, T, T);
        this.physics.add.existing(kcZone, true);
        kcZone.setData('type', 'keycard');
        this.interactables.push(kcZone);

        // Diary page pickups
        this.diarySprites = [];
        this.diaryGlows = [];
        this.diarySpawnPoints.forEach((sp, idx) => {
            const dSprite = this.add.image(sp.x, sp.y, 'diary_page').setScale(0.8 * AS).setDepth(2);
            const dGlow = this.add.image(sp.x, sp.y, 'particle').setScale(2 * AS).setAlpha(0.2).setTint(0xffddaa).setDepth(1);
            this.tweens.add({ targets: dGlow, alpha: 0.08, scale: 2.8 * AS, duration: 1100, yoyo: true, repeat: -1 });
            this.diarySprites.push(dSprite);
            this.diaryGlows.push(dGlow);
            const dZone = this.add.zone(sp.x, sp.y, T, T);
            this.physics.add.existing(dZone, true);
            dZone.setData('type', 'diary');
            dZone.setData('idx', idx);
            this.interactables.push(dZone);
        });

        // Cheese pickup
        this.cheeseSprites = [];
        this.cheeseGlows = [];
        this.cheeseSpawnPoints.forEach(sp => {
            const cSprite = this.add.image(sp.x, sp.y, 'cheese').setScale(0.9 * AS).setDepth(2);
            const cGlow = this.add.image(sp.x, sp.y, 'particle').setScale(1.8 * AS).setAlpha(0.2).setTint(0xffcc00).setDepth(1);
            this.tweens.add({ targets: cGlow, alpha: 0.06, scale: 2.5 * AS, duration: 900, yoyo: true, repeat: -1 });
            this.cheeseSprites.push(cSprite);
            this.cheeseGlows.push(cGlow);
            const cZone = this.add.zone(sp.x, sp.y, T, T);
            this.physics.add.existing(cZone, true);
            cZone.setData('type', 'cheese');
            this.interactables.push(cZone);
        });

        this.guard = this.physics.add.sprite(14 * T, 7 * T + T / 2, 'guard_down_0').setDisplaySize(T, T);
        this.guard.setImmovable(true);
        this.guard.body.setSize(CFG.guard.bodyW, CFG.guard.bodyH);
        this.guard.body.setOffset(CFG.guard.bodyOffX, CFG.guard.bodyOffY);
        this.guardAnimTime = 0;

        this.guardState = 'patrol';
        this.guardFacing = 'right';
        this.guardSpeed = CFG.guard.patrolSpeed;
        this.guardSuspiciousTimer = 0;
        this.guardChaseTimer = 0;
        this.guardLastKnownX = 0;
        this.guardLastKnownY = 0;
        this.guardWaypointIdx = 0;
        this.guardWaypoints = [
            { x: 14, y: 7 }, { x: 20, y: 7 }, { x: 20, y: 3 },
            { x: 14, y: 3 }, { x: 14, y: 7 }, { x: 14, y: 8 },
            { x: 8, y: 8 }, { x: 8, y: 3 }, { x: 14, y: 3 }
        ];

        this.visionCone = this.add.graphics().setDepth(3);

        this.guardIcon = this.add.text(this.guard.x, this.guard.y - 20, '', {
            fontSize: `${Math.round(16*S)}px`, fontFamily: 'monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(10);

        this.flashlight = this.add.image(this.guard.x + 20, this.guard.y + 10, 'flashlight')
            .setScale(CFG.flashlight.scale).setAlpha(CFG.flashlight.alpha).setDepth(3);

        this.player = this.physics.add.sprite(1 * T + T / 2, 3 * T + T / 2, 'player_down_0').setDisplaySize(T, T);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(CFG.player.bodyW, CFG.player.bodyH);
        this.player.body.setOffset(CFG.player.bodyOffX, CFG.player.bodyOffY);
        this.player.setDepth(5);
        this.physics.world.setBounds(0, 0, MAP[0].length * T, MAP.length * T);

        this.inventory = [];
        this.hiding = false;
        this.invulnerable = false;
        this.hasKeycard = false;
        this.hasWireCutters = false;
        this.hasScrewdriver = false;
        // new puzzle/element state
        this.gameStartTime = Date.now();
        this.safeOpen = false;
        this.binaryPanelSolved = false;
        this.binaryTarget = Phaser.Math.Between(1, 15);
        this.cipherSolved = false;
        this.patternDoorOpen = false;
        this.wirePuzzleSolved = false;
        this.crateGateOpen = false;
        this.tallySolved = false;
        this.morseSolved = false;
        this.scheduleViewed = false;
        this.hasCheese = false;
        this.hasRatBuddy = false;
        this.ratBuddySprite = null;
        this.ratDistractActive = false;
        this.diaryPages = [false, false, false, false, false];
        this.diaryPagesFound = 0;
        this.optionalPuzzlesSolved = 0;
        this.caughtCount = 0;

        this.physics.add.collider(this.player, this.walls);
        this.physics.add.collider(this.player, this.guard, () => this.getCaught());

        this.interactables.forEach(zone => {
            this.physics.add.overlap(this.player, zone, () => this.handleInteract(zone));
        });

        this.cameras.main.startFollow(this.player, true, CFG.camera.lerpX, CFG.camera.lerpY);
        this.cameras.main.setBounds(0, 0, MAP[0].length * T, MAP.length * T);
        this.cameras.main.setZoom(CFG.camera.zoom);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.touchVX = 0;
        this.touchVY = 0;
        this.mobile = isMobile();
        this.scene.launch('TouchUIScene');

        this.showMessage('You wake up in your cell. Find a way out...', 4000);

        this.SPEED = CFG.player.speed;

        const mapW = MAP[0].length * T;
        const mapH = MAP.length * T;
        // Use camera-sized darkness overlay instead of full-map for performance
        this.darkness = this.add.renderTexture(0, 0, this.scale.width, this.scale.height).setOrigin(0).setDepth(8);
        this.darkness.setBlendMode(Phaser.BlendModes.MULTIPLY);
        this.darkness.setScrollFactor(0); // Fixed to camera
        this.lightRadius = CFG.lighting.playerRadius;
        this.guardLightRadius = CFG.lighting.guardRadius;
        this.lightGfx = this.make.graphics({ add: false });
        this.guardLightGfx = this.make.graphics({ add: false });


        this.time.delayedCall(100, () => {
            const ui = this.scene.get('TouchUIScene');
            if (ui && ui.scene.isActive()) ui.addVignette();
        });

        // Dust particles limited to viewport area for performance
        this.dustParticles = this.add.particles(0, 0, 'particle', {
            emitZone: {
                source: new Phaser.Geom.Rectangle(-100, -100, this.scale.width + 200, this.scale.height + 200),
                type: 'random'
            },
            scale: { min: CFG.particles.dustScaleMin, max: CFG.particles.dustScaleMax },
            alpha: { start: 0, end: CFG.particles.dustAlphaEnd, ease: 'Sine.easeInOut' },
            lifespan: CFG.particles.dustLife,
            speed: { min: CFG.particles.dustSpeedMin, max: CFG.particles.dustSpeedMax },
            angle: { min: 250, max: 290 },
            frequency: CFG.particles.dustFreq * 2,  // Emit less frequently
            tint: CFG.particles.dustTint,
            blendMode: 'ADD'
        });
        this.dustParticles.setDepth(7).setScrollFactor(0);

        this.cameras.main.fadeIn(CFG.camera.fadeIn);

        this._cellDoors = [
            // Cell doors (row 5)
            ...([2, 6, 10].map(col =>
                this.doors.find(d => d.getData('row') === 5 && d.getData('col') === col)
            )),
            // Workshop + control room doors (row 9)
            this.doors.find(d => d.getData('row') === 9 && d.getData('col') === 10),
            this.doors.find(d => d.getData('row') === 9 && d.getData('col') === 17)
        ].filter(Boolean);
        this._gsDoor = this.doors.find(d => d.getData('row') === 6 && d.getData('col') === 26);
        this._gsDoor2 = this.doors.find(d => d.getData('row') === 3 && d.getData('col') === 22);
        this._bedPositions = [];
        for (let row = 0; row < MAP.length; row++) {
            for (let col = 0; col < MAP[row].length; col++) {
                if (MAP[row][col] === 4) {
                    this._bedPositions.push({ x: col * T + T / 2, y: row * T + T / 2 });
                }
            }
        }
        this._uiScene = null;

        this.events.on('shutdown', this._shutdown, this);
    }

    _shutdown() {
        if (this.lightGfx) { this.lightGfx.destroy(); this.lightGfx = null; }
        if (this.guardLightGfx) { this.guardLightGfx.destroy(); this.guardLightGfx = null; }
        if (this.dustParticles) { this.dustParticles.stop(); this.dustParticles.destroy(); this.dustParticles = null; }
    }

    _getUI() {
        if (!this._uiScene || !this._uiScene.scene.isActive()) {
            this._uiScene = this.scene.get('TouchUIScene');
        }
        return this._uiScene && this._uiScene.scene.isActive() ? this._uiScene : null;
    }

    showMessage(text, duration) {
        const ui = this._getUI();
        if (ui) ui.showMessage(text, duration);
    }

    showPrompt(text) {
        const ui = this._getUI();
        if (ui) ui.showPrompt(text);
    }

    hidePrompt() {
        const ui = this._getUI();
        if (ui) ui.hidePrompt();
    }

    updateInventory() {
        const ui = this.scene.get('TouchUIScene');
        if (ui && ui.scene.isActive()) ui.updateInventory(this.inventory);
    }

    handleInteract(zone) {
        if (this.puzzleActive || this.escaped) return;
        const type = zone.getData('type');

        if (type === 'key' && !this.hasKey) {
            this.hasKey = true;
            this.inventory.push('Cell Key');
            this.tweens.add({
                targets: [this.keySprite, this.keyGlow],
                alpha: 0, scale: 2, duration: 300,
                onComplete: () => { this.keySprite.destroy(); this.keyGlow.destroy(); }
            });
            zone.destroy();
            this.showMessage('Found a rusty key hidden under the bed!');
            this.updateInventory();
        }

        if (type === 'keycard' && !this.hasKeycard) {
            this.hasKeycard = true;
            this.inventory.push('Keycard');
            this.tweens.add({
                targets: [this.keycardSprite, this.keycardGlow],
                alpha: 0, scale: 2, duration: 300,
                onComplete: () => { this.keycardSprite.destroy(); this.keycardGlow.destroy(); }
            });
            zone.destroy();
            this.showMessage('Found a security keycard!');
            this.updateInventory();
        }

        if (type === 'hint' && !this.hintRead) {
            this.hintRead = true;
            this.showMessage('A note reads: "The code is the sequence shown backwards"', 5000);
        }

        if (type === 'diary') {
            const idx = zone.getData('idx');
            if (!this.diaryPages[idx]) {
                this.diaryPages[idx] = true;
                this.diaryPagesFound++;
                if (this.diarySprites[idx]) {
                    this.tweens.add({
                        targets: [this.diarySprites[idx], this.diaryGlows[idx]],
                        alpha: 0, scale: 2, duration: 300,
                        onComplete: () => {
                            this.diarySprites[idx].destroy();
                            this.diaryGlows[idx].destroy();
                        }
                    });
                }
                zone.destroy();
                if (this.diaryPagesFound === 1 && !this.inventory.includes('Diary')) {
                    this.inventory.push('Diary');
                    this.updateInventory();
                }
                this.showDiaryPage(idx);
            }
        }

        if (type === 'cheese' && !this.hasCheese) {
            this.hasCheese = true;
            this.inventory.push('Cheese');
            this.cheeseSprites.forEach(s => {
                this.tweens.add({
                    targets: s, alpha: 0, scale: 2, duration: 300,
                    onComplete: () => s.destroy()
                });
            });
            this.cheeseGlows.forEach(g => {
                this.tweens.add({
                    targets: g, alpha: 0, duration: 300,
                    onComplete: () => g.destroy()
                });
            });
            zone.destroy();
            this.showMessage('Found some cheese! Maybe a rat would like this...', 3000);
            this.updateInventory();
        }

        if (type === 'vent' && this.hasScrewdriver) {
            this.startVentMaze();
        } else if (type === 'vent' && !this.hasScrewdriver) {
            this.showMessage('The vent is screwed shut. Need a screwdriver.');
        }

    }

    getCaught() {
        if (this.escaped || this.puzzleActive || this.invulnerable || this.hiding || this.ratDistractActive) return;
        this.caughtCount++;
        const lostItems = [];
        if (this.hasKeycard) { this.hasKeycard = false; lostItems.push('Keycard'); }
        if (this.hasWireCutters) { this.hasWireCutters = false; lostItems.push('Wire Cutters'); }
        if (this.hasScrewdriver) { this.hasScrewdriver = false; lostItems.push('Screwdriver'); }
        if (this.hasCheese) { this.hasCheese = false; lostItems.push('Cheese'); }
        this.inventory = this.inventory.filter(i => i === 'Cell Key' || i === 'Diary');

        const msg = lostItems.length > 0
            ? `Caught! Contraband confiscated: ${lostItems.join(', ')}`
            : 'Caught by the guard! Back to your cell...';
        this.showMessage(msg, 3000);
        this.cameras.main.shake(CFG.camera.shakeMs, CFG.camera.shakeIntensity);
        this.cameras.main.flash(CFG.camera.flashMs, 255, 0, 0);
        this.player.setPosition(1 * T + T / 2, 3 * T + T / 2);

        // Move rat buddy near player if it exists
        if (this.hasRatBuddy && this.ratBuddySprite) {
            this.ratBuddySprite.setPosition(1 * T + T / 2 + T, 3 * T + T / 2);
        }

        this.guardState = 'patrol';
        this.guardWaypointIdx = 0;

        this.invulnerable = true;
        this.time.delayedCall(CFG.caught.invulnTime, () => { this.invulnerable = false; });
        this.updateInventory();
    }

    openSecurityDoor() {
        if (this.exitDoorOpen) return;
        const secDoor = this.doors.find(d => d.getData('row') === 6 && d.getData('col') === 26);
        if (secDoor && secDoor.body && secDoor.body.enable) this.openDoor(secDoor);
        const utilDoor = this.doors.find(d => d.getData('row') === 15 && d.getData('col') === 16);
        if (utilDoor && utilDoor.body && utilDoor.body.enable) this.openDoor(utilDoor);
        this.exitDoorOpen = true;
    }

    openDoor(door) {
        door.setTexture('door_unlocked').setDisplaySize(T, T);
        this.walls.remove(door);
        door.body.enable = false;
        for (let i = 0; i < CFG.particles.doorBurst; i++) {
            const p = this.add.image(door.x, door.y, 'particle')
                .setScale(0.5 * AS).setAlpha(0.8).setTint(0xffaa44).setDepth(15);
            this.tweens.add({
                targets: p,
                x: door.x + Phaser.Math.Between(-CFG.particles.doorSpread, CFG.particles.doorSpread),
                y: door.y + Phaser.Math.Between(-CFG.particles.doorSpread, CFG.particles.doorSpread),
                alpha: 0, scale: 0, duration: CFG.particles.doorFadeDur,
                onComplete: () => p.destroy()
            });
        }
    }

    startPuzzle() {
        if (this.puzzleActive) return;
        this.puzzleActive = true;
        this.player.setVelocity(0);

        const ui = this.scene.get('TouchUIScene');
        const s = ui || this;
        const w = s.scale.width;
        const h = s.scale.height;
        const cx = w / 2;
        const cy = h / 2;

        const overlay = s.add.rectangle(cx, cy, w, h, 0x000000, CFG.puzzle.overlayAlpha).setDepth(500);

        const panelW = CFG.puzzle.panelW, panelH = CFG.puzzle.panelH;
        const panel = s.add.rectangle(cx, cy, panelW, panelH, 0x111822, 0.95)
            .setDepth(501).setStrokeStyle(Math.round(1*S), 0x334455);

        const title = s.add.text(cx, cy - 110*S, 'SECURITY PANEL', {
            fontSize: `${Math.round(20*S)}px`, fontFamily: 'monospace', color: '#00cc66',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(502);

        const subtitle = s.add.text(cx, cy - 85*S, 'Memorize, enter BACKWARDS', {
            fontSize: `${Math.round(12*S)}px`, fontFamily: 'monospace', color: '#667788'
        }).setOrigin(0.5).setDepth(502);

        for (let sy = cy - panelH/2; sy < cy + panelH/2; sy += 4*S) {
            s.add.rectangle(cx, sy, panelW - 4*S, 1, 0x000000, 0.08).setDepth(503);
        }

        const colors = [0xff4444, 0x44dd44, 0x4488ff, 0xffdd44];
        const colorNames = ['R', 'G', 'B', 'Y'];
        const seqLen = CFG.puzzle.seqLen;
        const sequence = [];
        for (let i = 0; i < seqLen; i++) sequence.push(Math.floor(Math.random() * 4));
        const answer = [...sequence].reverse();

        const seqDisplay = s.add.text(cx, cy - 55*S, 'LOADING...', {
            fontSize: `${Math.round(14*S)}px`, fontFamily: 'monospace', color: '#aabbcc'
        }).setOrigin(0.5).setDepth(502);

        const showBoxes = [];
        for (let i = 0; i < seqLen; i++) {
            const box = s.add.rectangle(
                cx - 60*S + i * 40*S, cy - 20*S, 30*S, 30*S, 0x1a2233
            ).setDepth(502).setStrokeStyle(Math.round(1*S), 0x334455);
            showBoxes.push(box);
        }

        const puzzleElements = [overlay, panel, title, subtitle, seqDisplay, ...showBoxes];
        const gameScene = this;

        s.time.delayedCall(CFG.puzzle.showDelay, () => {
            seqDisplay.setText('WATCH...');
            let showIdx = 0;
            const showTimer = s.time.addEvent({
                delay: CFG.puzzle.stepDelay,
                callback: () => {
                    if (showIdx > 0) {
                        showBoxes[showIdx - 1].setFillStyle(0x1a2233);
                        showBoxes[showIdx - 1].setStrokeStyle(Math.round(1*S), 0x334455);
                    }
                    if (showIdx < seqLen) {
                        showBoxes[showIdx].setFillStyle(colors[sequence[showIdx]]);
                        showBoxes[showIdx].setStrokeStyle(Math.round(2*S), 0xffffff);
                        showIdx++;
                    } else {
                        showTimer.remove();
                        showBoxes.forEach(b => { b.setFillStyle(0x1a2233); b.setStrokeStyle(Math.round(1*S), 0x334455); });
                        seqDisplay.setText('ENTER REVERSED:').setColor('#ffaa44');
                        showInput();
                    }
                },
                repeat: seqLen
            });
        });

        const playerInput = [];

        const showInput = () => {
            const btnSize = 50*S;
            const buttons = [];
            for (let i = 0; i < 4; i++) {
                const bx = cx - 75*S + i * 50*S;
                const by = cy + 30*S;

                const btn = s.add.rectangle(bx, by, btnSize, btnSize, colors[i])
                    .setDepth(502).setStrokeStyle(Math.round(2*S), 0xffffff)
                    .setInteractive({ useHandCursor: true });

                btn.on('pointerover', () => btn.setScale(1.1));
                btn.on('pointerout', () => btn.setScale(1));
                btn.on('pointerdown', () => {
                    playerInput.push(i);
                    btn.setScale(0.9);
                    s.time.delayedCall(100, () => btn.setScale(1));

                    if (playerInput.length <= seqLen) {
                        showBoxes[playerInput.length - 1].setFillStyle(colors[i]);
                    }
                    if (playerInput.length === seqLen) {
                        const correct = playerInput.every((v, idx) => v === answer[idx]);
                        if (correct) {
                            seqDisplay.setText('ACCESS GRANTED').setColor('#00ff66');
                            panel.setStrokeStyle(Math.round(2*S), 0x00ff66);
                            s.time.delayedCall(CFG.puzzle.resultDelay, () => {
                                puzzleElements.forEach(e => e.destroy());
                                buttons.forEach(b => b.destroy());
                                gameScene.puzzleActive = false;
                                gameScene.openSecurityDoor();
                                gameScene.showMessage('Security door open! Search for tools.', 4000);
                            });
                        } else {
                            seqDisplay.setText('ACCESS DENIED').setColor('#ff2222');
                            panel.setStrokeStyle(Math.round(2*S), 0xff2222);
                            gameScene.cameras.main.shake(150, 0.005);
                            s.time.delayedCall(CFG.puzzle.resultDelay, () => {
                                puzzleElements.forEach(e => e.destroy());
                                buttons.forEach(b => b.destroy());
                                gameScene.puzzleActive = false;
                                gameScene.showMessage('Wrong code! Try again...');
                            });
                        }
                    }
                });

                const label = s.add.text(bx, by, colorNames[i], {
                    fontSize: `${Math.round(16*S)}px`, fontFamily: 'monospace', color: '#000',
                    fontStyle: 'bold'
                }).setOrigin(0.5).setDepth(503);

                buttons.push(btn, label);
                puzzleElements.push(btn, label);
            }

            const closeBtn = s.add.text(cx, cy + 85*S, '[ CANCEL ]', {
                fontSize: `${Math.round(16*S)}px`, fontFamily: 'monospace', color: '#666677',
                padding: { x: Math.round(20*S), y: Math.round(12*S) }
            }).setOrigin(0.5).setDepth(502).setInteractive({ useHandCursor: true });

            closeBtn.on('pointerdown', () => {
                puzzleElements.forEach(e => e.destroy());
                buttons.forEach(b => b.destroy());
                closeBtn.destroy();
                gameScene.puzzleActive = false;
            });
            puzzleElements.push(closeBtn);
        };
    }

    // --- GRAFFITI MESSAGES ---
    _graffitiMsgs() {
        return [
            "The safe code has 3 digits. First one: 36 / 9",
            "Binary is just 1s and 0s. How hard can it be?",
            "The guard naps at 3 PM. Every. Single. Day.",
            "Don't trust the toilet in cell 2. Just don't.",
            "10 - 8 = the third digit you seek",
            "Roses are red, walls are gray, check the workshop for a way",
            "Sir Squeaks lives in the basement. Feed him cheese!",
            "The vent leads to freedom... if you can find your way",
        ];
    }

    // --- DIARY PAGE CONTENT ---
    _diaryContent() {
        return [
            "Day 1: They put me in cell 3. The bed smells like feet.\nFound a key under the mattress but dropped it somewhere.",
            "Day 47: I figured out the safe code!\nFirst digit: 36 divided by 9.\nNow I need the other two...",
            "Day 100: Dear Diary, today's lunch was...\nactually this is just a grocery list:\nMilk, Bread, 47 Bananas, Freedom",
            "Day 203: Roses are red,\nWalls are gray,\nI've been in prison\nFor way too many days.\n(I'm not a good poet)",
            "Day 365: The guard's schedule is like clockwork.\nPatrol at 3, nap at 3:01. Some guard.\nAlso the morse radio keeps saying something about pizza?",
        ];
    }

    // --- MATH COMBINATION SAFE ---
    startSafePuzzle() {
        if (this.puzzleActive || this.safeOpen) return;
        this.puzzleActive = true;
        this.player.setVelocity(0);
        const ui = this.scene.get('TouchUIScene');
        const s = ui || this;
        const w = s.scale.width, h = s.scale.height, cx = w/2, cy = h/2;
        const gameScene = this;
        const els = [];
        const code = CFG.safe.combination;
        const digits = [0, 0, 0];

        els.push(s.add.rectangle(cx, cy, w, h, 0x000000, CFG.puzzle.overlayAlpha).setDepth(500));
        els.push(s.add.rectangle(cx, cy, CFG.safe.panelW, CFG.safe.panelH, 0x111822, 0.95).setDepth(501).setStrokeStyle(Math.round(1*S), 0x334455));
        els.push(s.add.text(cx, cy-130*S, 'COMBINATION SAFE', { fontSize: `${Math.round(20*S)}px`, fontFamily: 'monospace', color: '#44ff44', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502));
        els.push(s.add.text(cx, cy-105*S, 'Enter the 3-digit code', { fontSize: `${Math.round(11*S)}px`, fontFamily: 'monospace', color: '#667788' }).setOrigin(0.5).setDepth(502));

        const digitTexts = [];
        for (let i = 0; i < 3; i++) {
            const dx = cx - 60*S + i * 60*S;
            // digit display
            const bg = s.add.rectangle(dx, cy-40*S, 40*S, 50*S, 0x1a2233).setDepth(502).setStrokeStyle(Math.round(1*S), 0x445566);
            els.push(bg);
            const dt = s.add.text(dx, cy-40*S, '0', { fontSize: `${Math.round(32*S)}px`, fontFamily: 'monospace', color: '#44ff44', fontStyle: 'bold' }).setOrigin(0.5).setDepth(503);
            digitTexts.push(dt); els.push(dt);
            // up arrow
            const up = s.add.text(dx, cy-72*S, '\u25B2', { fontSize: `${Math.round(20*S)}px`, fontFamily: 'monospace', color: '#88aacc' }).setOrigin(0.5).setDepth(503).setInteractive({ useHandCursor: true });
            up.on('pointerdown', () => { digits[i] = (digits[i] + 1) % 10; dt.setText('' + digits[i]); });
            els.push(up);
            // down arrow
            const dn = s.add.text(dx, cy-8*S, '\u25BC', { fontSize: `${Math.round(20*S)}px`, fontFamily: 'monospace', color: '#88aacc' }).setOrigin(0.5).setDepth(503).setInteractive({ useHandCursor: true });
            dn.on('pointerdown', () => { digits[i] = (digits[i] + 9) % 10; dt.setText('' + digits[i]); });
            els.push(dn);
        }

        const resultText = s.add.text(cx, cy+25*S, '', { fontSize: `${Math.round(12*S)}px`, fontFamily: 'monospace', color: '#ff4444', align: 'center', wordWrap: { width: 280*S } }).setOrigin(0.5).setDepth(503);
        els.push(resultText);

        const openBtn = s.add.text(cx, cy+60*S, '[ OPEN ]', { fontSize: `${Math.round(20*S)}px`, fontFamily: 'monospace', color: '#44ff44', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502).setInteractive({ useHandCursor: true });
        openBtn.on('pointerdown', () => {
            if (digits[0] === code[0] && digits[1] === code[1] && digits[2] === code[2]) {
                resultText.setText('CLICK! Inside: a keycard and a note:\n"Finally, someone who can do math!"').setColor('#44ff44');
                s.time.delayedCall(2000, () => {
                    els.forEach(e => e.destroy());
                    gameScene.puzzleActive = false;
                    gameScene.safeOpen = true;
                    gameScene.optionalPuzzlesSolved++;
                    if (!gameScene.hasKeycard) {
                        gameScene.hasKeycard = true;
                        gameScene.inventory.push('Keycard');
                        gameScene.updateInventory();
                    }
                    gameScene.showMessage('The safe had a keycard inside!', 4000);
                });
            } else {
                const msgs = CFG.safe.wrongMessages;
                resultText.setText(msgs[Math.floor(Math.random() * msgs.length)]).setColor('#ff4444');
                gameScene.cameras.main.shake(150, 0.005);
            }
        });
        els.push(openBtn);

        const closeBtn = s.add.text(cx, cy+95*S, '[ CANCEL ]', { fontSize: `${Math.round(16*S)}px`, fontFamily: 'monospace', color: '#666677', padding: { x: Math.round(20*S), y: Math.round(12*S) } }).setOrigin(0.5).setDepth(502).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => { els.forEach(e => e.destroy()); gameScene.puzzleActive = false; });
        els.push(closeBtn);
    }

    // --- BINARY LIGHT SWITCH PANEL ---
    startBinaryPuzzle() {
        if (this.puzzleActive || this.binaryPanelSolved) return;
        this.puzzleActive = true;
        this.player.setVelocity(0);
        const ui = this.scene.get('TouchUIScene');
        const s = ui || this;
        const w = s.scale.width, h = s.scale.height, cx = w/2, cy = h/2;
        const gameScene = this;
        const els = [];
        const target = this.binaryTarget;
        const bits = [0, 0, 0, 0];

        els.push(s.add.rectangle(cx, cy, w, h, 0x000000, CFG.puzzle.overlayAlpha).setDepth(500));
        els.push(s.add.rectangle(cx, cy, CFG.binary.panelW, CFG.binary.panelH, 0x111822, 0.95).setDepth(501).setStrokeStyle(Math.round(1*S), 0x334455));
        els.push(s.add.text(cx, cy-120*S, 'BINARY SWITCH PANEL', { fontSize: `${Math.round(18*S)}px`, fontFamily: 'monospace', color: '#00ccff', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502));
        els.push(s.add.text(cx, cy-95*S, 'Set switches to make: ' + target, { fontSize: `${Math.round(14*S)}px`, fontFamily: 'monospace', color: '#ffcc44' }).setOrigin(0.5).setDepth(502));
        els.push(s.add.text(cx, cy-75*S, 'Hint: each switch is worth 8, 4, 2, or 1', { fontSize: `${Math.round(10*S)}px`, fontFamily: 'monospace', color: '#556677' }).setOrigin(0.5).setDepth(502));

        const labels = ['8', '4', '2', '1'];
        const switchTexts = [];
        const currentText = s.add.text(cx, cy-50*S, 'Current: 0000 = 0', { fontSize: `${Math.round(14*S)}px`, fontFamily: 'monospace', color: '#44ff44' }).setOrigin(0.5).setDepth(502);
        els.push(currentText);

        const updateDisplay = () => {
            const val = bits[0]*8 + bits[1]*4 + bits[2]*2 + bits[3]*1;
            currentText.setText('Current: ' + bits.join('') + ' = ' + val);
        };

        for (let i = 0; i < 4; i++) {
            const bx = cx - 75*S + i * 50*S;
            // label
            els.push(s.add.text(bx, cy-28*S, labels[i], { fontSize: `${Math.round(14*S)}px`, fontFamily: 'monospace', color: '#8899aa' }).setOrigin(0.5).setDepth(502));
            // switch
            const sw = s.add.rectangle(bx, cy+5*S, 36*S, 50*S, 0x222233).setDepth(502).setStrokeStyle(Math.round(2*S), 0x445566).setInteractive({ useHandCursor: true });
            const swText = s.add.text(bx, cy+5*S, 'OFF', { fontSize: `${Math.round(12*S)}px`, fontFamily: 'monospace', color: '#ff4444', fontStyle: 'bold' }).setOrigin(0.5).setDepth(503);
            switchTexts.push(swText);
            sw.on('pointerdown', () => {
                bits[i] = bits[i] ? 0 : 1;
                swText.setText(bits[i] ? 'ON' : 'OFF').setColor(bits[i] ? '#44ff44' : '#ff4444');
                sw.setFillStyle(bits[i] ? 0x224422 : 0x222233);
                updateDisplay();
            });
            els.push(sw, swText);
        }

        const resultText = s.add.text(cx, cy+50*S, '', { fontSize: `${Math.round(12*S)}px`, fontFamily: 'monospace', color: '#ff4444' }).setOrigin(0.5).setDepth(503);
        els.push(resultText);

        const submitBtn = s.add.text(cx, cy+78*S, '[ SUBMIT ]', { fontSize: `${Math.round(18*S)}px`, fontFamily: 'monospace', color: '#00ccff', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502).setInteractive({ useHandCursor: true });
        submitBtn.on('pointerdown', () => {
            const val = bits[0]*8 + bits[1]*4 + bits[2]*2 + bits[3]*1;
            if (val === target) {
                resultText.setText("BEEP BOOP! You're speaking computer now!").setColor('#44ff44');
                s.time.delayedCall(1500, () => {
                    els.forEach(e => e.destroy());
                    gameScene.puzzleActive = false;
                    gameScene.binaryPanelSolved = true;
                    gameScene.optionalPuzzlesSolved++;
                    // open control room door (row 9, col 17)
                    const bDoor = gameScene.doors.find(d => d.getData('row') === 9 && d.getData('col') === 17);
                    if (bDoor && bDoor.body && bDoor.body.enable) gameScene.openDoor(bDoor);
                    gameScene.showMessage('Control Room door unlocked!', 3000);
                });
            } else {
                resultText.setText(val < target ? 'Too low! Try adding more.' : 'Too high! Try removing some.').setColor('#ff8844');
                gameScene.cameras.main.shake(100, 0.003);
            }
        });
        els.push(submitBtn);

        const closeBtn = s.add.text(cx, cy+110*S, '[ CANCEL ]', { fontSize: `${Math.round(16*S)}px`, fontFamily: 'monospace', color: '#666677', padding: { x: Math.round(20*S), y: Math.round(12*S) } }).setOrigin(0.5).setDepth(502).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => { els.forEach(e => e.destroy()); gameScene.puzzleActive = false; });
        els.push(closeBtn);
    }

    // --- CAESAR CIPHER DECODER ---
    startCipherPuzzle() {
        if (this.puzzleActive || this.cipherSolved) return;
        this.puzzleActive = true;
        this.player.setVelocity(0);
        const ui = this.scene.get('TouchUIScene');
        const s = ui || this;
        const w = s.scale.width, h = s.scale.height, cx = w/2, cy = h/2;
        const gameScene = this;
        const els = [];
        let shift = 0;

        const decode = (text, n) => text.split('').map(c => {
            if (c >= 'A' && c <= 'Z') return String.fromCharCode(((c.charCodeAt(0) - 65 - n + 26) % 26) + 65);
            return c;
        }).join('');

        els.push(s.add.rectangle(cx, cy, w, h, 0x000000, CFG.puzzle.overlayAlpha).setDepth(500));
        els.push(s.add.rectangle(cx, cy, CFG.cipher.panelW, CFG.cipher.panelH, 0x111822, 0.95).setDepth(501).setStrokeStyle(Math.round(1*S), 0x334455));
        els.push(s.add.text(cx, cy-130*S, 'CODED MESSAGE', { fontSize: `${Math.round(18*S)}px`, fontFamily: 'monospace', color: '#ffaa44', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502));
        els.push(s.add.text(cx, cy-108*S, 'A prisoner left this coded note...', { fontSize: `${Math.round(10*S)}px`, fontFamily: 'monospace', color: '#667788' }).setOrigin(0.5).setDepth(502));
        els.push(s.add.text(cx, cy-85*S, CFG.cipher.encoded, { fontSize: `${Math.round(13*S)}px`, fontFamily: 'monospace', color: '#ff8844', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502));

        const shiftLabel = s.add.text(cx, cy-55*S, 'Shift: 0', { fontSize: `${Math.round(14*S)}px`, fontFamily: 'monospace', color: '#88aacc' }).setOrigin(0.5).setDepth(502);
        els.push(shiftLabel);

        const decodedText = s.add.text(cx, cy-30*S, decode(CFG.cipher.encoded, 0), { fontSize: `${Math.round(13*S)}px`, fontFamily: 'monospace', color: '#aaddff', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502);
        els.push(decodedText);

        const updateShift = () => {
            shiftLabel.setText('Shift: ' + shift);
            decodedText.setText(decode(CFG.cipher.encoded, shift));
        };

        const leftBtn = s.add.text(cx-80*S, cy-55*S, '\u25C0  -', { fontSize: `${Math.round(18*S)}px`, fontFamily: 'monospace', color: '#88aacc' }).setOrigin(0.5).setDepth(503).setInteractive({ useHandCursor: true });
        leftBtn.on('pointerdown', () => { shift = (shift + 25) % 26; updateShift(); });
        els.push(leftBtn);

        const rightBtn = s.add.text(cx+80*S, cy-55*S, '+  \u25B6', { fontSize: `${Math.round(18*S)}px`, fontFamily: 'monospace', color: '#88aacc' }).setOrigin(0.5).setDepth(503).setInteractive({ useHandCursor: true });
        rightBtn.on('pointerdown', () => { shift = (shift + 1) % 26; updateShift(); });
        els.push(rightBtn);

        const resultText = s.add.text(cx, cy+10*S, '', { fontSize: `${Math.round(11*S)}px`, fontFamily: 'monospace', color: '#44ff44', align: 'center', wordWrap: { width: 340*S } }).setOrigin(0.5).setDepth(503);
        els.push(resultText);

        const decodeBtn = s.add.text(cx, cy+50*S, '[ DECODE ]', { fontSize: `${Math.round(18*S)}px`, fontFamily: 'monospace', color: '#ffaa44', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502).setInteractive({ useHandCursor: true });
        decodeBtn.on('pointerdown', () => {
            if (shift === CFG.cipher.shift) {
                resultText.setText("Cracked it! It says: '" + CFG.cipher.decoded + "'\n...wait, which bed? There are like 20 beds in here!").setColor('#44ff44');
                s.time.delayedCall(2500, () => {
                    els.forEach(e => e.destroy());
                    gameScene.puzzleActive = false;
                    gameScene.cipherSolved = true;
                    gameScene.optionalPuzzlesSolved++;
                    gameScene.showMessage('The code was shifted by 3! Check the beds for tools.', 5000);
                });
            } else {
                resultText.setText("That doesn't make any sense... try a different shift.").setColor('#ff8844');
            }
        });
        els.push(decodeBtn);

        const closeBtn = s.add.text(cx, cy+85*S, '[ CANCEL ]', { fontSize: `${Math.round(16*S)}px`, fontFamily: 'monospace', color: '#666677', padding: { x: Math.round(20*S), y: Math.round(12*S) } }).setOrigin(0.5).setDepth(502).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => { els.forEach(e => e.destroy()); gameScene.puzzleActive = false; });
        els.push(closeBtn);
    }

    // --- TALLY MARK COUNTER ---
    startTallyPuzzle() {
        if (this.puzzleActive || this.tallySolved) return;
        this.puzzleActive = true;
        this.player.setVelocity(0);
        const ui = this.scene.get('TouchUIScene');
        const s = ui || this;
        const w = s.scale.width, h = s.scale.height, cx = w/2, cy = h/2;
        const gameScene = this;
        const els = [];
        let guess = 0;

        els.push(s.add.rectangle(cx, cy, w, h, 0x000000, CFG.puzzle.overlayAlpha).setDepth(500));
        els.push(s.add.rectangle(cx, cy, CFG.tally.panelW, CFG.tally.panelH, 0x111822, 0.95).setDepth(501).setStrokeStyle(Math.round(1*S), 0x334455));
        els.push(s.add.text(cx, cy-95*S, 'TALLY MARKS', { fontSize: `${Math.round(18*S)}px`, fontFamily: 'monospace', color: '#ccccaa', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502));
        els.push(s.add.text(cx, cy-75*S, "How many days has prisoner #46 been here?", { fontSize: `${Math.round(10*S)}px`, fontFamily: 'monospace', color: '#667788' }).setOrigin(0.5).setDepth(502));
        els.push(s.add.text(cx, cy-55*S, "Remember: each group of lines = 5", { fontSize: `${Math.round(9*S)}px`, fontFamily: 'monospace', color: '#556677' }).setOrigin(0.5).setDepth(502));

        // draw tally groups visually (9 groups of 5 + 2 singles = 47)
        const tallyStr = 'IIIII  '.repeat(9) + 'II';
        els.push(s.add.text(cx, cy-30*S, tallyStr, { fontSize: `${Math.round(10*S)}px`, fontFamily: 'monospace', color: '#ddddcc', wordWrap: { width: 260*S }, align: 'center' }).setOrigin(0.5).setDepth(502));

        const guessText = s.add.text(cx, cy+10*S, '0', { fontSize: `${Math.round(28*S)}px`, fontFamily: 'monospace', color: '#44ff44', fontStyle: 'bold' }).setOrigin(0.5).setDepth(503);
        els.push(guessText);

        const upBtn = s.add.text(cx+50*S, cy+2*S, '\u25B2', { fontSize: `${Math.round(22*S)}px`, fontFamily: 'monospace', color: '#88aacc' }).setOrigin(0.5).setDepth(503).setInteractive({ useHandCursor: true });
        upBtn.on('pointerdown', () => { guess = Math.min(99, guess + 1); guessText.setText('' + guess); });
        els.push(upBtn);
        const dnBtn = s.add.text(cx+50*S, cy+22*S, '\u25BC', { fontSize: `${Math.round(22*S)}px`, fontFamily: 'monospace', color: '#88aacc' }).setOrigin(0.5).setDepth(503).setInteractive({ useHandCursor: true });
        dnBtn.on('pointerdown', () => { guess = Math.max(0, guess - 1); guessText.setText('' + guess); });
        els.push(dnBtn);
        // fast buttons
        const up5 = s.add.text(cx+85*S, cy+2*S, '+5', { fontSize: `${Math.round(14*S)}px`, fontFamily: 'monospace', color: '#88aacc' }).setOrigin(0.5).setDepth(503).setInteractive({ useHandCursor: true });
        up5.on('pointerdown', () => { guess = Math.min(99, guess + 5); guessText.setText('' + guess); });
        els.push(up5);
        const dn5 = s.add.text(cx+85*S, cy+22*S, '-5', { fontSize: `${Math.round(14*S)}px`, fontFamily: 'monospace', color: '#88aacc' }).setOrigin(0.5).setDepth(503).setInteractive({ useHandCursor: true });
        dn5.on('pointerdown', () => { guess = Math.max(0, guess - 5); guessText.setText('' + guess); });
        els.push(dn5);

        const resultText = s.add.text(cx, cy+45*S, '', { fontSize: `${Math.round(10*S)}px`, fontFamily: 'monospace', color: '#ff4444', align: 'center', wordWrap: { width: 260*S } }).setOrigin(0.5).setDepth(503);
        els.push(resultText);

        const submitBtn = s.add.text(cx, cy+70*S, '[ COUNT ]', { fontSize: `${Math.round(16*S)}px`, fontFamily: 'monospace', color: '#ccccaa', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502).setInteractive({ useHandCursor: true });
        submitBtn.on('pointerdown', () => {
            if (guess === CFG.tally.count) {
                resultText.setText("47 days! Prisoner #46 really can't count.\n(Your jersey number is 47 too!)\nThe second safe digit is 7!").setColor('#44ff44');
                s.time.delayedCall(2500, () => { els.forEach(e => e.destroy()); gameScene.puzzleActive = false; gameScene.tallySolved = true; gameScene.optionalPuzzlesSolved++; gameScene.showMessage('Second safe digit revealed: 7', 3000); });
            } else {
                resultText.setText(guess < CFG.tally.count ? "Too few! Count more carefully." : "Too many! Each group is 5, not 6!").setColor('#ff8844');
            }
        });
        els.push(submitBtn);

        const closeBtn = s.add.text(cx, cy+95*S, '[ CANCEL ]', { fontSize: `${Math.round(16*S)}px`, fontFamily: 'monospace', color: '#666677', padding: { x: Math.round(20*S), y: Math.round(12*S) } }).setOrigin(0.5).setDepth(502).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => { els.forEach(e => e.destroy()); gameScene.puzzleActive = false; });
        els.push(closeBtn);
    }

    // --- PATTERN SEQUENCE DOOR ---
    startPatternPuzzle() {
        if (this.puzzleActive || this.patternDoorOpen) return;
        this.puzzleActive = true;
        this.player.setVelocity(0);
        const ui = this.scene.get('TouchUIScene');
        const s = ui || this;
        const w = s.scale.width, h = s.scale.height, cx = w/2, cy = h/2;
        const gameScene = this;
        const els = [];
        let round = 0;

        const rounds = [
            { q: '2, 4, 6, 8, ???', opts: ['10', '9', '12', '7'], answer: 0 },
            { q: 'A, B, A, B, A, ???', opts: ['B', 'A', 'C', 'D'], answer: 0 },
            { q: 'Cat, Dog, Cat, Dog, Cat, ???', opts: ['Dog', 'Cat', 'Fish', 'Banana'], answer: 0 },
        ];

        els.push(s.add.rectangle(cx, cy, w, h, 0x000000, CFG.puzzle.overlayAlpha).setDepth(500));
        const panel = s.add.rectangle(cx, cy, CFG.pattern.panelW, CFG.pattern.panelH, 0x111822, 0.95).setDepth(501).setStrokeStyle(Math.round(1*S), 0x334455);
        els.push(panel);
        els.push(s.add.text(cx, cy-130*S, 'PATTERN LOCK', { fontSize: `${Math.round(18*S)}px`, fontFamily: 'monospace', color: '#ff88cc', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502));

        const roundLabel = s.add.text(cx, cy-108*S, 'Round 1 / 3', { fontSize: `${Math.round(11*S)}px`, fontFamily: 'monospace', color: '#667788' }).setOrigin(0.5).setDepth(502);
        els.push(roundLabel);
        const questionText = s.add.text(cx, cy-80*S, '', { fontSize: `${Math.round(16*S)}px`, fontFamily: 'monospace', color: '#ffcc44', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502);
        els.push(questionText);
        const resultText = s.add.text(cx, cy+60*S, '', { fontSize: `${Math.round(11*S)}px`, fontFamily: 'monospace', color: '#44ff44' }).setOrigin(0.5).setDepth(503);
        els.push(resultText);

        let roundBtns = [];
        const showRound = () => {
            roundBtns.forEach(b => b.destroy());
            roundBtns = [];
            const r = rounds[round];
            roundLabel.setText('Round ' + (round+1) + ' / 3');
            questionText.setText(r.q);
            if (round === 2) resultText.setText('Wait... is this a real security system?').setColor('#888899');
            else resultText.setText('');

            for (let i = 0; i < r.opts.length; i++) {
                const bx = cx - 105*S + i * 70*S;
                const btn = s.add.text(bx, cy-30*S, r.opts[i], { fontSize: `${Math.round(14*S)}px`, fontFamily: 'monospace', color: '#ffffff', backgroundColor: '#334455', padding: { x: Math.round(8*S), y: Math.round(8*S) } }).setOrigin(0.5).setDepth(503).setInteractive({ useHandCursor: true });
                btn.on('pointerdown', () => {
                    if (i === r.answer) {
                        round++;
                        if (round >= rounds.length) {
                            resultText.setText('All 3 patterns solved! The door reluctantly opens.').setColor('#44ff44');
                            s.time.delayedCall(1500, () => {
                                els.forEach(e => e.destroy()); roundBtns.forEach(b => b.destroy());
                                gameScene.puzzleActive = false;
                                gameScene.patternDoorOpen = true;
                                gameScene.optionalPuzzlesSolved++;
                                gameScene.patternDoors.forEach(pd => { if (pd.body && pd.body.enable) gameScene.openDoor(pd); });
                                gameScene.showMessage('Pattern door unlocked! Shortcut opened.', 3000);
                            });
                        } else {
                            resultText.setText('Correct!').setColor('#44ff44');
                            s.time.delayedCall(600, showRound);
                        }
                    } else {
                        resultText.setText('Nope! The door judges you silently.').setColor('#ff4444');
                        gameScene.cameras.main.shake(100, 0.003);
                    }
                });
                roundBtns.push(btn);
            }
        };
        showRound();

        const closeBtn = s.add.text(cx, cy+100*S, '[ CANCEL ]', { fontSize: `${Math.round(16*S)}px`, fontFamily: 'monospace', color: '#666677', padding: { x: Math.round(20*S), y: Math.round(12*S) } }).setOrigin(0.5).setDepth(502).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => { els.forEach(e => e.destroy()); roundBtns.forEach(b => b.destroy()); gameScene.puzzleActive = false; });
        els.push(closeBtn);
    }

    // --- MORSE CODE RADIO ---
    startMorsePuzzle() {
        if (this.puzzleActive || this.morseSolved) return;
        this.puzzleActive = true;
        this.player.setVelocity(0);
        const ui = this.scene.get('TouchUIScene');
        const s = ui || this;
        const w = s.scale.width, h = s.scale.height, cx = w/2, cy = h/2;
        const gameScene = this;
        const els = [];

        const morseMap = { A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....', I:'..', J:'.---', K:'-.-', L:'.-..', M:'--', N:'-.', O:'---', P:'.--.', Q:'--.-', R:'.-.', S:'...', T:'-', U:'..-', V:'...-', W:'.--', X:'-..-', Y:'-.--', Z:'--..' };
        const msg = CFG.morse.message;
        const morseStr = msg.split('').map(c => morseMap[c] || '').join('  ');
        let guess = '';

        els.push(s.add.rectangle(cx, cy, w, h, 0x000000, CFG.puzzle.overlayAlpha).setDepth(500));
        els.push(s.add.rectangle(cx, cy, CFG.morse.panelW, CFG.morse.panelH, 0x111822, 0.95).setDepth(501).setStrokeStyle(Math.round(1*S), 0x334455));
        els.push(s.add.text(cx, cy-120*S, 'EMERGENCY RADIO', { fontSize: `${Math.round(18*S)}px`, fontFamily: 'monospace', color: '#44ccff', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502));
        els.push(s.add.text(cx, cy-98*S, 'The radio is beeping a message:', { fontSize: `${Math.round(10*S)}px`, fontFamily: 'monospace', color: '#667788' }).setOrigin(0.5).setDepth(502));
        els.push(s.add.text(cx, cy-75*S, morseStr, { fontSize: `${Math.round(18*S)}px`, fontFamily: 'monospace', color: '#ffcc44', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502));

        // mini reference
        els.push(s.add.text(cx, cy-48*S, 'A=.-  E=.  I=..  O=---  P=.--.  Z=--..  S=...', { fontSize: `${Math.round(7*S)}px`, fontFamily: 'monospace', color: '#556677' }).setOrigin(0.5).setDepth(502));

        const guessText = s.add.text(cx, cy-20*S, '_', { fontSize: `${Math.round(24*S)}px`, fontFamily: 'monospace', color: '#44ff44', fontStyle: 'bold' }).setOrigin(0.5).setDepth(503);
        els.push(guessText);

        // letter buttons
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        for (let i = 0; i < 26; i++) {
            const row = Math.floor(i / 9);
            const col = i % 9;
            const bx = cx - 108*S + col * 27*S;
            const by = cy + 10*S + row * 28*S;
            const btn = s.add.text(bx, by, letters[i], { fontSize: `${Math.round(14*S)}px`, fontFamily: 'monospace', color: '#aaccff', backgroundColor: '#222233', padding: { x: Math.round(4*S), y: Math.round(3*S) } }).setOrigin(0.5).setDepth(503).setInteractive({ useHandCursor: true });
            btn.on('pointerdown', () => {
                if (guess.length < 10) { guess += letters[i]; guessText.setText(guess || '_'); }
            });
            els.push(btn);
        }

        // backspace
        const bksp = s.add.text(cx+110*S, cy+38*S, 'DEL', { fontSize: `${Math.round(11*S)}px`, fontFamily: 'monospace', color: '#ff6644', backgroundColor: '#332222', padding: { x: Math.round(4*S), y: Math.round(3*S) } }).setOrigin(0.5).setDepth(503).setInteractive({ useHandCursor: true });
        bksp.on('pointerdown', () => { guess = guess.slice(0, -1); guessText.setText(guess || '_'); });
        els.push(bksp);

        const resultText = s.add.text(cx, cy+80*S, '', { fontSize: `${Math.round(10*S)}px`, fontFamily: 'monospace', color: '#ff4444', align: 'center', wordWrap: { width: 340*S } }).setOrigin(0.5).setDepth(503);
        els.push(resultText);

        const submitBtn = s.add.text(cx, cy+105*S, '[ DECODE ]', { fontSize: `${Math.round(16*S)}px`, fontFamily: 'monospace', color: '#44ccff', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502).setInteractive({ useHandCursor: true });
        submitBtn.on('pointerdown', () => {
            if (guess.toUpperCase() === msg) {
                resultText.setText("The message says 'SEND PIZZA'. Not helpful, but educational!\nThe third safe digit is 2!").setColor('#44ff44');
                s.time.delayedCall(2500, () => { els.forEach(e => e.destroy()); gameScene.puzzleActive = false; gameScene.morseSolved = true; gameScene.optionalPuzzlesSolved++; gameScene.showMessage('Third safe digit revealed: 2', 3000); });
            } else {
                resultText.setText("That's not it. Beep boop beep? Try again!").setColor('#ff8844');
            }
        });
        els.push(submitBtn);

        const closeBtn = s.add.text(cx, cy+130*S, '[ CANCEL ]', { fontSize: `${Math.round(16*S)}px`, fontFamily: 'monospace', color: '#666677', padding: { x: Math.round(20*S), y: Math.round(12*S) } }).setOrigin(0.5).setDepth(502).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => { els.forEach(e => e.destroy()); gameScene.puzzleActive = false; });
        els.push(closeBtn);
    }

    // --- WIRE/PIPE ROTATION PUZZLE ---
    startWirePuzzle() {
        if (this.puzzleActive || this.wirePuzzleSolved) return;
        this.puzzleActive = true;
        this.player.setVelocity(0);
        const ui = this.scene.get('TouchUIScene');
        const s = ui || this;
        const w = s.scale.width, h = s.scale.height, cx = w/2, cy = h/2;
        const gameScene = this;
        const els = [];
        const gs = CFG.wirePuzzle.gridSize;
        const cellSz = 60*S;

        // wire types: 0=straight(|), 1=corner(L), 2=tee(T)
        // connections per rotation: [up, right, down, left]
        // solved layout forms S-curve from left to right:
        //   →(0,0)→(0,1)→(0,2)
        //           ↓      ↓
        //   (1,0)←(1,1)←(1,2)
        //     ↓
        //   (2,0)→(2,1)→(2,2)→
        const pieces = [
            { type: 0, rot: 1 }, { type: 2, rot: 1 }, { type: 1, rot: 2 },
            { type: 1, rot: 1 }, { type: 2, rot: 3 }, { type: 1, rot: 3 },
            { type: 1, rot: 0 }, { type: 0, rot: 1 }, { type: 0, rot: 1 },
        ];
        // randomize initial rotations
        const state = pieces.map(p => ({ type: p.type, rot: (p.rot + Phaser.Math.Between(1, 3)) % 4, solveRot: p.rot }));

        const getConnections = (type, rot) => {
            const base = type === 0 ? [1,0,1,0] : type === 1 ? [1,1,0,0] : [1,1,1,0];
            const r = [];
            for (let i = 0; i < 4; i++) r.push(base[(i - rot + 4) % 4]);
            return r;
        };

        els.push(s.add.rectangle(cx, cy, w, h, 0x000000, CFG.puzzle.overlayAlpha).setDepth(500));
        els.push(s.add.rectangle(cx, cy, CFG.wirePuzzle.panelW, CFG.wirePuzzle.panelH, 0x111822, 0.95).setDepth(501).setStrokeStyle(Math.round(1*S), 0x334455));
        els.push(s.add.text(cx, cy-155*S, 'CIRCUIT PANEL', { fontSize: `${Math.round(18*S)}px`, fontFamily: 'monospace', color: '#ffaa22', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502));
        els.push(s.add.text(cx, cy-135*S, 'Tap tiles to rotate. Connect left to right!', { fontSize: `${Math.round(10*S)}px`, fontFamily: 'monospace', color: '#667788' }).setOrigin(0.5).setDepth(502));

        const resultText = s.add.text(cx, cy+120*S, '', { fontSize: `${Math.round(11*S)}px`, fontFamily: 'monospace', color: '#44ff44' }).setOrigin(0.5).setDepth(503);
        els.push(resultText);

        const tileGfx = [];
        const drawTiles = () => {
            tileGfx.forEach(g => g.destroy());
            tileGfx.length = 0;
            for (let r = 0; r < gs; r++) for (let c = 0; c < gs; c++) {
                const idx = r * gs + c;
                const px = cx - cellSz + c * cellSz;
                const py = cy - cellSz + r * cellSz;
                const g = s.add.graphics().setDepth(502);
                g.fillStyle(0x1a2233); g.fillRect(px - cellSz/2 + 2*S, py - cellSz/2 + 2*S, cellSz-4*S, cellSz-4*S);
                g.lineStyle(Math.round(1*S), 0x334455); g.strokeRect(px - cellSz/2 + 2*S, py - cellSz/2 + 2*S, cellSz-4*S, cellSz-4*S);
                const conn = getConnections(state[idx].type, state[idx].rot);
                g.lineStyle(Math.round(4*S), 0xffaa22);
                if (conn[0]) { g.beginPath(); g.moveTo(px, py); g.lineTo(px, py - cellSz/2 + 2*S); g.strokePath(); }
                if (conn[1]) { g.beginPath(); g.moveTo(px, py); g.lineTo(px + cellSz/2 - 2*S, py); g.strokePath(); }
                if (conn[2]) { g.beginPath(); g.moveTo(px, py); g.lineTo(px, py + cellSz/2 - 2*S); g.strokePath(); }
                if (conn[3]) { g.beginPath(); g.moveTo(px, py); g.lineTo(px - cellSz/2 + 2*S, py); g.strokePath(); }
                tileGfx.push(g);

                const hitArea = s.add.rectangle(px, py, cellSz-4*S, cellSz-4*S, 0x000000, 0.01).setDepth(504).setInteractive({ useHandCursor: true });
                hitArea.on('pointerdown', () => {
                    state[idx].rot = (state[idx].rot + 1) % 4;
                    drawTiles();
                    // check solution
                    if (state.every((st, i) => st.rot === pieces[i].rot)) {
                        resultText.setText("Circuit complete! You're basically an electrician now. An illegal one.").setColor('#44ff44');
                        s.time.delayedCall(2000, () => { els.forEach(e => e.destroy()); tileGfx.forEach(g => g.destroy()); gameScene.puzzleActive = false; gameScene.wirePuzzleSolved = true; gameScene.optionalPuzzlesSolved++; gameScene.showMessage('Wire puzzle solved! The fence power is off.', 4000); });
                    }
                });
                tileGfx.push(hitArea);
            }
        };
        drawTiles();

        const closeBtn = s.add.text(cx, cy+150*S, '[ CANCEL ]', { fontSize: `${Math.round(16*S)}px`, fontFamily: 'monospace', color: '#666677', padding: { x: Math.round(20*S), y: Math.round(12*S) } }).setOrigin(0.5).setDepth(502).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => { els.forEach(e => e.destroy()); tileGfx.forEach(g => g.destroy()); gameScene.puzzleActive = false; });
        els.push(closeBtn);
    }

    // --- COMPUTER TERMINAL ---
    startTerminal() {
        if (this.puzzleActive) return;
        this.puzzleActive = true;
        this.player.setVelocity(0);
        const ui = this.scene.get('TouchUIScene');
        const s = ui || this;
        const w = s.scale.width, h = s.scale.height, cx = w/2, cy = h/2;
        const gameScene = this;
        const els = [];
        const history = ['PRISON-OS v1.0 - Type a command below.', ''];

        const commands = {
            help: 'Commands: help, map, hint, time, who, escape, dance, pizza, sudo, 42',
            map: '    [CELLS] [REC ROOM] [RIGHT WING]\n    [CORRIDOR - guard patrol zone]\n    [WORKSHOP] [CONTROL ROOM]\n    [BASEMENT] [UTILITY] -> [VENT=EXIT]',
            hint: () => {
                if (!gameScene.cellDoorOpen) return 'Find the key. It glows. Under a bed.';
                if (!gameScene.exitDoorOpen) return 'The security panel needs a code. Or find a keycard.';
                if (!gameScene.hasWireCutters) return 'Check the right wing for tools.';
                return 'You have what you need. Find the vent!';
            },
            time: () => { const s = Math.floor((Date.now() - gameScene.gameStartTime) / 1000); return 'Time in prison: ' + Math.floor(s/60) + 'm ' + (s%60) + 's'; },
            who: 'You are Prisoner #47. Crime: Being too awesome.',
            escape: "Nice try, but it's not that easy! Try using your legs instead.",
            dance: 'You do a little dance. The terminal is not impressed.',
            pizza: 'Ordering pizza to prison... ERROR: Delivery blocked by walls.',
            sudo: "Nice try, hacker! You don't have root access in prison.",
            '42': "Yes, that IS the answer to everything. But not to this lock.",
        };

        els.push(s.add.rectangle(cx, cy, w, h, 0x000000, CFG.puzzle.overlayAlpha).setDepth(500));
        els.push(s.add.rectangle(cx, cy, CFG.terminal.panelW, CFG.terminal.panelH, 0x0a1a0a, 0.98).setDepth(501).setStrokeStyle(Math.round(2*S), 0x226622));

        const outputText = s.add.text(cx - 185*S, cy - 145*S, history.join('\n'), { fontSize: `${Math.round(9*S)}px`, fontFamily: 'monospace', color: '#33ff33', wordWrap: { width: 370*S }, lineSpacing: Math.round(2*S) }).setDepth(502);
        els.push(outputText);

        const updateOutput = () => { outputText.setText(history.slice(-14).join('\n')); };

        const runCmd = (cmd) => {
            history.push('> ' + cmd);
            const handler = commands[cmd.toLowerCase()];
            if (handler) {
                history.push(typeof handler === 'function' ? handler() : handler);
            } else {
                history.push("Command not recognized. Type 'help'.");
            }
            history.push('');
            gameScene.optionalPuzzlesSolved = Math.max(gameScene.optionalPuzzlesSolved, 1);
            updateOutput();
        };

        // command buttons
        const cmds = ['help', 'map', 'hint', 'time', 'who', 'escape', 'dance', 'pizza', 'sudo', '42'];
        for (let i = 0; i < cmds.length; i++) {
            const r = Math.floor(i / 5), c = i % 5;
            const bx = cx - 140*S + c * 72*S;
            const by = cy + 95*S + r * 28*S;
            const btn = s.add.text(bx, by, cmds[i], { fontSize: `${Math.round(10*S)}px`, fontFamily: 'monospace', color: '#44ff44', backgroundColor: '#112211', padding: { x: Math.round(6*S), y: Math.round(4*S) } }).setOrigin(0.5).setDepth(503).setInteractive({ useHandCursor: true });
            btn.on('pointerdown', () => runCmd(cmds[i]));
            els.push(btn);
        }

        const closeBtn = s.add.text(cx + 160*S, cy - 150*S, 'X', { fontSize: `${Math.round(20*S)}px`, fontFamily: 'monospace', color: '#ff4444', fontStyle: 'bold', padding: { x: Math.round(14*S), y: Math.round(10*S) } }).setOrigin(0.5).setDepth(503).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => { els.forEach(e => e.destroy()); gameScene.puzzleActive = false; gameScene.showMessage("Terminal locked. Don't forget to log out!"); });
        els.push(closeBtn);
    }

    // --- GUARD SCHEDULE BOARD ---
    showSchedule() {
        if (this.puzzleActive) return;
        this.puzzleActive = true;
        this.player.setVelocity(0);
        const ui = this.scene.get('TouchUIScene');
        const s = ui || this;
        const w = s.scale.width, h = s.scale.height, cx = w/2, cy = h/2;
        const gameScene = this;
        const els = [];

        els.push(s.add.rectangle(cx, cy, w, h, 0x000000, 0.7).setDepth(500));
        els.push(s.add.rectangle(cx, cy, 360*S, 300*S, 0xaa8855, 0.95).setDepth(501).setStrokeStyle(Math.round(3*S), 0x886633));
        els.push(s.add.text(cx, cy-130*S, 'GUARD DUTY SCHEDULE', { fontSize: `${Math.round(16*S)}px`, fontFamily: 'monospace', color: '#331100', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502));

        const schedule = [
            '8:00 AM - Start patrol',
            '9:00 AM - Continue patrol',
            '10:00 AM - Still patrolling',
            '11:00 AM - Lunch break (patrol during lunch)',
            '12:00 PM - Patrol the patrol route',
            '3:00 PM - Nap time (patrol in sleep)',
            '6:00 PM - Dinner patrol',
            '9:00 PM - Night patrol',
            '',
            'Note: If prisoner escapes,',
            'please file form 27-B in triplicate.',
        ];
        els.push(s.add.text(cx, cy+10*S, schedule.join('\n'), { fontSize: `${Math.round(9*S)}px`, fontFamily: 'monospace', color: '#221100', lineSpacing: Math.round(2*S), align: 'center' }).setOrigin(0.5).setDepth(502));

        // auto-close after 10 seconds
        const timer = s.time.delayedCall(CFG.schedule.displayDur, () => {
            els.forEach(e => e.destroy());
            gameScene.puzzleActive = false;
            gameScene.scheduleViewed = true;
        });

        const closeBtn = s.add.text(cx, cy+130*S, '[ CLOSE ]', { fontSize: `${Math.round(16*S)}px`, fontFamily: 'monospace', color: '#553311', padding: { x: Math.round(20*S), y: Math.round(12*S) } }).setOrigin(0.5).setDepth(502).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => { timer.remove(); els.forEach(e => e.destroy()); gameScene.puzzleActive = false; gameScene.scheduleViewed = true; });
        els.push(closeBtn);
    }

    // --- DIARY PAGE VIEWER ---
    showDiaryPage(idx) {
        if (this.puzzleActive) return;
        this.puzzleActive = true;
        this.player.setVelocity(0);
        const ui = this.scene.get('TouchUIScene');
        const s = ui || this;
        const w = s.scale.width, h = s.scale.height, cx = w/2, cy = h/2;
        const gameScene = this;
        const els = [];
        const content = this._diaryContent();

        els.push(s.add.rectangle(cx, cy, w, h, 0x000000, 0.7).setDepth(500));
        els.push(s.add.rectangle(cx, cy, 340*S, 260*S, 0xe8dcc0, 0.95).setDepth(501).setStrokeStyle(Math.round(2*S), 0xaa9970));
        els.push(s.add.text(cx, cy-115*S, 'DIARY PAGE ' + (idx+1) + ' / 5', { fontSize: `${Math.round(14*S)}px`, fontFamily: 'monospace', color: '#664422', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502));
        els.push(s.add.text(cx, cy, content[idx], { fontSize: `${Math.round(10*S)}px`, fontFamily: 'monospace', color: '#443322', align: 'center', wordWrap: { width: 300*S }, lineSpacing: Math.round(3*S) }).setOrigin(0.5).setDepth(502));
        els.push(s.add.text(cx, cy+110*S, 'Pages found: ' + gameScene.diaryPagesFound + ' / 5', { fontSize: `${Math.round(9*S)}px`, fontFamily: 'monospace', color: '#887766' }).setOrigin(0.5).setDepth(502));

        const closeBtn = s.add.text(cx, cy+125*S, '[ CLOSE ]', { fontSize: `${Math.round(16*S)}px`, fontFamily: 'monospace', color: '#664422', padding: { x: Math.round(20*S), y: Math.round(12*S) } }).setOrigin(0.5).setDepth(502).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => { els.forEach(e => e.destroy()); gameScene.puzzleActive = false; });
        els.push(closeBtn);
    }

    // --- VENT MAZE ---
    startVentMaze() {
        if (this.puzzleActive) return;
        this.puzzleActive = true;
        this.player.setVelocity(0);
        const ui = this.scene.get('TouchUIScene');
        const s = ui || this;
        const w = s.scale.width, h = s.scale.height, cx = w/2, cy = h/2;
        const gameScene = this;
        const els = [];
        const sz = CFG.ventMaze.size;
        const cpx = CFG.ventMaze.cellPx;

        // simple maze generation (binary tree)
        const maze = [];
        for (let r = 0; r < sz; r++) { maze[r] = []; for (let c = 0; c < sz; c++) maze[r][c] = { top: true, left: true, right: true, bottom: true }; }
        for (let r = 0; r < sz; r++) for (let c = 0; c < sz; c++) {
            const choices = [];
            if (r > 0) choices.push('top');
            if (c > 0) choices.push('left');
            if (choices.length > 0) {
                const dir = choices[Math.floor(Math.random() * choices.length)];
                if (dir === 'top') { maze[r][c].top = false; maze[r-1][c].bottom = false; }
                else { maze[r][c].left = false; maze[r][c-1].right = false; }
            }
        }

        let pr = 0, pc = 0; // player pos in maze

        els.push(s.add.rectangle(cx, cy, w, h, 0x000000, 0.95).setDepth(500));
        els.push(s.add.text(cx, cy - sz*cpx/2 - 30*S, 'VENT SYSTEM', { fontSize: `${Math.round(16*S)}px`, fontFamily: 'monospace', color: '#667788', fontStyle: 'bold' }).setOrigin(0.5).setDepth(502));
        els.push(s.add.text(cx, cy - sz*cpx/2 - 14*S, 'Navigate to the exit (bottom-right)', { fontSize: `${Math.round(9*S)}px`, fontFamily: 'monospace', color: '#556677' }).setOrigin(0.5).setDepth(502));

        const mazeGfx = s.add.graphics().setDepth(502);
        const playerDot = s.add.circle(0, 0, cpx/4, 0xff8844).setDepth(503);
        els.push(mazeGfx, playerDot);

        // exit marker
        const exitX = cx - (sz*cpx)/2 + (sz-1)*cpx + cpx/2;
        const exitY = cy - (sz*cpx)/2 + (sz-1)*cpx + cpx/2;
        const exitDot = s.add.circle(exitX, exitY, cpx/4, 0x44ff44, 0.5).setDepth(502);
        els.push(exitDot);
        s.tweens.add({ targets: exitDot, alpha: 0.2, scale: 1.3, duration: 800, yoyo: true, repeat: -1 });

        // graffiti in random cells
        const graffiti = ["Kilroy was here", "Turn left?", "Keep going!", "Almost there...", "Sandwich?"];
        for (let i = 0; i < 3; i++) {
            const gr = Phaser.Math.Between(0, sz-1), gc = Phaser.Math.Between(0, sz-1);
            if (gr === 0 && gc === 0) continue;
            const gx = cx - (sz*cpx)/2 + gc*cpx + cpx/2;
            const gy = cy - (sz*cpx)/2 + gr*cpx + cpx/2;
            const gtxt = s.add.text(gx, gy+6*S, graffiti[i], { fontSize: `${Math.round(5*S)}px`, fontFamily: 'monospace', color: '#445566' }).setOrigin(0.5).setDepth(502);
            els.push(gtxt);
        }

        const drawMaze = () => {
            mazeGfx.clear();
            mazeGfx.lineStyle(Math.round(2*S), 0x556677);
            const ox = cx - (sz*cpx)/2;
            const oy = cy - (sz*cpx)/2;
            // fill cells
            for (let r = 0; r < sz; r++) for (let c = 0; c < sz; c++) {
                mazeGfx.fillStyle(0x111822); mazeGfx.fillRect(ox + c*cpx, oy + r*cpx, cpx, cpx);
            }
            // draw walls
            for (let r = 0; r < sz; r++) for (let c = 0; c < sz; c++) {
                const x1 = ox + c*cpx, y1 = oy + r*cpx;
                if (maze[r][c].top) { mazeGfx.beginPath(); mazeGfx.moveTo(x1, y1); mazeGfx.lineTo(x1+cpx, y1); mazeGfx.strokePath(); }
                if (maze[r][c].left) { mazeGfx.beginPath(); mazeGfx.moveTo(x1, y1); mazeGfx.lineTo(x1, y1+cpx); mazeGfx.strokePath(); }
                if (c === sz-1 && maze[r][c].right) { mazeGfx.beginPath(); mazeGfx.moveTo(x1+cpx, y1); mazeGfx.lineTo(x1+cpx, y1+cpx); mazeGfx.strokePath(); }
                if (r === sz-1 && maze[r][c].bottom) { mazeGfx.beginPath(); mazeGfx.moveTo(x1, y1+cpx); mazeGfx.lineTo(x1+cpx, y1+cpx); mazeGfx.strokePath(); }
            }
            // player dot
            playerDot.setPosition(ox + pc*cpx + cpx/2, oy + pr*cpx + cpx/2);
        };
        drawMaze();

        const tryMove = (dr, dc) => {
            const cell = maze[pr][pc];
            if (dr === -1 && cell.top) return;
            if (dr === 1 && cell.bottom) return;
            if (dc === -1 && cell.left) return;
            if (dc === 1 && cell.right) return;
            pr += dr; pc += dc;
            drawMaze();
            if (pr === sz-1 && pc === sz-1) {
                // escaped!
                els.forEach(e => e.destroy());
                gameScene.puzzleActive = false;
                gameScene.escaped = true;
                gameScene.showMessage('You crawl through the vents and escape into the night!');
                gameScene.cameras.main.fade(CFG.escape.fadeDur, 0, 0, 0);
                const escapeTime = Date.now() - gameScene.gameStartTime;
                gameScene.time.delayedCall(CFG.escape.sceneDelay, () => {
                    gameScene.scene.stop('TouchUIScene');
                    gameScene.scene.start('WinScene', {
                        time: escapeTime,
                        puzzles: gameScene.optionalPuzzlesSolved,
                        diaryPages: gameScene.diaryPagesFound,
                        caught: gameScene.caughtCount
                    });
                });
            }
        };

        // arrow key controls for maze
        const cursors = s.input.keyboard.createCursorKeys();
        const wasd = s.input.keyboard.addKeys('W,A,S,D');
        const keyHandler = s.time.addEvent({
            delay: 150, loop: true,
            callback: () => {
                if (cursors.up.isDown || wasd.W.isDown) tryMove(-1, 0);
                else if (cursors.down.isDown || wasd.S.isDown) tryMove(1, 0);
                else if (cursors.left.isDown || wasd.A.isDown) tryMove(0, -1);
                else if (cursors.right.isDown || wasd.D.isDown) tryMove(0, 1);
            }
        });
        els.push({ destroy: () => keyHandler.remove() });

        // touch controls — 4 directional buttons
        const arrowBtns = [
            { label: '\u25B2', x: cx, y: cy + sz*cpx/2 + 20*S, dr: -1, dc: 0 },
            { label: '\u25BC', x: cx, y: cy + sz*cpx/2 + 55*S, dr: 1, dc: 0 },
            { label: '\u25C0', x: cx-40*S, y: cy + sz*cpx/2 + 38*S, dr: 0, dc: -1 },
            { label: '\u25B6', x: cx+40*S, y: cy + sz*cpx/2 + 38*S, dr: 0, dc: 1 },
        ];
        arrowBtns.forEach(ab => {
            const btn = s.add.text(ab.x, ab.y, ab.label, { fontSize: `${Math.round(24*S)}px`, fontFamily: 'monospace', color: '#88aacc' }).setOrigin(0.5).setDepth(503).setInteractive({ useHandCursor: true });
            btn.on('pointerdown', () => tryMove(ab.dr, ab.dc));
            els.push(btn);
        });
    }

    _checkPressurePlates() {
        if (this.crateGateOpen) return;
        let allOccupied = true;
        this.pressurePlates.forEach(pp => {
            let occupied = false;
            this.pushableCrates.forEach(pc => {
                if (pc.body && Phaser.Math.Distance.Between(pc.x, pc.y, pp.x, pp.y) < T * 0.6) {
                    occupied = true;
                }
            });
            pp.occupied = occupied;
        });
        allOccupied = this.pressurePlates.every(pp => pp.occupied);
        if (allOccupied && this.pressurePlates.length > 0) {
            this.crateGateOpen = true;
            this.optionalPuzzlesSolved++;
            this.showMessage('All pressure plates activated! A hidden passage opens!', 3000);
            // Open the pattern door as a shortcut reward
            this.patternDoors.forEach(pd => {
                if (pd.body && pd.body.enable) this.openDoor(pd);
            });
        }
    }

    guardCanSeePlayer() {
        if (this.hiding || this.ratDistractActive) return false;
        const gx = this.guard.x, gy = this.guard.y;
        const px = this.player.x, py = this.player.y;
        const dist = Phaser.Math.Distance.Between(gx, gy, px, py);
        if (dist > CFG.guard.visionRange) return false;

        const angle = Math.atan2(py - gy, px - gx);
        let facingAngle;
        switch (this.guardFacing) {
            case 'right': facingAngle = 0; break;
            case 'left': facingAngle = Math.PI; break;
            case 'down': facingAngle = Math.PI / 2; break;
            case 'up': facingAngle = -Math.PI / 2; break;
        }
        let diff = angle - facingAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        if (Math.abs(diff) > CFG.guard.fovHalf) return false;

        const steps = Math.ceil(dist / (T / 2));
        for (let i = 1; i < steps; i++) {
            const t = i / steps;
            const cx = gx + (px - gx) * t;
            const cy = gy + (py - gy) * t;
            const col = Math.floor(cx / T);
            const row = Math.floor(cy / T);
            if (row >= 0 && row < MAP.length && col >= 0 && col < MAP[0].length) {
                const tile = MAP[row][col];
                if (tile === 1 || tile === 2 || tile === 3 || tile === 10) return false;
            }
        }
        return true;
    }

    updateGuardAI(delta) {
        const canSee = this.guardCanSeePlayer();

        if (this.guardState === 'patrol') {
            const wp = this.guardWaypoints[this.guardWaypointIdx];
            const targetX = wp.x * T + T / 2;
            const targetY = wp.y * T + T / 2;
            const dx = targetX - this.guard.x;
            const dy = targetY - this.guard.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CFG.guard.waypointThreshold) {
                this.guardWaypointIdx = (this.guardWaypointIdx + 1) % this.guardWaypoints.length;
            } else {
                const spd = this.guardSpeed;
                this.guard.x += (dx / dist) * spd * delta * CFG.guard.moveDelta;
                this.guard.y += (dy / dist) * spd * delta * CFG.guard.moveDelta;
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.guardFacing = dx > 0 ? 'right' : 'left';
                } else {
                    this.guardFacing = dy > 0 ? 'down' : 'up';
                }
            }

            if (canSee) {
                this.guardState = 'suspicious';
                this.guardSuspiciousTimer = 0;
            }
        } else if (this.guardState === 'suspicious') {
            const dx = this.player.x - this.guard.x;
            const dy = this.player.y - this.guard.y;
            if (Math.abs(dx) > Math.abs(dy)) {
                this.guardFacing = dx > 0 ? 'right' : 'left';
            } else {
                this.guardFacing = dy > 0 ? 'down' : 'up';
            }

            this.guardSuspiciousTimer += delta;
            if (!canSee) {
                this.guardState = 'patrol';
            } else if (this.guardSuspiciousTimer > CFG.guard.suspicionTime) {
                this.guardState = 'chase';
                this.guardChaseTimer = 0;
                this.guardLastKnownX = this.player.x;
                this.guardLastKnownY = this.player.y;
            }
        } else if (this.guardState === 'chase') {
            let targetX, targetY;
            if (canSee) {
                targetX = this.player.x;
                targetY = this.player.y;
                this.guardLastKnownX = targetX;
                this.guardLastKnownY = targetY;
                this.guardChaseTimer = 0;
            } else {
                targetX = this.guardLastKnownX;
                targetY = this.guardLastKnownY;
                this.guardChaseTimer += delta;
            }

            const dx = targetX - this.guard.x;
            const dy = targetY - this.guard.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > CFG.guard.waypointThreshold) {
                const chaseSpd = this.guardSpeed * CFG.guard.chaseMul;
                this.guard.x += (dx / dist) * chaseSpd * delta * CFG.guard.moveDelta;
                this.guard.y += (dy / dist) * chaseSpd * delta * CFG.guard.moveDelta;
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.guardFacing = dx > 0 ? 'right' : 'left';
                } else {
                    this.guardFacing = dy > 0 ? 'down' : 'up';
                }
            }

            if (canSee && dist < CFG.guard.catchDist) {
                this.getCaught();
            }

            if (this.guardChaseTimer > CFG.guard.chaseTimeout || (!canSee && dist < T)) {
                this.guardState = 'patrol';
            }
        } else if (this.guardState === 'distracted') {
            // Guard is distracted by the rat — stands still, does nothing
            this.guard.setVelocity(0);
        }

        this.guard.body.reset(this.guard.x, this.guard.y);

        this.guard.setTexture(`guard_${this.guardFacing}_0`).setDisplaySize(T, T);
        const guardMoving = this.guardState === 'patrol' || this.guardState === 'chase';
        if (guardMoving) {
            const spd = this.guardState === 'chase' ? 0.012 : 0.006;
            this.guardAnimTime = (this.guardAnimTime || 0) + delta * spd;
            const gLean = Math.sin(this.guardAnimTime * 3) * 0.04;
            const gSquash = 1 + Math.sin(this.guardAnimTime * 6) * 0.03;
            this.guard.setRotation(gLean);
            this.guard.setScale(T / this.guard.width * gSquash, T / this.guard.height / gSquash);
        } else {
            this.guardAnimTime = 0;
            this.guard.setRotation(0);
            this.guard.setScale(T / this.guard.width, T / this.guard.height);
        }

        if (this.guardState === 'distracted') {
            this.guardIcon.setText('?!').setColor('#ff8844');
        } else if (this.guardState === 'suspicious') {
            this.guardIcon.setText('?').setColor('#ffaa00');
        } else if (this.guardState === 'chase') {
            this.guardIcon.setText('!').setColor('#ff2222');
        } else {
            this.guardIcon.setText('');
        }
        this.guardIcon.setPosition(this.guard.x, this.guard.y - 22);

        this.visionCone.clear();
        if (this.guardState === 'distracted') return;
        let coneColor, coneAlpha;
        if (this.guardState === 'chase') { coneColor = CFG.visionCone.chaseColor; coneAlpha = CFG.visionCone.chaseAlpha; }
        else if (this.guardState === 'suspicious') { coneColor = CFG.visionCone.susColor; coneAlpha = CFG.visionCone.susAlpha; }
        else { coneColor = CFG.visionCone.patrolColor; coneAlpha = CFG.visionCone.patrolAlpha; }

        const coneLen = CFG.guard.visionRange;
        let facingAngle;
        switch (this.guardFacing) {
            case 'right': facingAngle = 0; break;
            case 'left': facingAngle = Math.PI; break;
            case 'down': facingAngle = Math.PI / 2; break;
            case 'up': facingAngle = -Math.PI / 2; break;
        }
        const halfAngle = CFG.guard.fovHalf;
        this.visionCone.fillStyle(coneColor, coneAlpha);
        this.visionCone.beginPath();
        this.visionCone.moveTo(this.guard.x, this.guard.y);
        const segments = CFG.visionCone.segments;
        for (let i = 0; i <= segments; i++) {
            const a = facingAngle - halfAngle + (halfAngle * 2 * i / segments);
            this.visionCone.lineTo(
                this.guard.x + Math.cos(a) * coneLen,
                this.guard.y + Math.sin(a) * coneLen
            );
        }
        this.visionCone.closePath();
        this.visionCone.fillPath();

        const flOff = this.guardFacing === 'right' ? CFG.flashlight.offsetSide : this.guardFacing === 'left' ? -CFG.flashlight.offsetSide : 0;
        const flOffY = this.guardFacing === 'down' ? CFG.flashlight.offsetDown : this.guardFacing === 'up' ? -CFG.flashlight.offsetDown : CFG.flashlight.offsetDefault;
        this.flashlight.setPosition(this.guard.x + flOff, this.guard.y + flOffY);
    }

    updateDarkness() {
        this.darkness.clear();
        this.darkness.fill(0x000000, CFG.lighting.darknessAlpha);

        // Convert world positions to screen positions for camera-fixed overlay
        const cam = this.cameras.main;
        const zoom = cam.zoom;

        const psx = (this.player.x - cam.scrollX) * zoom;
        const psy = (this.player.y - cam.scrollY) * zoom;
        const pSoft = this.lightRadius * CFG.lighting.playerSoftMul * zoom;
        const pHard = this.lightRadius * zoom;

        this.lightGfx.clear();
        this.lightGfx.fillStyle(CFG.lighting.playerSoftColor, 1);
        this.lightGfx.fillCircle(psx, psy, pSoft);
        this.lightGfx.fillStyle(0xffffff, 1);
        this.lightGfx.fillCircle(psx, psy, pHard);
        this.darkness.erase(this.lightGfx);

        const gsx = (this.guard.x - cam.scrollX) * zoom;
        const gsy = (this.guard.y - cam.scrollY) * zoom;
        const gSoft = this.guardLightRadius * CFG.lighting.guardSoftMul * zoom;
        const gHard = this.guardLightRadius * zoom;

        this.guardLightGfx.clear();
        this.guardLightGfx.fillStyle(CFG.lighting.guardSoftColor, 1);
        this.guardLightGfx.fillCircle(gsx, gsy, gSoft);
        this.guardLightGfx.fillStyle(0xffffff, 1);
        this.guardLightGfx.fillCircle(gsx, gsy, gHard);
        this.darkness.erase(this.guardLightGfx);
    }

    update(time, delta) {
        if (this.puzzleActive || this.escaped) {
            this.player.setVelocity(0);
            return;
        }

        if (this.hiding) {
            this.player.setVelocity(0);
            this.player.setAlpha(0);
            this.updateGuardAI(delta);
            const spaceJustDown = Phaser.Input.Keyboard.JustDown(this.spaceKey);
            if (spaceJustDown || this.actionPressed) {
                this.actionPressed = false;
                this.hiding = false;
                this.player.setAlpha(1);
                this.showMessage('You emerge from hiding.');
            }
            this.actionPressed = false;
            return;
        }

        const speed = this.SPEED;
        let vx = 0, vy = 0;

        if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -speed;
        else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = speed;
        if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -speed;
        else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = speed;

        if (this.mobile && (this.touchVX !== 0 || this.touchVY !== 0)) {
            vx = this.touchVX * speed;
            vy = this.touchVY * speed;
        }

        if (vx !== 0 && vy !== 0) {
            vx *= 0.707;
            vy *= 0.707;
        }

        this.player.setVelocity(vx, vy);

        const moving = vx !== 0 || vy !== 0;
        if (Math.abs(vx) > Math.abs(vy)) {
            this.playerDir = vx < 0 ? 'left' : 'right';
        } else if (vy !== 0) {
            this.playerDir = vy < 0 ? 'up' : 'down';
        }

        this.player.setTexture(`player_${this.playerDir}_0`).setDisplaySize(T, T);
        if (moving) {
            this.playerAnimTime = (this.playerAnimTime || 0) + delta * 0.008;
            const lean = Math.sin(this.playerAnimTime * 3) * 0.05;
            const squash = 1 + Math.sin(this.playerAnimTime * 6) * 0.04;
            this.player.setRotation(lean);
            this.player.setScale(T / this.player.width * squash, T / this.player.height / squash);
        } else {
            this.playerAnimTime = 0;
            this.player.setRotation(0);
            this.player.setScale(T / this.player.width, T / this.player.height);
        }

        this.updateGuardAI(delta);

        this.updateDarkness();

        const spaceJustDown = Phaser.Input.Keyboard.JustDown(this.spaceKey);
        let doAction = spaceJustDown || this.actionPressed;
        this.actionPressed = false;

        this.nearInteractable = false;
        this.hidePrompt();
        const px = this.player.x, py = this.player.y;

        if (this.hasKey) {
            this._cellDoors.forEach(cellDoor => {
                if (cellDoor && cellDoor.body && cellDoor.body.enable) {
                    const dist = Phaser.Math.Distance.Between(px, py, cellDoor.x, cellDoor.y);
                    if (dist < CFG.interact.door) {
                        this.nearInteractable = true;
                        this.showPrompt(this.mobile ? 'Tap  A  to use key' : 'SPACE to use key');
                        if (doAction) {
                            doAction = false;
                            this.cellDoorOpen = true;
                            this.openDoor(cellDoor);
                            this.showMessage('Cell door unlocked! Explore carefully...');
                        }
                    }
                }
            });
        }

        if (!this.exitDoorOpen) {
            const gsDoor = this._gsDoor;
            if (gsDoor && gsDoor.body && gsDoor.body.enable) {
                const dist = Phaser.Math.Distance.Between(px, py, gsDoor.x, gsDoor.y);
                if (dist < CFG.interact.door) {
                    this.nearInteractable = true;
                    if (this.hasKeycard) {
                        this.showPrompt(this.mobile ? 'Tap  A  to use keycard' : 'SPACE to use keycard');
                        if (doAction) {
                            doAction = false;
                            this.showMessage('Keycard accepted! Door open.');
                            this.openSecurityDoor();
                        }
                    } else {
                        this.showPrompt(this.mobile ? 'Tap  A  — LOCKED' : 'SPACE — LOCKED (need keycard)');
                        if (doAction) { doAction = false; this.showMessage('This door requires a keycard.'); }
                    }
                }
            }
        }

        const gsDoor2 = this._gsDoor2;
        if (gsDoor2 && gsDoor2.body && gsDoor2.body.enable) {
            const dist = Phaser.Math.Distance.Between(px, py, gsDoor2.x, gsDoor2.y);
            if (dist < CFG.interact.door) {
                this.nearInteractable = true;
                if (this.hasKeycard) {
                    this.showPrompt(this.mobile ? 'Tap  A  to use keycard' : 'SPACE to use keycard');
                    if (doAction) {
                        this.showMessage('Keycard accepted!');
                        this.openDoor(gsDoor2);
                    }
                } else {
                    this.showPrompt(this.mobile ? 'Tap  A  — LOCKED' : 'SPACE — LOCKED (need keycard)');
                    if (doAction) this.showMessage('This door requires a keycard.');
                }
            }
        }

        if (this.securityPanels && !this.exitDoorOpen) {
            this.securityPanels.forEach(panel => {
                const dist = Phaser.Math.Distance.Between(px, py, panel.x, panel.y);
                if (dist < CFG.interact.panel) {
                    this.nearInteractable = true;
                    this.showPrompt(this.mobile ? 'Tap  A  to hack panel' : 'SPACE to hack panel');
                    if (doAction) {
                        doAction = false;
                        if (this.hasKeycard) {
                            this.showMessage('Keycard accepted! Security door open.');
                            this.openSecurityDoor();
                        } else {
                            this.startPuzzle();
                        }
                    }
                }
            });
        }

        this.lockers.forEach(locker => {
            const dist = Phaser.Math.Distance.Between(px, py, locker.x, locker.y);
            if (dist < CFG.interact.locker) {
                this.nearInteractable = true;
                const row = locker.getData('row');
                const col = locker.getData('col');
                if (row === 3 && col === 25 && !locker.getData('searched')) {
                    this.showPrompt(this.mobile ? 'Tap  A  to search' : 'SPACE to search locker');
                    if (doAction) {
                        locker.setData('searched', true);
                        locker.setTexture('locker_open').setDisplaySize(T, T);
                        this.hasScrewdriver = true;
                        this.inventory.push('Screwdriver');
                        this.showMessage('Found a screwdriver!');
                        this.updateInventory();
                    }
                } else if (row === 12 && col === 2) {
                    this.showPrompt(this.mobile ? 'Tap  A  to hide' : 'SPACE to hide');
                    if (doAction) {
                        this.hiding = true;
                        this.player.setAlpha(0);
                        this.showMessage('You hide in the locker... (press action to emerge)');
                    }
                } else {
                    this.showPrompt(this.mobile ? 'Tap  A  to search' : 'SPACE to search');
                    if (doAction) {
                        if (!locker.getData('searched')) {
                            locker.setData('searched', true);
                            locker.setTexture('locker_open').setDisplaySize(T, T);
                            this.showMessage('Empty locker.');
                        } else {
                            this.showMessage('Already searched.');
                        }
                    }
                }
            }
        });

        this.crates.forEach(crate => {
            const dist = Phaser.Math.Distance.Between(px, py, crate.x, crate.y);
            if (dist < CFG.interact.crate) {
                this.nearInteractable = true;
                const row = crate.getData('row');
                const col = crate.getData('col');
                if (row === 3 && col === 27 && !crate.getData('searched')) {
                    this.showPrompt(this.mobile ? 'Tap  A  to search' : 'SPACE to search crate');
                    if (doAction) {
                        crate.setData('searched', true);
                        this.hasWireCutters = true;
                        this.inventory.push('Wire Cutters');
                        this.showMessage('Found wire cutters!');
                        this.updateInventory();
                    }
                } else {
                    this.showPrompt(this.mobile ? 'Tap  A  to search' : 'SPACE to search');
                    if (doAction) {
                        if (!crate.getData('searched')) {
                            crate.setData('searched', true);
                            this.showMessage('Nothing useful here.');
                        } else {
                            this.showMessage('Already searched.');
                        }
                    }
                }
            }
        });

        this.fences.forEach(fence => {
            if (fence.getData('cut')) return;
            const dist = Phaser.Math.Distance.Between(px, py, fence.x, fence.y);
            if (dist < CFG.interact.fence) {
                this.nearInteractable = true;
                if (this.hasWireCutters) {
                    this.showPrompt(this.mobile ? 'Tap  A  to cut fence' : 'SPACE to cut fence');
                    if (doAction) {
                        fence.setData('cut', true);
                        fence.setTexture('fence_cut').setDisplaySize(T, T);
                        this.walls.remove(fence);
                        fence.body.enable = false;
                        this.showMessage('You cut through the fence!');
                    }
                } else if (this.wirePuzzleSolved) {
                    this.showPrompt(this.mobile ? 'Tap  A  — power off!' : 'SPACE — fence power is off!');
                    if (doAction) {
                        fence.setData('cut', true);
                        fence.setTexture('fence_cut').setDisplaySize(T, T);
                        this.walls.remove(fence);
                        fence.body.enable = false;
                        this.showMessage('The fence is unpowered — you push through easily!');
                    }
                } else {
                    this.showPrompt('Need wire cutters');
                }
            }
        });

        this._bedPositions.forEach(bed => {
            const dist = Phaser.Math.Distance.Between(px, py, bed.x, bed.y);
            if (dist < CFG.interact.bed) {
                this.nearInteractable = true;
                this.showPrompt(this.mobile ? 'Tap  A  to hide' : 'SPACE to hide under bed');
                if (doAction) {
                    this.hiding = true;
                    this.player.setAlpha(0);
                    this.showMessage('You hide under the bed... (press action to emerge)');
                }
            }
        });

        // -- Safe interaction --
        if (!this.safeOpen) {
            this.safeTiles.forEach(t => {
                const dist = Phaser.Math.Distance.Between(px, py, t.x, t.y);
                if (dist < CFG.interact.safe) {
                    this.nearInteractable = true;
                    this.showPrompt(this.mobile ? 'Tap  A  to open safe' : 'SPACE to open safe');
                    if (doAction) { doAction = false; this.startSafePuzzle(); }
                }
            });
        }

        // -- Binary panel interaction --
        if (!this.binaryPanelSolved) {
            this.binaryPanelTiles.forEach(t => {
                const dist = Phaser.Math.Distance.Between(px, py, t.x, t.y);
                if (dist < CFG.interact.binaryPanel) {
                    this.nearInteractable = true;
                    this.showPrompt(this.mobile ? 'Tap  A  to use panel' : 'SPACE to use panel');
                    if (doAction) { doAction = false; this.startBinaryPuzzle(); }
                }
            });
        }

        // -- Cipher station interaction --
        if (!this.cipherSolved) {
            this.cipherTiles.forEach(t => {
                const dist = Phaser.Math.Distance.Between(px, py, t.x, t.y);
                if (dist < CFG.interact.cipher) {
                    this.nearInteractable = true;
                    this.showPrompt(this.mobile ? 'Tap  A  to decode' : 'SPACE to decode message');
                    if (doAction) { doAction = false; this.startCipherPuzzle(); }
                }
            });
        }

        // -- Computer terminal interaction --
        this.computerTiles.forEach(t => {
            const dist = Phaser.Math.Distance.Between(px, py, t.x, t.y);
            if (dist < CFG.interact.computer) {
                this.nearInteractable = true;
                this.showPrompt(this.mobile ? 'Tap  A  to use computer' : 'SPACE to use computer');
                if (doAction) { doAction = false; this.startTerminal(); }
            }
        });

        // -- Schedule board interaction --
        this.scheduleTiles.forEach(t => {
            const dist = Phaser.Math.Distance.Between(px, py, t.x, t.y);
            if (dist < CFG.interact.schedule) {
                this.nearInteractable = true;
                this.showPrompt(this.mobile ? 'Tap  A  to read' : 'SPACE to read schedule');
                if (doAction) { doAction = false; this.showSchedule(); }
            }
        });

        // -- Wire puzzle interaction --
        if (!this.wirePuzzleSolved) {
            this.wirePuzzleTiles.forEach(t => {
                const dist = Phaser.Math.Distance.Between(px, py, t.x, t.y);
                if (dist < CFG.interact.wirePuzzle) {
                    this.nearInteractable = true;
                    this.showPrompt(this.mobile ? 'Tap  A  to fix wires' : 'SPACE to fix wires');
                    if (doAction) { doAction = false; this.startWirePuzzle(); }
                }
            });
        }

        // -- Pattern door interaction --
        this.patternDoors.forEach(pdoor => {
            if (!pdoor.body || !pdoor.body.enable) return;
            const dist = Phaser.Math.Distance.Between(px, py, pdoor.x, pdoor.y);
            if (dist < CFG.interact.patternDoor) {
                this.nearInteractable = true;
                this.showPrompt(this.mobile ? 'Tap  A  to solve' : 'SPACE to solve pattern');
                if (doAction) { doAction = false; this.startPatternPuzzle(); }
            }
        });

        // -- Tally wall interaction --
        if (!this.tallySolved) {
            this.tallyTiles.forEach(t => {
                const dist = Phaser.Math.Distance.Between(px, py, t.x, t.y);
                if (dist < CFG.interact.tally) {
                    this.nearInteractable = true;
                    this.showPrompt(this.mobile ? 'Tap  A  to count' : 'SPACE to count marks');
                    if (doAction) { doAction = false; this.startTallyPuzzle(); }
                }
            });
        }

        // -- Morse radio interaction --
        if (!this.morseSolved) {
            this.morseTiles.forEach(t => {
                const dist = Phaser.Math.Distance.Between(px, py, t.x, t.y);
                if (dist < CFG.interact.morseRadio) {
                    this.nearInteractable = true;
                    this.showPrompt(this.mobile ? 'Tap  A  to use radio' : 'SPACE to use radio');
                    if (doAction) { doAction = false; this.startMorsePuzzle(); }
                }
            });
        }

        // -- Graffiti wall interaction --
        this.graffitiTiles.forEach(t => {
            const dist = Phaser.Math.Distance.Between(px, py, t.x, t.y);
            if (dist < CFG.interact.graffiti) {
                this.nearInteractable = true;
                this.showPrompt(this.mobile ? 'Tap  A  to read' : 'SPACE to read graffiti');
                if (doAction) {
                    doAction = false;
                    const msgs = this._graffitiMsgs();
                    this.showMessage(msgs[t.idx % msgs.length], 4000);
                }
            }
        });

        // -- Pushable crate mechanics --
        this.pushableCrates.forEach(pcrate => {
            if (!pcrate.body || !pcrate.body.enable) return;
            const dist = Phaser.Math.Distance.Between(px, py, pcrate.x, pcrate.y);
            if (dist < T * 1.2 && moving) {
                let pushDx = 0, pushDy = 0;
                if (this.playerDir === 'right' && px < pcrate.x) pushDx = T;
                else if (this.playerDir === 'left' && px > pcrate.x) pushDx = -T;
                else if (this.playerDir === 'down' && py < pcrate.y) pushDy = T;
                else if (this.playerDir === 'up' && py > pcrate.y) pushDy = -T;

                if ((pushDx !== 0 || pushDy !== 0) && !pcrate.getData('moving')) {
                    const newX = pcrate.x + pushDx;
                    const newY = pcrate.y + pushDy;
                    const tileCol = Math.round((newX - T / 2) / T);
                    const tileRow = Math.round((newY - T / 2) / T);
                    if (tileRow >= 0 && tileRow < MAP.length && tileCol >= 0 && tileCol < MAP[0].length && MAP[tileRow][tileCol] !== 1) {
                        pcrate.setData('moving', true);
                        this.showMessage('You shove the crate labeled "NOT SUSPICIOUS" across the floor.', 2500);
                        this.tweens.add({
                            targets: pcrate, x: newX, y: newY, duration: 300, ease: 'Power2',
                            onComplete: () => {
                                pcrate.setData('moving', false);
                                pcrate.body.reset(newX, newY);
                                this._checkPressurePlates();
                            }
                        });
                    }
                }
            }
        });

        // -- Rat buddy: use cheese near rat spawn area --
        if (this.hasCheese && !this.hasRatBuddy) {
            const ratSpawnX = 13 * T + T / 2;
            const ratSpawnY = 4 * T + T / 2;
            const ratDist = Phaser.Math.Distance.Between(px, py, ratSpawnX, ratSpawnY);
            if (ratDist < CFG.interact.ratSpawn) {
                this.nearInteractable = true;
                this.showPrompt(this.mobile ? 'Tap  A  to offer cheese' : 'SPACE to offer cheese');
                if (doAction) {
                    doAction = false;
                    this.hasRatBuddy = true;
                    this.hasCheese = false;
                    this.inventory = this.inventory.filter(i => i !== 'Cheese');
                    this.updateInventory();
                    this.ratBuddySprite = this.add.image(ratSpawnX, ratSpawnY, 'rat').setScale(1.2 * AS).setDepth(4);
                    this.showMessage('Sir Squeaks has joined your party! He\'s small but mighty.', 4000);
                }
            }
        }

        // -- Rat buddy follow AI --
        if (this.hasRatBuddy && this.ratBuddySprite && !this.ratDistractActive) {
            const rdist = Phaser.Math.Distance.Between(this.ratBuddySprite.x, this.ratBuddySprite.y, px, py);
            if (rdist > CFG.rat.followDist) {
                const angle = Phaser.Math.Angle.Between(this.ratBuddySprite.x, this.ratBuddySprite.y, px, py);
                this.ratBuddySprite.x += Math.cos(angle) * CFG.rat.followSpeed * delta / 1000;
                this.ratBuddySprite.y += Math.sin(angle) * CFG.rat.followSpeed * delta / 1000;
            }
            this.ratBuddySprite.setFlipX(this.ratBuddySprite.x > px);
        }

        // -- Rat buddy distract guard --
        if (this.hasRatBuddy && !this.ratDistractActive && this.guardState === 'chase') {
            this.nearInteractable = true;
            if (doAction) {
                doAction = false;
                this.ratDistractActive = true;
                this.guardState = 'distracted';
                this.guard.setVelocity(0);
                this.guardIcon.setText('🐀?!');
                this.showMessage('Sir Squeaks distracts the guard! "A RAT?! AHHH!"', 3000);
                this.tweens.add({
                    targets: this.ratBuddySprite,
                    x: this.guard.x, y: this.guard.y,
                    duration: 500
                });
                this.time.delayedCall(CFG.rat.distractDur, () => {
                    this.ratDistractActive = false;
                    this.guardState = 'patrol';
                    this.guardWaypointIdx = 0;
                    this.guardIcon.setText('');
                    if (this.ratBuddySprite) {
                        this.tweens.add({
                            targets: this.ratBuddySprite,
                            x: px, y: py, duration: 600
                        });
                    }
                });
            }
        }

        if (this.mobile) {
            const ui = this._getUI();
            if (ui) ui.highlightAction(this.nearInteractable);
        }
    }
}


export default GameScene;
