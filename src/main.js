let config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 750,
    physics: {
        default: 'arcade', 
        arcade: {
            debug: false,
            gravity: {y:0}
        }
    },
    pixelArt: true,
    scene: [Menu, Play],
}

let borderUISize = config.height/15;
let borderPadding = borderUISize/3;

const game = new Phaser.Game(config);

let keyF, keyR, keyLEFT, keyRIGHT, keySPACE, keySendWagonHigh, keySendWagonMid, keySendWagonLow, keyESC;