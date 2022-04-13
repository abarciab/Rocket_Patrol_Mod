class Menu extends Phaser.Scene {
    constructor(){
        super("menu");
    }

    preload() {
        // load audio
        this.load.audio('bow_shot', './assets/bow shot.wav');
        this.load.audio('arrow_impact', './assets/arrow impact.wav');
        this.load.audio('sfx_select', './assets/blip_select.wav');
        this.load.audio('reload_bow', './assets/reload.wav');
        this.load.audio('game_music', './assets/game music.wav');

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

        this.add.text(borderPadding, game.config.height/2, 'P1: Use (A) and (D) to move and (W) to fire', menuConfig).setOrigin(0, 0.5);
        this.add.text(borderPadding, game.config.height/2 + borderPadding*2, 'Shoot down wagons for points', menuConfig).setOrigin(0, 0.5);

        this.add.text(game.config.width - borderPadding, game.config.height/2, 'P2: Use (O), (K), and (M) to launch wagons', menuConfig).setOrigin(1, 0.5);
        this.add.text(game.config.width - borderPadding, game.config.height/2 + borderPadding*2, 'Try to keep your wagons alive', menuConfig).setOrigin(1, 0.5);

        this.add.text(game.config.width/2, game.config.height/2 + borderPadding*6, 'Whoever has the most points when the timer ends wins!', menuConfig).setOrigin(0.5, 0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding*5, 'Press space to start', menuConfig).setOrigin(0.5);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update () {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)){
            game.settings = {
                wagonScale: 1.5,
                spaceshipSpeed: 3,
                gameTimer: 25000,
                arrowReloadSpeed: 2,
            }
            this.sound.play('sfx_select');
            this.scene.start('play');
        }

        /*if (Phaser.Input.Keyboard.JustDown(keyLEFT)){
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
        }*/
    }
}