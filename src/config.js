export const T = 48;
export const ASSET_SZ = 128;       // native asset resolution (px)
export const AS = T / ASSET_SZ;    // asset→world scale (0.375 at 128→48)
export const MOBILE = navigator.maxTouchPoints > 0;
export const isMobile = () => MOBILE;

// Base design resolution — all pixel values in scenes are authored for this size.
// Change GW/GH to scale the entire game. S is the uniform scale factor.
export const GW = 1280;
export const GH = 960;
export const S = GW / 800;  // 1.6 at 1280×960, 1 at 800×600

export const MANI_BIRTH = new Date(2018, 4, 14);
export const UNCLE_BIRTH = new Date(1981, 0, 1);

export function getAge(birthDate) {
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const m = now.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) age--;
    return age;
}

export function isBedtime() {
    const h = new Date().getHours();
    return h >= 21 || h < 6;
}

export function isManisBirthday() {
    const now = new Date();
    return now.getMonth() === 4 && now.getDate() === 14;
}

export const CFG = {
    player: {
        speed: 130,
        bodyW: 24, bodyH: 27,
        bodyOffX: 12, bodyOffY: 21,
        animInterval: 180
    },
    guard: {
        bodyW: 32, bodyH: 32,
        bodyOffX: 8, bodyOffY: 16,
        patrolSpeed: 0.4,
        chaseMul: 2.5,
        moveDelta: 0.06,
        waypointThreshold: 4,
        visionRange: T * 5,
        fovHalf: Math.PI * 0.35,
        suspicionTime: 1500,
        chaseTimeout: 3000,
        catchDist: T * 0.8,
        animChase: 150,
        animPatrol: 250
    },
    lighting: {
        darknessAlpha: 0.35,
        playerRadius: 120,
        playerSoftMul: 1.4,
        playerSoftColor: 0x888888,
        guardRadius: 80,
        guardSoftMul: 1.5,
        guardSoftColor: 0x666666
    },
    camera: {
        zoom: 2.0 * S,
        lerpX: 0.08,
        lerpY: 0.08,
        fadeIn: 800,
        shakeMs: 200,
        shakeIntensity: 0.01,
        flashMs: 200
    },
    vignette: {
        steps: 8,
        maxAlpha: 0.12,
        bandH: 0.02,
        bandW: 0.015
    },
    interact: {
        door: T * 1.5,
        panel: T * 2,
        locker: T * 1.5,
        crate: T * 1.5,
        fence: T * 1.5,
        bed: T * 1.2,
        safe: T * 1.5,
        binaryPanel: T * 1.5,
        cipher: T * 1.5,
        computer: T * 1.5,
        schedule: T * 1.5,
        wirePuzzle: T * 1.5,
        patternDoor: T * 1.5,
        tally: T * 1.5,
        morseRadio: T * 1.5,
        graffiti: T * 1.2,
        cheese: T * 1.2,
        ratSpawn: T * 1.5
    },
    particles: {
        dustScaleMin: 0.05,
        dustScaleMax: 0.15,
        dustAlphaEnd: 0.25,
        dustLife: 4000,
        dustSpeedMin: 2,
        dustSpeedMax: 8,
        dustFreq: 300,
        dustTint: 0xbbaa88,
        doorBurst: 6,
        doorFadeDur: 600,
        doorSpread: 20
    },
    puzzle: {
        seqLen: 4,
        overlayAlpha: 0.88,
        panelW: 320 * S,
        panelH: 260 * S,
        showDelay: 500,
        stepDelay: 700,
        resultDelay: 1200
    },
    caught: {
        invulnTime: 2000
    },
    escape: {
        fadeDur: 2000,
        sceneDelay: 2500
    },
    flashlight: {
        scale: 1.5,
        alpha: 0.4,
        offsetSide: 30,
        offsetDown: 30,
        offsetDefault: 5
    },
    visionCone: {
        chaseColor: 0xff2222, chaseAlpha: 0.12,
        susColor: 0xffaa00, susAlpha: 0.10,
        patrolColor: 0xffff44, patrolAlpha: 0.06,
        segments: 12
    },
    touch: {
        joyRadius: 50 * S,
        joyBaseRadius: 55 * S,
        joyThumbRadius: 24 * S,
        joyX: 100 * S,
        joyYOff: 100 * S,
        deadzone: 8 * S,
        btnRadius: 34 * S,
        btnXOff: 90 * S,
        btnYOff: 100 * S
    },
    safe: {
        panelW: 340 * S, panelH: 300 * S,
        combination: [4, 7, 2],
        wrongMessages: [
            "Nope! The safe laughs at you.",
            "Wrong! Even the rats could do better.",
            "Nice try, human. But no.",
            "The safe says: 'LOL'",
            "Error 404: Correct code not entered.",
            "Beep boop... nah."
        ]
    },
    binary: { panelW: 320 * S, panelH: 280 * S, bits: 4 },
    cipher: {
        panelW: 380 * S, panelH: 300 * S,
        encoded: 'WRRO LV XQGHU WKH EHG',
        shift: 3,
        decoded: 'TOOL IS UNDER THE BED'
    },
    pattern: { panelW: 360 * S, panelH: 300 * S, rounds: 3 },
    wirePuzzle: { panelW: 340 * S, panelH: 340 * S, gridSize: 3 },
    terminal: { panelW: 400 * S, panelH: 320 * S },
    rat: { followDist: T * 1.5, followSpeed: 100, distractDur: 5000 },
    diary: { totalPages: 5 },
    morse: { panelW: 380 * S, panelH: 280 * S, message: 'PIZZA' },
    tally: { panelW: 300 * S, panelH: 220 * S, count: 47 },
    schedule: { displayDur: 10000 },
    ventMaze: { panelW: 400 * S, panelH: 350 * S, size: 7, cellPx: 40 * S },
    stars: { threeStarTime: 180000, twoStarTime: 300000 },
    timer: { key: 'mani_prison_best_time' }
};

export const MAP = [
    //  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 0
    [1, 0, 4, 0,26, 0, 4, 0, 1, 0, 4, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 1  graffiti col4
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,14, 1, 0, 0, 0, 7, 0, 0, 7, 0, 0, 1, 0,24, 0, 0, 0, 0, 0, 0, 1], // 2  diary#0 col11, plate col24
    [1, 0, 5, 0, 2, 0, 5, 0, 2, 0, 5, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0,25, 8, 0, 9,25, 0, 0, 1], // 3  pushcrates col24,28
    [1, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 7, 0, 0, 0, 0, 7, 0, 1, 0,24, 0, 0, 0, 0, 0, 0, 1], // 4  plate col24
    [1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 5
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 7, 0, 0, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1], // 6
    [1,18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 7  schedule col1
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 8  security panel col13
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 9  workshop door col10, control door col17
    [1,12,12,12,12,12,12, 1,12,12,12,12,12, 1,12,12,12,12,12,12,17, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1], //10  computer col20, passage cols22-23
    [1,12,12,12,12,12,12, 1,12,13,12,21,12, 1,12,15,12,12,12,12,12, 1, 1,12,12,12,12,12,12,12,12, 1], //11  safe col9, tally col11, binary col15
    [1,12, 8,12,12,12,12, 1,12,12,12,12,12, 1,12,12,12,12,16,12,12, 1, 1,12,12,12,12,12,12,12,12, 1], //12  cipher col18
    [1,12,12,12,14,12,12, 0,12,12,14,12,12, 1,12,12,23,12,12,12,12, 1, 1,12,12,12,12,12,12,12,12, 1], //13  diary#1 col4, diary#2 col10, morse col16
    [1,12,12,12,12,12,12, 1, 1, 1, 1, 1, 1, 1,12,12,12,12,12,19,12, 1, 1,12,12,12,12,12,12,12,12, 1], //14  wire col19
    [1,12,12, 7,12,22,12, 1, 0, 0, 0, 0, 0, 0, 1, 1, 3,12, 1,20, 1, 1, 1,12,12,12,12,12,12,12,12, 1], //15  cheese col5, patternDoor col19
    [1,12,12,12,12,12,12, 1, 0, 0, 0, 0, 0, 0, 1,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12, 1], //16
    [1,12,12,12,12,12,12, 1, 0, 0, 0, 0, 0, 0, 1,12,14,12,12,12,10,12,12,12,12,12,12,12, 6,12,12, 1], //17  diary#3 col16
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //18
];
