import { S, MANI_BIRTH, UNCLE_BIRTH, getAge, isBedtime, isManisBirthday, isMobile } from '../config.js';

class MenuScene extends Phaser.Scene {
    constructor() { super('MenuScene'); }

    _makeTitle() {
        const cvs = document.createElement('canvas');
        cvs.width = 1600; cvs.height = 400;
        const ctx = cvs.getContext('2d');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const tx = 800, ty = 210;
        const font = 'bold 300px "Arial Black", Impact, sans-serif';
        ctx.font = font;

        // pass 1 — wide outer glow (golden, not red)
        ctx.save();
        ctx.shadowColor = '#ddaa22';
        ctx.shadowBlur = 80;
        ctx.fillStyle = 'rgba(220,170,34,0.4)';
        for (let i = 0; i < 6; i++) ctx.fillText('MANI', tx, ty);
        ctx.restore();

        // pass 2 — thick dark stroke
        ctx.lineWidth = 24;
        ctx.strokeStyle = '#1a1200';
        ctx.strokeText('MANI', tx, ty);

        // pass 3 — gradient fill (golden/amber)
        const grad = ctx.createLinearGradient(tx - 440, ty - 120, tx + 440, ty + 120);
        grad.addColorStop(0, '#ffe066');
        grad.addColorStop(0.25, '#ffcc33');
        grad.addColorStop(0.5, '#eebb22');
        grad.addColorStop(0.75, '#ffcc33');
        grad.addColorStop(1, '#ffe066');
        ctx.fillStyle = grad;
        ctx.fillText('MANI', tx, ty);

        // pass 4 — inner stroke for depth
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#fff4cc';
        ctx.strokeText('MANI', tx, ty);

        // pass 5 — top highlight shine
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const shine = ctx.createLinearGradient(tx, ty - 140, tx, ty + 30);
        shine.addColorStop(0, 'rgba(255,255,240,0.5)');
        shine.addColorStop(0.4, 'rgba(255,255,200,0.12)');
        shine.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = shine;
        ctx.fillText('MANI', tx, ty);
        ctx.restore();

        this.textures.addCanvas('menu_title', cvs);
    }

    _makeSubtitle() {
        const cvs = document.createElement('canvas');
        cvs.width = 1536; cvs.height = 150;
        const ctx = cvs.getContext('2d');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const tx = 768, ty = 80;
        const font = 'bold 70px "Arial Black", Impact, sans-serif';
        ctx.font = font; ctx.letterSpacing = '16px';

        // glow
        ctx.save();
        ctx.shadowColor = '#7799cc';
        ctx.shadowBlur = 36;
        ctx.fillStyle = 'rgba(120,153,204,0.35)';
        for (let i = 0; i < 3; i++) ctx.fillText('PRISON  ESCAPE', tx, ty);
        ctx.restore();

        // stroke
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#1a1a33';
        ctx.strokeText('PRISON  ESCAPE', tx, ty);

        // fill gradient
        const g = ctx.createLinearGradient(tx - 380, ty, tx + 380, ty);
        g.addColorStop(0, '#8899bb');
        g.addColorStop(0.5, '#ccddef');
        g.addColorStop(1, '#8899bb');
        ctx.fillStyle = g;
        ctx.fillText('PRISON  ESCAPE', tx, ty);

        this.textures.addCanvas('menu_subtitle', cvs);
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        const cx = w / 2;
        const cy = h / 2;

        const maniAge = getAge(MANI_BIRTH);
        const uncleAge = getAge(UNCLE_BIRTH);
        const ageDiff = uncleAge - maniAge;
        const bedtime = isBedtime();
        const birthday = isManisBirthday();
        const hour = new Date().getHours();

        // --- background gradient ---
        const bgGfx = this.add.graphics();
        bgGfx.fillStyle(0x0a0e1a);
        bgGfx.fillRect(0, 0, w, h);
        // dark gradient overlay
        for (let i = 0; i < 20; i++) {
            const a = 0.02 + (i / 20) * 0.04;
            bgGfx.fillStyle(0x0c1428, a);
            bgGfx.fillRect(0, i * (h / 20), w, h / 20);
        }

        // --- animated fog layers ---
        for (let layer = 0; layer < 3; layer++) {
            const fogGfx = this.add.graphics();
            const fogAlpha = 0.025 + layer * 0.01;
            const fogColor = [0x223355, 0x1a2244, 0x334466][layer];
            for (let j = 0; j < 6; j++) {
                const fx = Math.random() * w;
                const fy = h * 0.3 + Math.random() * h * 0.5;
                const fr = (60 + Math.random() * 120) * S;
                fogGfx.fillStyle(fogColor, fogAlpha);
                fogGfx.fillCircle(fx, fy, fr);
            }
            this.tweens.add({
                targets: fogGfx, x: (-40 + layer * 20) * S,
                duration: 6000 + layer * 2000, yoyo: true, repeat: -1,
                ease: 'Sine.easeInOut'
            });
            this.tweens.add({
                targets: fogGfx, alpha: 0.4 + layer * 0.1,
                duration: 4000 + layer * 1500, yoyo: true, repeat: -1,
                ease: 'Sine.easeInOut', delay: layer * 800
            });
        }

        // --- floating dust particles ---
        for (let i = 0; i < 35; i++) {
            const size = (1 + Math.random() * 2.5) * S;
            const px = Math.random() * w;
            const py = Math.random() * h;
            const dot = this.add.circle(px, py, size, 0xffffff, 0.03 + Math.random() * 0.08);
            dot.setBlendMode(Phaser.BlendModes.ADD);
            this.tweens.add({
                targets: dot, y: py - (30 + Math.random() * 60) * S,
                x: px + (Math.random() - 0.5) * 80 * S,
                alpha: 0, duration: 5000 + Math.random() * 6000,
                repeat: -1, delay: Math.random() * 4000,
                onRepeat: () => { dot.setPosition(Math.random() * w, h + 10); dot.setAlpha(0.03 + Math.random() * 0.08); }
            });
        }

        // --- prison bar light rays ---
        for (let i = 0; i < 7; i++) {
            const rayX = cx - 150 * S + i * 50 * S;
            const ray = this.add.rectangle(rayX, cy - 40 * S, 3 * S, h * 0.85, 0xffffff, 0.015);
            ray.setBlendMode(Phaser.BlendModes.ADD);
            this.tweens.add({
                targets: ray, alpha: 0.04, scaleX: 2.5,
                duration: 2000 + i * 300, yoyo: true, repeat: -1,
                delay: i * 200, ease: 'Sine.easeInOut'
            });
        }

        // --- build title textures ---
        if (!this.textures.exists('menu_title')) this._makeTitle();
        if (!this.textures.exists('menu_subtitle')) this._makeSubtitle();

        // --- MANI title — cinematic entrance ---
        const title = this.add.image(cx, cy - 155 * S, 'menu_title').setAlpha(0).setScale(1.5);
        this.tweens.add({
            targets: title, scale: 0.5, alpha: 1,
            duration: 700, ease: 'Back.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: title, y: title.y - 4 * S,
                    duration: 2500, yoyo: true, repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });

        // title glow pulse behind (golden, not red)
        const titleGlow = this.add.circle(cx, cy - 155 * S, 100 * S, 0xddaa22, 0).setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({
            targets: titleGlow, alpha: 0.06, scaleX: 2.8, scaleY: 1.2,
            duration: 700, ease: 'Cubic.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: titleGlow, alpha: 0.02, scaleX: 2.5, scaleY: 1,
                    duration: 2000, yoyo: true, repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });

        // --- subtitle entrance ---
        const subtitle = this.add.image(cx, cy - 90 * S, 'menu_subtitle').setAlpha(0).setScale(0.25 * S);
        this.tweens.add({
            targets: subtitle, scale: 0.5 * S, alpha: 1,
            duration: 600, delay: 300, ease: 'Back.easeOut'
        });

        // --- chapter line ---
        const chapter = this.add.text(cx, cy - 62 * S, 'Chapter 1: The Breakout', {
            fontSize: `${Math.round(14 * S)}px`, fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
            color: '#556688', fontStyle: 'italic'
        }).setOrigin(0.5).setAlpha(0);
        this.tweens.add({ targets: chapter, alpha: 0.8, y: cy - 64 * S, duration: 600, delay: 600, ease: 'Cubic.easeOut' });

        // --- divider line ---
        const divider = this.add.rectangle(cx, cy - 50 * S, 0, 2 * S, 0x445577, 0.4);
        this.tweens.add({ targets: divider, displayWidth: 200 * S, duration: 500, delay: 700, ease: 'Cubic.easeOut' });

        // --- tagline ---
        const funnyLines = [
            `A game by Mani (age ${maniAge}) & his uncle (age ${uncleAge})`,
            `Mani is ${maniAge} and already plotting prison breaks`,
            `Uncle is ${ageDiff} years older but Mani is ${ageDiff}x cooler`,
            `${maniAge}-year-old mastermind. ${uncleAge}-year-old accomplice.`,
            `Mani was born to escape. Uncle was born to code it.`,
            `${ageDiff} years apart, 1 great team.`,
        ];
        const lineIdx = Math.floor(Math.random() * funnyLines.length);
        const tagline = this.add.text(cx, cy - 36 * S, funnyLines[lineIdx], {
            fontSize: `${Math.round(12 * S)}px`, fontFamily: '"Trebuchet MS", sans-serif',
            color: '#cc9944', fontStyle: 'italic', align: 'center',
            wordWrap: { width: w - 60 * S }
        }).setOrigin(0.5).setAlpha(0);
        this.tweens.add({ targets: tagline, alpha: 0.9, duration: 800, delay: 900 });

        // --- bedtime / birthday (above characters) ---
        let extraY = cy - 18 * S;
        if (bedtime) {
            const bedtimeTexts = [
                `It's past ${maniAge > 10 ? '10' : '9'} PM... shouldn't you be in bed, Mani?`,
                `Even prison guards sleep at this hour!`,
                `Late night escape mission activated!`,
                `Shh... everyone's asleep. Perfect time to escape!`,
            ];
            const btIdx = Math.floor(Math.random() * bedtimeTexts.length);
            const bedtimeMsg = this.add.text(cx, extraY, bedtimeTexts[btIdx], {
                fontSize: `${Math.round(11 * S)}px`, fontFamily: '"Trebuchet MS", sans-serif',
                color: '#8899dd', fontStyle: 'italic', align: 'center'
            }).setOrigin(0.5).setAlpha(0);
            this.tweens.add({ targets: bedtimeMsg, alpha: 0.9, duration: 800, delay: 1600 });
            this.tweens.add({
                targets: bedtimeMsg, alpha: 0.3, duration: 2000,
                yoyo: true, repeat: -1, delay: 2400, ease: 'Sine.easeInOut'
            });
            extraY -= 14 * S;
        }

        if (birthday) {
            const bdText = this.add.text(cx, extraY, `Happy Birthday Mani! You're ${maniAge} today!`, {
                fontSize: `${Math.round(13 * S)}px`, fontFamily: '"Trebuchet MS", sans-serif',
                color: '#ffdd44', fontStyle: 'bold'
            }).setOrigin(0.5).setAlpha(0);
            this.tweens.add({ targets: bdText, alpha: 1, duration: 600, delay: 800 });
            this.tweens.add({
                targets: bdText, scale: 1.05, duration: 1000,
                yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });
            // confetti
            for (let i = 0; i < 25; i++) {
                const colors = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff, 0x44ffff];
                const confetti = this.add.rectangle(
                    Math.random() * w, -10,
                    (2 + Math.random() * 4) * S, (6 + Math.random() * 8) * S,
                    colors[Math.floor(Math.random() * colors.length)], 0.7
                );
                confetti.setBlendMode(Phaser.BlendModes.ADD);
                const rot = Math.random() * Math.PI * 2;
                this.tweens.add({
                    targets: confetti,
                    y: h + 20, x: confetti.x + (Math.random() - 0.5) * 100 * S,
                    angle: rot * 180 / Math.PI + 360,
                    duration: 3000 + Math.random() * 3000,
                    repeat: -1, delay: Math.random() * 2000,
                    alpha: 0.2
                });
            }
        }

        // --- character sprites with spotlight (pushed down, well below text) ---
        const charY = cy + 55 * S;
        const spotlightL = this.add.circle(cx - 50 * S, charY, 40 * S, 0xddaa44, 0).setBlendMode(Phaser.BlendModes.ADD);
        const spotlightR = this.add.circle(cx + 50 * S, charY, 40 * S, 0x4466aa, 0).setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({ targets: spotlightL, alpha: 0.05, duration: 800, delay: 1000, ease: 'Cubic.easeOut' });
        this.tweens.add({ targets: spotlightR, alpha: 0.04, duration: 800, delay: 1100, ease: 'Cubic.easeOut' });

        const AS = 48 / 128;  // asset scale: original 48px design / actual 128px assets
        const player = this.add.image(cx - 50 * S, charY, 'player_down_0').setScale(2.8 * S * AS).setAlpha(0);
        const guard = this.add.image(cx + 50 * S, charY, 'guard_down_0').setScale(2.8 * S * AS).setAlpha(0);

        // slide in from sides
        player.x = cx - 130 * S;
        guard.x = cx + 130 * S;
        this.tweens.add({
            targets: player, x: cx - 50 * S, alpha: 1,
            duration: 600, delay: 1000, ease: 'Back.easeOut'
        });
        this.tweens.add({
            targets: guard, x: cx + 50 * S, alpha: 1,
            duration: 600, delay: 1100, ease: 'Back.easeOut'
        });
        // idle bobbing
        this.tweens.add({
            targets: player, y: charY - 4 * S, duration: 1800,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 1600
        });
        this.tweens.add({
            targets: guard, y: charY - 4 * S, duration: 1800,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 2000
        });

        // --- greeting (below characters) ---
        let greeting = 'Ready to escape?';
        if (hour >= 5 && hour < 12) greeting = 'Good morning, prisoner!';
        else if (hour >= 12 && hour < 17) greeting = 'Afternoon escape attempt!';
        else if (hour >= 17 && hour < 21) greeting = 'Evening breakout time!';
        else greeting = 'Midnight escape mission!';

        const greetText = this.add.text(cx, charY + 55 * S, greeting, {
            fontSize: `${Math.round(12 * S)}px`, fontFamily: '"Trebuchet MS", sans-serif',
            color: '#667799', fontStyle: 'italic'
        }).setOrigin(0.5).setAlpha(0);
        this.tweens.add({ targets: greetText, alpha: 0.7, duration: 800, delay: 1200 });

        // --- start button (below greeting) ---
        const btnY = charY + 90 * S;
        const btnGlow = this.add.circle(cx, btnY, 60 * S, 0xddaa22, 0).setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({
            targets: btnGlow, alpha: 0.04, scaleX: 2.5, scaleY: 0.6,
            duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        const startBtn = this.add.text(cx, btnY, 'ESCAPE', {
            fontSize: `${Math.round(30 * S)}px`, fontFamily: '"Arial Black", Impact, sans-serif',
            color: '#eebb33', padding: { x: 30 * S, y: 14 * S },
            stroke: '#443300', strokeThickness: 4 * S
        }).setOrigin(0.5).setAlpha(0).setInteractive({ useHandCursor: true });

        this.tweens.add({
            targets: startBtn, alpha: 1, y: btnY,
            duration: 600, delay: 1400, ease: 'Back.easeOut'
        });

        // button pulse
        this.time.delayedCall(2000, () => {
            this.tweens.add({
                targets: startBtn, scaleX: 1.05, scaleY: 1.05,
                duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });
        });

        startBtn.on('pointerover', () => {
            startBtn.setColor('#ffdd66').setScale(1.1);
            btnGlow.setAlpha(0.1);
        });
        startBtn.on('pointerout', () => {
            startBtn.setColor('#eebb33').setScale(1);
            btnGlow.setAlpha(0.04);
        });
        startBtn.on('pointerdown', () => {
            this.cameras.main.flash(200, 255, 200, 50);
            this.cameras.main.fade(600, 0, 0, 0);
            startBtn.disableInteractive();
            this.tweens.add({ targets: [title, subtitle, player, guard, startBtn], alpha: 0, duration: 400 });
            this.time.delayedCall(600, () => this.scene.start('GameScene'));
        });

        // --- controls hint ---
        const controlsText = isMobile()
            ? 'Touch joystick to move  \u2022  Action button to interact'
            : 'Arrow keys / WASD to move  \u2022  SPACE to interact';
        this.add.text(cx, h - 45 * S, controlsText, {
            fontSize: `${Math.round(11 * S)}px`, fontFamily: '"Trebuchet MS", sans-serif',
            color: '#445566', align: 'center'
        }).setOrigin(0.5).setAlpha(0.6);

        // --- credit ---
        this.add.text(cx, h - 18 * S, `Made with love by Mani & Uncle  \u2022  ${new Date().getFullYear()}`, {
            fontSize: `${Math.round(10 * S)}px`, fontFamily: '"Trebuchet MS", sans-serif',
            color: '#334455'
        }).setOrigin(0.5).setAlpha(0.5);

        // --- camera postFX ---
        const cam = this.cameras.main;
        cam.setBackgroundColor('#0a0e1a');
        if (cam.postFX) {
            cam.postFX.addBloom(0xddaa22, 1, 1, 1.2, 1.1);
            cam.postFX.addVignette(0.5, 0.5, 0.85, 0.35);
        }
    }
}


export default MenuScene;
