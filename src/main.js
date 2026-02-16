import { GW, GH } from './config.js';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import TouchUIScene from './scenes/TouchUIScene.js';
import WinScene from './scenes/WinScene.js';

const config = {
    type: Phaser.AUTO,
    width: GW,
    height: GH,
    parent: document.body,
    backgroundColor: '#0a0a0a',
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    input: {
        activePointers: 3
    },
    scene: [BootScene, MenuScene, GameScene, TouchUIScene, WinScene]
};

window.__game = new Phaser.Game(config);
