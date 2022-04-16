class Menu extends Phaser.Scene {
    constructor(){
        super("menu");
    }

    preload() {
        //load images
        this.load.image('field', 'assets/grassy field.png');
        this.load.image('sign' , 'assets/wood sign.png');
        this.load.image('long_sign' , 'assets/wood sign long.png');

        // load sfx
        this.load.audio('bow_shot', './assets/bow shot.wav');
        this.load.audio('arrow_impact', './assets/arrow impact.wav');
        this.load.audio('sfx_select', './assets/buttonPress.wav');
        this.load.audio('wagon_sucess', './assets/wagonSucsess.wav');
        this.load.audio('reload_bow', './assets/reload.wav');

        //load music
        this.load.audio('game_music', './assets/game music.wav');
        this.load.audio('menu_music', './assets/menu music.wav');

        //animations
        this.load.spritesheet('wagonMove', './assets/wagon.png', {frameWidth: 130, frameHeight: 65, startFrame: 0, endFrame: 3});

    }

    create(){

        this.field = this.add.tileSprite(0,0, game.config.width, game.config.height, 'field').setOrigin(0,0);

        


        let soundConfig = {
            volume: 0.2
        }

        this.menu_music = this.sound.add('menu_music', {volume: 0.2, loop: true});
        this.menu_music.play();

        let menuConfig = {
            fontSize: '30px',
            color: '#f7efcd',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5, 
            },
            fixedWidth: 0
        }
        
        this.titleBack = this.add.sprite(game.config.width/2, game.config.height/8, 'sign').setOrigin(0.5);
        this.title = this.add.text(game.config.width/2, game.config.height/8, 'FOREST PATROL', menuConfig).setOrigin(0.5);

        this.add.sprite(400, 100, 'wagonMove');
        this.add.sprite(1100, 100, 'wagonMove').flipX = true;


        //2 player mode:
        //p1
            this.p1Back = this.add.sprite(borderUISize*7, game.config.height/2 - borderPadding*11 + 30, 'sign').setOrigin(0.5).setScale(1, 0.75);
            this.p1InsctructionsBack = this.add.sprite(borderUISize*7, game.config.height/2 - 20, 'long_sign').setOrigin(0.5).setScale(1.5, 1);
            this.p1 = this.add.text(borderUISize*7, game.config.height/2 - borderPadding*11 + 30, 'P1: Archer', menuConfig).setOrigin(0.5);
            menuConfig.fontSize = '20px';
            this.p1Instructions1 = this.add.text(borderUISize*7 - this.p1InsctructionsBack.displayWidth/2 + 30, game.config.height/3 + borderPadding*4, 'Use (A) and (D) to move left and right\n(W) to shoot arrows', menuConfig).setOrigin(0, 0.5);
            this.p1Instructions2 = this.add.text(borderUISize*7 - this.p1InsctructionsBack.displayWidth/2 + 30, game.config.height/3 + borderPadding*7 + 4, 'Shoot wagons before they reach the left\nside of the screen. Further wagons are\nworth more points!', menuConfig).setOrigin(0, 0.5);
            
        //p2
            menuConfig.fontSize = '30px';
            this.p2Back = this.add.sprite(game.config.width - borderUISize*7, game.config.height/2 - borderPadding*11 + 30, 'sign').setOrigin(0.5).setScale(1, 0.75);
            this.p2InsctructionsBack = this.add.sprite(game.config.width - borderUISize*7, game.config.height/2 - 20, 'long_sign').setOrigin(0.5).setScale(1.5, 1);
            this.p2 = this.add.text(game.config.width - borderUISize*7, game.config.height/2 - borderPadding*11 + 30, 'P2: wagon master', menuConfig).setOrigin(0.5);
            menuConfig.fontSize = '20px';
            this.p2Instructions1 = this.add.text(920, game.config.height/3 + borderPadding*2, 'Use (O), (K), and (M) to dispatch wagons', menuConfig).setOrigin(0);
            this.p2Instructions2 = this.add.text(920, game.config.height/3 + borderPadding*4, 'Get wagons across the screen. Wagons\ncloser to the archer are worth\nmore points!', menuConfig).setOrigin(0);
            menuConfig.fontSize = '30px';
            menuConfig.align = 'center';
            menuConfig.stroke = '#f7efcd'
            menuConfig.strokeThickness = 2;
            this.twoPlayerRulesBack = this.add.sprite(game.config.width/2, game.config.height/2 + borderPadding*11, 'sign').setOrigin(0.5).setScale(2.5, 1.7);
            this.twoPlayerRules = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding*8, 'Press SPACE to start\n\n(up arrow to switch to singleplayer mode)', menuConfig).setOrigin(0.5);

        //single player mode:
        this.spInsctructionsBack = this.add.sprite(game.config.width/2,  game.config.height/2 - borderPadding*11 + 100, 'long_sign').setOrigin(0.5).setScale(1.5, 1.2).setVisible(false);
        menuConfig.fontSize = '20px';
        menuConfig.strokeThickness = 0;

        this.singlePlayerInstructions1 =this.add.text(game.config.width/2, game.config.height/3 - 20, 'Use (A) and (D) to move left and right\n(W) to shoot arrows', menuConfig).setOrigin(0.5, 0.5).setVisible(false);
        this.singlePlayerInstructions2 = this.add.text(game.config.width/2, game.config.height/3 + 70, 'Shoot wagons before they reach the left\nside of the screen. Further wagons are\nworth more points! \n\nGame ends when 5 wagons reach the\nleft of the screen', menuConfig).setOrigin(0.5, 0.5).setVisible(false);

        menuConfig.fontSize = '30px',
        menuConfig.strokeThickness = 2;
        this.singlePlayerRules = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding*8, 'Press SPACE to start\n\n(down arrow to switch to two player mode)', menuConfig).setOrigin(0.5).setVisible(false);

        //keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        game.settings = {
            wagonScale: 1.5,
            archerMoveSpeed: 4.5     ,
            wagonSpeed: 230,
            gameTimer: 60000,
            arrowReloadSpeed: 2,
            twoPlayer: true,
            environmentSpeed: 2,
            obstacleFrequency: 0.9, //the time, in seconds, the game will wait after spawning on obstacle before trying to make another one. lower valuse = more obstacles
            wagonFrequency: 0.8, //the time, in seconds, the game will wait after dispatching a wagon before trying to dispatch another one. lower valuse = more wagons [single player only]
            lanePointsArcher: [0, 10, 20, 30], //starting with the bottom lane, this is the number of points the archer gets for shooting wagons in each lane
            lanePointsWagon: [0, 60, 40, 30], //starting with the bottom lane, this is the number of points the dispatcher gets for each wagon that makes it across
            laneCooldown: 1200,
            maxArrows: 5,
            wagonsAllowed: 5, //the number of wagons that can make it across in single player before the game ends [single player only]
        }
    }

    update () {

        if (Phaser.Input.Keyboard.JustDown(this.keyUP)){

            if (game.settings.twoPlayer == true){
                this.sound.play('sfx_select');   
            }

            console.log("switching to single player mode");
            game.settings.twoPlayer = false;

            this.p1Back.setVisible(false);
            this.p1InsctructionsBack.setVisible(false);
            this.p2.setVisible(false);
            this.p1.setVisible(false);
            this.p2Back.setVisible(false);
            this.p2InsctructionsBack.setVisible(false);
            this.p1Instructions1.setVisible(false);
            this.p1Instructions2.setVisible(false);
            this.p2Instructions1.setVisible(false);
            this.p2Instructions2.setVisible(false);
            this.twoPlayerRules.setVisible(false);
            
            this.spInsctructionsBack.setVisible(true);
            this.singlePlayerInstructions1.setVisible(true);
            this.singlePlayerInstructions2.setVisible(true);
            this.singlePlayerRules.setVisible(true);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyDOWN)){

            if (game.settings.twoPlayer == false){
                this.sound.play('sfx_select');   
            }         

            game.settings.twoPlayer = true;

            this.p1Back.setVisible(true);
            this.p1InsctructionsBack.setVisible(true);
            this.p2.setVisible(true);
            this.p1.setVisible(true);
            this.p2Back.setVisible(true);
            this.p2InsctructionsBack.setVisible(true);
            this.p1Instructions1.setVisible(true);
            this.p1Instructions2.setVisible(true);
            this.p2Instructions1.setVisible(true);
            this.p2Instructions2.setVisible(true);
            this.twoPlayerRules.setVisible(true);

            this.spInsctructionsBack.setVisible(false);
            this.singlePlayerInstructions1.setVisible(false);
            this.singlePlayerInstructions2.setVisible(false);
            this.singlePlayerRules.setVisible(false);
        }


        if (Phaser.Input.Keyboard.JustDown(keySPACE)){
            
            this.sound.play('sfx_select');
            this.menu_music.stop();
            this.scene.start('play');
        }
    }
}