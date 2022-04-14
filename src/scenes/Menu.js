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


        //2 player mode:
        menuConfig.fontSize = '20px';

        this.p1Instructions1 = this.add.text(borderPadding, game.config.height/2, 'P1: Use (A) and (D) to move and (W) to fire', menuConfig).setOrigin(0, 0.5);
        this.p1Instructions2 = this.add.text(borderPadding, game.config.height/2 + borderPadding*2, 'Shoot down wagons for points', menuConfig).setOrigin(0, 0.5);

        this.p2Instructions1 = this.add.text(game.config.width - borderPadding, game.config.height/2, 'P2: Use (O), (K), and (M) to launch wagons', menuConfig).setOrigin(1, 0.5);
        this.p2Instructions2 = this.add.text(game.config.width - borderPadding, game.config.height/2 + borderPadding*2, 'Try to keep your wagons alive', menuConfig).setOrigin(1, 0.5);

        this.twoPlayerRules = this.add.text(game.config.width/2, game.config.height/2 + borderPadding*6, 'Whoever has the most points when the timer ends wins!', menuConfig).setOrigin(0.5, 0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        menuConfig.fontSize = '25px';
        this.twoPlayerRules2 = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding*6, 'Press space to start, up arrow to swtich to singleplayer mode', menuConfig).setOrigin(0.5);

        //single player mode:
        menuConfig.fontSize = '20px';
        menuConfig.backgroundColor = '#F3B141';
        menuConfig.color = '#843605';

        this.singlePlayerInstructions1 = this.add.text(game.config.width/2, game.config.height/2, 'Use (A) and (D) to move and (W) to fire', menuConfig).setOrigin(0.5, 0.5).setVisible(false);
        this.singlePlayerInstructions2 = this.add.text(game.config.width/2, game.config.height/2 + borderPadding*2, 'Shoot down wagons for points', menuConfig).setOrigin(0.5, 0.5).setVisible(false);

   
        this.singlePlayerRules1 = this.add.text(game.config.width/2, game.config.height/2 + borderPadding*6, 'Get as many points as possible before time runs out!', menuConfig).setOrigin(0.5, 0.5).setVisible(false);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        menuConfig.fontSize = '25px',
        this.singlePlayerRules2 = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding*6, 'Press space to start, down arrow to swtich to 2 player mode', menuConfig).setOrigin(0.5).setVisible(false);

        //keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);


        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        game.settings = {
            wagonScale: 1.5,
            spaceshipSpeed: 3,
            gameTimer: 78000,
            arrowReloadSpeed: 0.2,
            twoPlayer: true,
            environmentSpeed: 2,
            obstacleFrequency: 0.8,
        }
    }

    update () {

        if (Phaser.Input.Keyboard.JustDown(this.keyUP)){

            if (game.settings.twoPlayer == true){
                this.sound.play('sfx_select');   
            }
                     

            console.log("switching to single player mode");
            game.settings.twoPlayer = false;

            this.p1Instructions1.setVisible(false);
            this.p1Instructions2.setVisible(false);
            this.p2Instructions1.setVisible(false);
            this.p2Instructions2.setVisible(false);
            this.twoPlayerRules.setVisible(false);
            this.twoPlayerRules2.setVisible(false);

            this.singlePlayerInstructions1.setVisible(true);
            this.singlePlayerInstructions2.setVisible(true);
            this.singlePlayerRules1.setVisible(true);
            this.singlePlayerRules2.setVisible(true);
            
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyDOWN)){

            if (game.settings.twoPlayer == false){
                this.sound.play('sfx_select');   
            }         

            game.settings.twoPlayer = true;

            this.p1Instructions1.setVisible(true);
            this.p1Instructions2.setVisible(true);
            this.p2Instructions1.setVisible(true);
            this.p2Instructions2.setVisible(true);
            this.twoPlayerRules.setVisible(true);
            this.twoPlayerRules2.setVisible(true);

            this.singlePlayerInstructions1.setVisible(false);
            this.singlePlayerInstructions2.setVisible(false);
            this.singlePlayerRules1.setVisible(false);
            this.singlePlayerRules2.setVisible(false);
        }


        if (Phaser.Input.Keyboard.JustDown(keySPACE)){
            
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