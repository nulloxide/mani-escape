import { S, CFG } from '../config.js';

class WinScene extends Phaser.Scene {
    constructor() { super('WinScene'); }

    create(data) {
        this.cameras.main.setBackgroundColor('#050510');
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;
        const escapeTime = data.time || 0;
        const puzzlesSolved = data.puzzles || 0;
        const diaryFound = data.diaryPages || 0;
        const caughtCount = data.caught || 0;

        // Calculate stars
        let stars = 1;
        if (escapeTime < CFG.stars.twoStarTime && puzzlesSolved >= 3) stars = 2;
        if (escapeTime < CFG.stars.threeStarTime && puzzlesSolved >= 6 && caughtCount === 0) stars = 3;

        // Save personal best
        const bestKey = CFG.timer.key;
        const prevBest = parseInt(localStorage.getItem(bestKey) || '0', 10);
        const isNewBest = prevBest === 0 || escapeTime < prevBest;
        if (isNewBest) localStorage.setItem(bestKey, escapeTime.toString());

        // Format time as M:SS
        const formatTime = (ms) => {
            const totalSec = Math.floor(ms / 1000);
            const mins = Math.floor(totalSec / 60);
            const secs = totalSec % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };

        // Night sky background
        for (let i = 0; i < 50; i++) {
            const star = this.add.circle(
                Math.random() * this.scale.width,
                Math.random() * this.scale.height * 0.4,
                Math.random() * 1.5 * S, 0xffffff, 0.5 + Math.random() * 0.5
            );
            this.tweens.add({
                targets: star, alpha: 0.2, duration: 1000 + Math.random() * 2000,
                yoyo: true, repeat: -1
            });
        }

        // Moon
        this.add.circle(cx + 180 * S, 65 * S, 30 * S, 0xeeeedd);
        this.add.circle(cx + 170 * S, 60 * S, 28 * S, 0x050510);

        this.cameras.main.fadeIn(1500);

        // Title
        this.add.text(cx, 55 * S, 'ESCAPED!', {
            fontSize: `${Math.round(48 * S)}px`, fontFamily: 'monospace', color: '#00ff66',
            fontStyle: 'bold', stroke: '#003311', strokeThickness: 4 * S
        }).setOrigin(0.5);

        this.add.text(cx, 95 * S, 'You crawled through the vents and escaped into the night.', {
            fontSize: `${Math.round(12 * S)}px`, fontFamily: 'monospace', color: '#aaaaaa', align: 'center'
        }).setOrigin(0.5);

        // Star rating with animated reveal
        const starY = 140 * S;
        const starSpacing = 55 * S;
        const starStartX = cx - starSpacing;
        for (let i = 0; i < 3; i++) {
            const sx = starStartX + i * starSpacing;
            const filled = i < stars;
            const starShape = this.add.text(sx, starY, '\u2605', {
                fontSize: `${Math.round(40 * S)}px`, fontFamily: 'serif',
                color: filled ? '#ffdd44' : '#333344',
                stroke: filled ? '#aa8800' : '#222233',
                strokeThickness: 2 * S
            }).setOrigin(0.5).setAlpha(0).setScale(0);

            this.tweens.add({
                targets: starShape,
                alpha: 1, scale: 1,
                duration: 400,
                delay: 600 + i * 300,
                ease: 'Back.easeOut',
                onComplete: () => {
                    if (filled) {
                        // Sparkle burst
                        for (let j = 0; j < 6; j++) {
                            const sp = this.add.circle(sx, starY, 2 * S, 0xffdd44, 0.8);
                            this.tweens.add({
                                targets: sp,
                                x: sx + Phaser.Math.Between(-30 * S, 30 * S),
                                y: starY + Phaser.Math.Between(-30 * S, 30 * S),
                                alpha: 0, scale: 0, duration: 500,
                                onComplete: () => sp.destroy()
                            });
                        }
                    }
                }
            });
        }

        const starLabel = stars === 3 ? 'PERFECT ESCAPE!' : stars === 2 ? 'Great Job!' : 'You Made It!';
        const starLabelColor = stars === 3 ? '#ffdd44' : stars === 2 ? '#aaddff' : '#aaaaaa';
        this.add.text(cx, starY + 32 * S, starLabel, {
            fontSize: `${Math.round(14 * S)}px`, fontFamily: 'monospace', color: starLabelColor, fontStyle: 'bold'
        }).setOrigin(0.5);

        // Stats panel
        const statsY = 210 * S;
        const statsStyle = { fontSize: `${Math.round(13 * S)}px`, fontFamily: 'monospace', color: '#88aacc' };
        const valStyle = { fontSize: `${Math.round(13 * S)}px`, fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold' };

        this.add.text(cx - 100 * S, statsY, 'Time:', statsStyle).setOrigin(0, 0.5);
        this.add.text(cx + 100 * S, statsY, formatTime(escapeTime), valStyle).setOrigin(1, 0.5);

        if (prevBest > 0 && !isNewBest) {
            this.add.text(cx - 100 * S, statsY + 22 * S, 'Best:', statsStyle).setOrigin(0, 0.5);
            this.add.text(cx + 100 * S, statsY + 22 * S, formatTime(prevBest), valStyle).setOrigin(1, 0.5);
        } else if (isNewBest && prevBest > 0) {
            const newBestTxt = this.add.text(cx + 120 * S, statsY, 'NEW BEST!', {
                fontSize: `${Math.round(11 * S)}px`, fontFamily: 'monospace', color: '#ffdd44', fontStyle: 'bold'
            }).setOrigin(0, 0.5);
            this.tweens.add({ targets: newBestTxt, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });
        }

        this.add.text(cx - 100 * S, statsY + 44 * S, 'Puzzles Solved:', statsStyle).setOrigin(0, 0.5);
        this.add.text(cx + 100 * S, statsY + 44 * S, `${puzzlesSolved}`, valStyle).setOrigin(1, 0.5);

        this.add.text(cx - 100 * S, statsY + 66 * S, 'Diary Pages:', statsStyle).setOrigin(0, 0.5);
        this.add.text(cx + 100 * S, statsY + 66 * S, `${diaryFound} / ${CFG.diary.totalPages}`, valStyle).setOrigin(1, 0.5);

        this.add.text(cx - 100 * S, statsY + 88 * S, 'Times Caught:', statsStyle).setOrigin(0, 0.5);
        const caughtColor = caughtCount === 0 ? '#44ff44' : '#ff8844';
        this.add.text(cx + 100 * S, statsY + 88 * S, `${caughtCount}`, {
            fontSize: `${Math.round(13 * S)}px`, fontFamily: 'monospace', color: caughtColor, fontStyle: 'bold'
        }).setOrigin(1, 0.5);

        // Chapter complete
        this.add.text(cx, statsY + 120 * S, 'Chapter 1 Complete', {
            fontSize: `${Math.round(16 * S)}px`, fontFamily: 'monospace', color: '#ff8844', fontStyle: 'bold'
        }).setOrigin(0.5);

        // Funny messages based on performance
        let funnyMsg = '';
        if (stars === 3) funnyMsg = '"Prison authorities are still confused."';
        else if (caughtCount > 3) funnyMsg = '"At this point, the guard knows you by name."';
        else if (puzzlesSolved === 0) funnyMsg = '"Speed run complete! The puzzles are crying."';
        else funnyMsg = '"The warden is filing a complaint."';

        this.add.text(cx, statsY + 145 * S, funnyMsg, {
            fontSize: `${Math.round(10 * S)}px`, fontFamily: 'monospace', color: '#667788', fontStyle: 'italic'
        }).setOrigin(0.5);

        // Play Again button
        const btnY = statsY + 185 * S;
        const restartBtn = this.add.text(cx, btnY, '[ PLAY AGAIN ]', {
            fontSize: `${Math.round(22 * S)}px`, fontFamily: 'monospace', color: '#ff6600',
            padding: { x: 20 * S, y: 10 * S }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        restartBtn.on('pointerover', () => restartBtn.setColor('#ffaa44').setScale(1.05));
        restartBtn.on('pointerout', () => restartBtn.setColor('#ff6600').setScale(1));
        restartBtn.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.stop('TouchUIScene');
                this.scene.start('GameScene');
            });
        });

        this.tweens.add({
            targets: restartBtn, alpha: 0.4, duration: 900,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        // Walking away silhouette
        const silhouette = this.add.image(cx, btnY + 65 * S, 'player_up_0').setScale(2 * S * 48 / 128).setAlpha(0.6);
        this.tweens.add({ targets: silhouette, y: silhouette.y - 200 * S, alpha: 0, duration: 6000 });
    }
}

export default WinScene;
