/*
  Name: Aidan Barcia-Bacon (#845003)
  Project title: Wagon Watch
  Time to complete: 30-45 hours

  POINTS BREAKDOWN:
    Redesign the game's artwork, UI, and sound to change its theme/aesthetic (to something other than sci-fi) (60)  
        The game is now forest/fantasy themed. I drew all new sprites and animations for the 'rocket' and 'spaceship', and made all 
        new sound effects and two music tracks for the game
    Implement a simultaneous two-player mode (30)
        The default mode of the game is multiplayer, where one player is controlling the archer and the other player is dispatching 
        and controlling the wagons. the wagon master is also able to boost the wagons and save them from the archer's 
        arrows, if timed correctly. The multiplayer mode runs on a timer, and the player with the most points at the end wins
    Implement mouse control for player movement and mouse click to fire (20)
        I implemented the click-to-boost for player2, but it's not mouse control for movement, so maybe I shouldn't get these points
    Display the time remaining (in seconds) on the screen (10)
        In the multiplayer mode, the remaining time is displayed at the top of the screen
    Replace the UI borders with new artwork (10)
        Not sure if this is double dipping with the 'redesign the game's artwork' one, but I did create new artwork for the game's borders
    Implement the speed increase that happens after 30 seconds in the original game (5)
        In the single-player mode, the game gets harder with every wagon you shoot down - first, they come more regularly, the their speed
        is increased, then more wagons are added
    Add your own (copyright-free) background music to the Play scene (5)
        Again, not sure if this is double dipping from that 'redesign the game's artwork' one, but that doesn't mention music and I did
        create two original songs for the game - one for the menu and one for the play scene
    Create your own mod and justify its score (???)
        I'm pretty sure that I've got 100+ points for the above modifications, but there are just a few other things I worked hard
        on and wanted to mention here
            The arrows, obstacles, and the wagons make use of Phaser's group system, so many can be onscreen at once without duplicate declarations
            There are obstacles that scroll with the background and can block the arrows
            Obstacles (and wagons in single player) are placed semi-randomly by the game
            And Lastly, I spent a long time trying to improve the game-feel, by tightening up hitboxes, adding effects like screenshake, and adding
                sound/visual queus to improve player feedback (I'm particularly proud of the wagon boost effect in the multiplayer)
*/

let config = {
    type: Phaser.AUTO,
    width: 1500,
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

let keyF, keyR, keyLEFT, keyRIGHT, keySPACE, keySendWagonHigh, keySendWagonMid, keySendWagonLow, keyESC, boostTop, boostMid, boostLow;