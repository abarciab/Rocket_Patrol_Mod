let config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 750,
    physics: {
        default: 'arcade',
        arcade: {
            debug:false,
            gravity: {y:0}
        }
    },
    pixelArt: true,
    scene: [Menu, Play],
}

let borderUISize = config.height/15;
let borderPadding = borderUISize/3;

const game = new Phaser.Game(config);

let keyF, keyR, keyLEFT, keyRIGHT, keySPACE, keyWagon01, keyWagon02, keyWagon03, keyESC;

/*
    XXX Display the time remaining (in seconds) on the screen (10) XXX
    Implement a simultaneous two-player mode (30)
        p1 
            fires arrows 
            XX has a cooldown XX
        p2
            sends out wagons
            
            gets points for every wagon that gets to the other side
    Redesign the game's artwork, UI, and sound to change its theme/aesthetic (to something other than sci-fi) (60)
        starfield -> grassy meadow
        ships -> horses and wagons
        player -> archer
        rockets -> arrows

*/