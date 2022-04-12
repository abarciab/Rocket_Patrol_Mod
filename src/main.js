let config = {
    width: 1200,
    height: 750,
    scene: [Menu, Play],
}

let borderUISize = config.height/15;
let borderPadding = borderUISize/3;

let game = new Phaser.Game(config);

let keyF, keyR, keyLEFT, keyRIGHT;

/*
    XXX Display the time remaining (in seconds) on the screen (10) XXX
    Implement a simultaneous two-player mode (30)
    Redesign the game's artwork, UI, and sound to change its theme/aesthetic (to something other than sci-fi) (60)
        starfield -> grassy meadow
        ships -> horses and wagons
        player -> archer
        rockets -> arrows

*/