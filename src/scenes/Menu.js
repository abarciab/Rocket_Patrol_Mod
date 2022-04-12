class Menu extends Phaser.Scene {
    constructor(){
        super("menu");
    }

    preload() {
        // load audio
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.audio('sfx_explosion', './assets/explosion.wav');
        this.load.audio('sfx_select', './assets/blip_select.wav');
    }

    create(){

        let soundConfig = {
            volume: 0.2
        }

        let menuConfig = {
            frontFamily: 'Courier',
            fontSize: '30px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5, 
            },
            fixedWidth: 0
        }
        
        this.add.text(game.config.width/2, game.config.height/2 - borderPadding*8, 'FOREST PATROL', menuConfig).setOrigin(0.5);

        menuConfig.fontSize = '20px';

        this.add.text(borderPadding, game.config.height/2, 'P1: Use <- -> arrow keys to mofe and (F) to fire', menuConfig).setOrigin(0, 0.5);
        this.add.text(borderPadding, game.config.height/2 + borderPadding*2, 'Shoot down wagons for points', menuConfig).setOrigin(0, 0.5);

        this.add.text(game.config.width - borderPadding, game.config.height/2, 'P2: Use (O), (K), and (M) to launch wagons', menuConfig).setOrigin(1, 0.5);
        this.add.text(game.config.width - borderPadding, game.config.height/2 + borderPadding*2, 'Try to keep your wagons alive', menuConfig).setOrigin(1, 0.5);

        this.add.text(game.config.width/2, game.config.height/2 + borderPadding*6, 'Whoever has the most points when the timer ends wins!', menuConfig).setOrigin(0.5, 0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding*5, 'Press <- for novice or -> for expert', menuConfig).setOrigin(0.5);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update () {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)){
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start('play');
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)){
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 2000
            }
            this.sound.play('sfx_select');
            this.scene.start('play');
        }
    }
}