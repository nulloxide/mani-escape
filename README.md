# Mani Game - Prison Escape

A 2D prison escape game built with Phaser 3. Solve puzzles, avoid the guard, and escape.

## Play

Open `index.html` in a browser (requires a local server for ES modules):

```
python3 -m http.server 8000
```

Deployed via GitHub Pages on push to `main`.

## Structure

```
src/
  main.js              Entry point
  config.js            Constants, config, map data
  textures.js          Procedural texture generation
  scenes/
    BootScene.js       Loading screen
    MenuScene.js       Title menu
    GameScene.js       Main gameplay
    TouchUIScene.js    Mobile touch controls
    WinScene.js        Victory screen
```
