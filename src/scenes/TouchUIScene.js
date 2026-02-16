import { S, CFG, isMobile } from '../config.js';

class TouchUIScene extends Phaser.Scene {
    constructor() { super('TouchUIScene'); }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        const joyRadius = CFG.touch.joyRadius;
        this.mobile = isMobile();

        if (this.mobile) {
            const joyX = CFG.touch.joyX;
            const joyY = h - CFG.touch.joyYOff;

            this.joyBase = this.add.circle(joyX, joyY, CFG.touch.joyBaseRadius, 0xffffff, 0.12)
                .setStrokeStyle(Math.round(2 * S), 0xffffff, 0.25);
            this.joyThumb = this.add.circle(joyX, joyY, CFG.touch.joyThumbRadius, 0xffffff, 0.4)
                .setStrokeStyle(Math.round(2 * S), 0xffffff, 0.6);
            const aStyle = { fontSize: `${Math.round(16 * S)}px`, color: '#ffffff', fontFamily: 'monospace' };
            this.add.text(joyX, joyY - 48 * S, '\u25B2', aStyle).setOrigin(0.5).setAlpha(0.3);
            this.add.text(joyX, joyY + 48 * S, '\u25BC', aStyle).setOrigin(0.5).setAlpha(0.3);
            this.add.text(joyX - 48 * S, joyY, '\u25C0', aStyle).setOrigin(0.5).setAlpha(0.3);
            this.add.text(joyX + 48 * S, joyY, '\u25B6', aStyle).setOrigin(0.5).setAlpha(0.3);

            this.joyActive = false;
            this.joyPointerId = null;
            this.joyOriginX = joyX;
            this.joyOriginY = joyY;
            this.joyDefaultX = joyX;
            this.joyDefaultY = joyY;

            const btnX = w - CFG.touch.btnXOff;
            const btnY = h - CFG.touch.btnYOff;
            this.actionGlow = this.add.circle(btnX, btnY, CFG.touch.btnRadius + 8 * S, 0xff6600, 0);
            this.actionGlowTween = null;
            this.actionBtn = this.add.circle(btnX, btnY, CFG.touch.btnRadius, 0xff6600, 0.6)
                .setStrokeStyle(Math.round(3 * S), 0xffaa44, 0.8);
            this.actionLabel = this.add.text(btnX, btnY, 'A', {
                fontSize: `${Math.round(26 * S)}px`, fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold'
            }).setOrigin(0.5);

            this.actionPointerId = null;

            this.input.on('pointerdown', (pointer) => {
                const gameScene = this.scene.get('GameScene');
                if (pointer.x > w * 0.4) {
                    if (gameScene && !gameScene.puzzleActive) gameScene.actionPressed = true;
                    this.actionPointerId = pointer.id;
                    this.actionBtn.setFillStyle(0xff8833, 0.9);
                }
                if (pointer.x < w * 0.5 && !this.joyActive && !(gameScene && gameScene.puzzleActive)) {
                    this.joyActive = true;
                    this.joyPointerId = pointer.id;
                    this.joyOriginX = pointer.x;
                    this.joyOriginY = pointer.y;
                    this.joyBase.setPosition(pointer.x, pointer.y);
                    this.joyThumb.setPosition(pointer.x, pointer.y);
                }
            });

            this.input.on('pointermove', (pointer) => {
                if (this.joyActive && pointer.id === this.joyPointerId) {
                    const dx = pointer.x - this.joyOriginX;
                    const dy = pointer.y - this.joyOriginY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const clampDist = Math.min(dist, joyRadius);
                    const angle = Math.atan2(dy, dx);

                    this.joyThumb.setPosition(
                        this.joyOriginX + Math.cos(angle) * clampDist,
                        this.joyOriginY + Math.sin(angle) * clampDist
                    );

                    const gameScene = this.scene.get('GameScene');
                    if (gameScene) {
                        if (dist > CFG.touch.deadzone) {
                            gameScene.touchVX = Math.cos(angle) * (clampDist / joyRadius);
                            gameScene.touchVY = Math.sin(angle) * (clampDist / joyRadius);
                        } else {
                            gameScene.touchVX = 0;
                            gameScene.touchVY = 0;
                        }
                    }
                }
            });

            this.input.on('pointerup', (pointer) => {
                if (pointer.id === this.actionPointerId) {
                    this.actionBtn.setFillStyle(0xff6600, 0.6);
                    this.actionPointerId = null;
                }
                if (pointer.id === this.joyPointerId) {
                    this.joyActive = false;
                    this.joyPointerId = null;
                    this.joyBase.setPosition(this.joyDefaultX, this.joyDefaultY);
                    this.joyThumb.setPosition(this.joyDefaultX, this.joyDefaultY);
                    const gameScene = this.scene.get('GameScene');
                    if (gameScene) {
                        gameScene.touchVX = 0;
                        gameScene.touchVY = 0;
                    }
                }
            });

            this._onVisChange = () => {
                if (!document.hidden) {
                    this.joyActive = false;
                    this.joyPointerId = null;
                    this.actionPointerId = null;
                    this.joyBase.setPosition(this.joyDefaultX, this.joyDefaultY);
                    this.joyThumb.setPosition(this.joyDefaultX, this.joyDefaultY);
                    this.actionBtn.setFillStyle(0xff6600, 0.6);
                    const gameScene = this.scene.get('GameScene');
                    if (gameScene) {
                        gameScene.touchVX = 0;
                        gameScene.touchVY = 0;
                    }
                }
            };
            document.addEventListener('visibilitychange', this._onVisChange);
        }

        this.events.on('shutdown', this._shutdown, this);

        this.promptText = this.add.text(w / 2, this.mobile ? h - 170 * S : h - 60 * S, '', {
            fontSize: this.mobile ? `${Math.round(18 * S)}px` : `${Math.round(14 * S)}px`, fontFamily: 'monospace', color: '#88ff88',
            backgroundColor: '#000000cc', padding: { x: 16 * S, y: 10 * S }, align: 'center',
            stroke: '#004400', strokeThickness: 2 * S
        }).setOrigin(0.5).setAlpha(0);

        this.msgText = this.add.text(w / 2, 65 * S, '', {
            fontSize: `${Math.round(15 * S)}px`, fontFamily: 'monospace', color: '#ffcc00',
            backgroundColor: '#000000cc', padding: { x: 14 * S, y: 8 * S },
            wordWrap: { width: w - 60 * S }, align: 'center'
        }).setOrigin(0.5).setAlpha(0);

        this.invSlots = [];
        this.invLabels = [];
        const slotSize = 36 * S;
        const slotPad = 4 * S;
        const invStartX = (w - (slotSize + slotPad) * 6 + slotPad) / 2;
        const invY = 12 * S;

        this.invBg = this.add.rectangle(w / 2, invY + slotSize / 2, (slotSize + slotPad) * 6 + 12 * S, slotSize + 8 * S, 0x000000, 0.5)
            .setDepth(10);

        for (let i = 0; i < 6; i++) {
            const sx = invStartX + i * (slotSize + slotPad);
            const slot = this.add.rectangle(sx + slotSize / 2, invY + slotSize / 2, slotSize, slotSize, 0x1a1a2a, 0.7)
                .setStrokeStyle(1, 0x445566, 0.5).setDepth(11);
            const label = this.add.text(sx + slotSize / 2, invY + slotSize + 2 * S, '', {
                fontSize: `${Math.round(7 * S)}px`, fontFamily: 'monospace', color: '#888888', align: 'center'
            }).setOrigin(0.5, 0).setDepth(11);
            this.invSlots.push(slot);
            this.invLabels.push(label);
        }

        this.invIcons = [];
    }

    showPrompt(text) { this.promptText.setText(text).setAlpha(1); }
    hidePrompt() { this.promptText.setAlpha(0); }

    showMessage(text, duration) {
        this.msgText.setText(text).setAlpha(1);
        if (this.msgTimer) this.msgTimer.remove();
        this.msgTimer = this.time.delayedCall(duration || 3000, () => {
            this.tweens.add({ targets: this.msgText, alpha: 0, duration: 500 });
        });
    }

    updateInventory(items) {
        this.invIcons.forEach(ic => ic.destroy());
        this.invIcons = [];

        const slotSize = 36 * S;
        const slotPad = 4 * S;
        const w = this.scale.width;
        const invStartX = (w - (slotSize + slotPad) * 6 + slotPad) / 2;
        const invY = 12 * S;

        const iconMap = {
            'Cell Key': 'key',
            'Screwdriver': 'screwdriver',
            'Wire Cutters': 'wire_cutters',
            'Keycard': 'keycard',
            'Cheese': 'cheese',
            'Diary': 'diary_page'
        };

        for (let i = 0; i < this.invSlots.length; i++) {
            if (i < items.length) {
                const sx = invStartX + i * (slotSize + slotPad);
                const texKey = iconMap[items[i]];
                if (texKey) {
                    const icon = this.add.image(sx + slotSize / 2, invY + slotSize / 2, texKey)
                        .setDisplaySize(slotSize * 0.8, slotSize * 0.8).setDepth(12);
                    this.invIcons.push(icon);
                }
                this.invSlots[i].setStrokeStyle(1, 0x88aa44, 0.8);
                this.invLabels[i].setText(items[i]);
            } else {
                this.invSlots[i].setStrokeStyle(1, 0x445566, 0.5);
                this.invLabels[i].setText('');
            }
        }
    }

    addVignette() {
        const w = this.scale.width;
        const h = this.scale.height;
        const v = this.add.graphics().setDepth(50);
        const steps = CFG.vignette.steps;
        for (let i = 0; i < steps; i++) {
            const a = CFG.vignette.maxAlpha * (1 - i / steps);
            v.fillStyle(0x000000, a);
            v.fillRect(0, i * (h * CFG.vignette.bandH), w, h * CFG.vignette.bandH);
            v.fillRect(0, h - (i + 1) * (h * CFG.vignette.bandH), w, h * CFG.vignette.bandH);
            v.fillRect(i * (w * CFG.vignette.bandW), 0, w * CFG.vignette.bandW, h);
            v.fillRect(w - (i + 1) * (w * CFG.vignette.bandW), 0, w * CFG.vignette.bandW, h);
        }
    }

    highlightAction(near) {
        if (near) {
            this.actionBtn.setAlpha(0.9);
            this.actionLabel.setAlpha(0.9);
            if (!this.actionGlowTween) {
                this.actionGlow.setAlpha(0.3);
                this.actionGlowTween = this.tweens.add({
                    targets: this.actionGlow, alpha: 0.05, scale: 1.3,
                    duration: 600, yoyo: true, repeat: -1
                });
            }
        } else {
            this.actionBtn.setAlpha(0.5);
            this.actionLabel.setAlpha(0.4);
            if (this.actionGlowTween) {
                this.actionGlowTween.stop();
                this.actionGlowTween = null;
                this.actionGlow.setAlpha(0);
            }
        }
    }

    _shutdown() {
        if (this._onVisChange) {
            document.removeEventListener('visibilitychange', this._onVisChange);
            this._onVisChange = null;
        }
        this.input.removeAllListeners();
    }
}


export default TouchUIScene;
