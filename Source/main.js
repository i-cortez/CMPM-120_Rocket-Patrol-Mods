// Create game configuration object
let config =
{
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
};

let game = new Phaser.Game(config); // create main game object

// define the game settings, initially set for easy mode
game.settings =
{
    spaceshipSpeed: 3,
    gameTimer: 60000
};

// reserve some keyboard bindings
let keyE, keyF, keyH, keyM, keyLEFT, keyRIGHT;