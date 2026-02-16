import { S } from '../config.js';

class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }

    preload() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        this.cameras.main.setBackgroundColor('#0a0a0a');

        const title = this.add.text(cx, cy - 80 * S, 'MANI', {
            fontSize: `${Math.round(60 * S)}px`, fontFamily: 'monospace', color: '#ff6600',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.tweens.add({
            targets: title, alpha: 0.3, duration: 200,
            yoyo: true, repeat: 2, onComplete: () => title.setAlpha(1)
        });

        const messages = [
            'Bribing the guards...',
            'Sharpening the spoon...',
            'Memorizing patrol routes...',
            'Hiding contraband...',
            'Checking for cameras...',
            'Loosening the vent screws...',
        ];
        const msgText = this.add.text(cx, cy + 10 * S, messages[0], {
            fontSize: `${Math.round(14 * S)}px`, fontFamily: 'monospace', color: '#888888',
            fontStyle: 'italic'
        }).setOrigin(0.5);
        let msgIdx = 0;
        this.time.addEvent({
            delay: 600, repeat: messages.length - 1,
            callback: () => {
                msgIdx++;
                if (msgIdx < messages.length) msgText.setText(messages[msgIdx]);
            }
        });

        const barW = 240 * S, barH = 8 * S;
        this.add.rectangle(cx, cy + 50 * S, barW + 4 * S, barH + 4 * S, 0x333344).setOrigin(0.5);
        const progressBar = this.add.rectangle(
            cx - barW/2, cy + 50 * S, 0, barH, 0xff6600
        ).setOrigin(0, 0.5);

        for (let i = 0; i < 12; i++) {
            const bar = this.add.rectangle(
                cx - 200 * S + i * 36 * S, cy, 3 * S, 300 * S, 0x333344, 0.15
            );
            this.tweens.add({
                targets: bar, alpha: 0.05, duration: 400,
                yoyo: true, repeat: -1, delay: i * 60
            });
        }

        this.load.on('progress', (v) => {
            progressBar.width = barW * v;
        });

        // ─── Load all AI-generated PNG assets ───

        // Environment tiles
        const tiles = [
            'wall', 'floor', 'floor_dirty', 'bars',
            'door_locked', 'door_unlocked', 'bed', 'toilet', 'vent',
            'table', 'locker', 'locker_open', 'crate', 'fence', 'fence_cut',
            'security_panel', 'safe', 'binary_panel', 'cipher_station',
            'computer', 'schedule_board', 'wire_puzzle', 'pattern_door',
            'tally_wall', 'morse_radio', 'pressure_plate', 'pressure_plate_active',
            'pushable_crate', 'graffiti_wall'
        ];
        for (const t of tiles) {
            this.load.image(t, `assets/tiles/${t}.png`);
        }

        // Character sprites — only base frame per direction (animation is procedural)
        const dirs = ['down', 'up', 'left', 'right'];
        for (const d of dirs) {
            this.load.image(`player_${d}_0`, `assets/characters/player_${d}_0.png`);
            this.load.image(`guard_${d}_0`, `assets/characters/guard_${d}_0.png`);
        }
        this.load.image('rat', 'assets/characters/rat.png');

        // Items
        const items = ['key', 'screwdriver', 'wire_cutters', 'keycard', 'cheese', 'diary_page', 'hint'];
        for (const item of items) {
            this.load.image(item, `assets/items/${item}.png`);
        }

        // Effects — generated programmatically (no PNG loading)
        this._generateFlashlight();
        this._generateParticle();
    }

    _generateFlashlight() {
        const c = document.createElement('canvas');
        c.width = 128; c.height = 128;
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, 128, 128);
        const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0, 'rgba(255,255,180,0.15)');
        g.addColorStop(0.5, 'rgba(255,255,150,0.06)');
        g.addColorStop(1, 'rgba(255,255,100,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 128, 128);
        this.textures.addCanvas('flashlight', c);
    }

    _generateParticle() {
        const c = document.createElement('canvas');
        c.width = 8; c.height = 8;
        const ctx = c.getContext('2d');
        const g = ctx.createRadialGradient(4, 4, 0, 4, 4, 4);
        g.addColorStop(0, 'rgba(255,255,200,0.8)');
        g.addColorStop(1, 'rgba(255,200,100,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 8, 8);
        this.textures.addCanvas('particle', c);
    }

    create() {
        this.cameras.main.fade(300, 0, 0, 0);
        this.time.delayedCall(300, () => this.scene.start('MenuScene'));
    }
}

export default BootScene;
