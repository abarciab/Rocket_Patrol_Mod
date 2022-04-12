let config = {
    width: 640,
    height: 480,
    scene: [Menu, Play],
}

let borderUISize = config.height/15;
let borderPadding = borderUISize/3;

let game = new Phaser.Game(config);

let keyF, keyR, keyLEFT, keyRIGHT;

/*
    Display the time remaining (in seconds) on the screen (10)
    Implement a simultaneous two-player mode (30)
    Redesign the game's artwork, UI, and sound to change its theme/aesthetic (to something other than sci-fi) (60)

*/