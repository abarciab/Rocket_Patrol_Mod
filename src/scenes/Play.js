


class Play extends Phaser.Scene {
    constructor(){
        super("play");
    }

    preload(){

        //images
        this.load.image('field', 'assets/grassy field.png');
        this.load.image('rocket', './assets/rocket.png');

        //animations
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('wagonMove', './assets/wagon.png', {frameWidth: 130, frameHeight: 65, startFrame: 0, endFrame: 3});
        this.load.spritesheet('wagonFall', './assets/wagon fall.png', {frameWidth: 130, frameHeight: 65, startFrame: 0, endFrame: 3});

    }

    create(){

        //background
        this.field = this.add.tileSprite(0,0, game.config.width, game.config.height, 'field').setOrigin(0,0);

        //obstacles
        this.obstacle01 = this.add.sprite(0, game.config.height/2, 'rocket');

         //enemy spaceships
        this.wagon01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'wagonMove', 0, 30).setOrigin(0, 0).setScale(game.settings.wagonScale);
        this.wagon02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'wagonMove', 0, 20).setOrigin(0, 0).setScale(game.settings.wagonScale);
        this.wagon03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'wagonMove', 0, 10).setOrigin(0, 0).setScale(game.settings.wagonScale);

        //wagon falling animation
        this.anims.create({
            key: 'wagonFallAnim',
            frames: this.anims.generateFrameNumbers('wagonFall', {start: 0, end: 3, first: 0}),
            frameRate: 12,
            repeat: 0,
        });

        this.anims.create({
            key:'wagonMoveAnim',
            frames: this.anims.generateFrameNumbers('wagonMove', {start: 0, end: 3, first: 0}),
            frameRate: 6,
            repeat: -1,
        })

        //green bar
        this.add.rectangle(0, 20, game.config.width, 80, 0x00FF00).setOrigin(0,0);
        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        //player rocket
        this.archer = new Archer(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket', this.getTime()).setOrigin(0.5, 0);
        this.archer.create(this);


        //keyboard input
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyWagon01 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        keyWagon02 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        keyWagon03 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

     

        //scoreboard
        this.p1Score = 0;
        this.scoreConfig = {
            frontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5, 
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, this.scoreConfig);
        this.timeRemaining = this.add.text(game.config.width - borderPadding - borderUISize, borderUISize + borderPadding*2, game.settings.gameTimer, this.scoreConfig).setOrigin(1, 0);

        //end game
        this.gameOver = false;

        //countdown clock
        this.startTime = this.getTime();
        this.scoreConfig.fixedWidth = 0;
        
        //arrows
        //this.arrowGroup = new ArrowGroup(this);
        this.physics.add.overlap(this.wagon01, this.archer.arrowGroup, this.testFunction);
        this.physics.add.overlap(this.wagon02, this.archer.arrowGroup, this.testFunction);
        this.physics.add.overlap(this.wagon03, this.archer.arrowGroup, this.testFunction);
    }

    testFunction(){
        console.log("COLLISION!");
    }

    endGame() {
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ESC for Menu', this.scoreConfig).setOrigin(0.5);
        this.gameOver = true;

        this.wagon01.anims.stop();
        this.wagon02.anims.stop();
        this.wagon03.anims.stop();
    }

    getTime(){
        let d = new Date();
        return d.getTime();
    }

    update(){
        
        let elapsedTime = this.getTime() - this.startTime;  
        let timeLeft = Math.floor((game.settings.gameTimer - elapsedTime)/1000);
        
        if (timeLeft <= 0 && !this.gameOver){
            this.endGame();
        }

        //update objects
        if (!this.gameOver){
            
            this.wagon01.anims.play('wagonMoveAnim', true);
            this.wagon02.anims.play('wagonMoveAnim', true);
            this.wagon03.anims.play('wagonMoveAnim', true);

            this.timeRemaining.text = timeLeft;
            this.archer.update(this.getTime());
            this.wagon01.update();
            this.wagon02.update();
            this.wagon03.update();

            //move background
            this.field.tilePositionX -= 0.2;

            if (Phaser.Input.Keyboard.JustDown(keyESC)){
                this.scene.start('menu');
            }

            if (Phaser.Input.Keyboard.JustDown(keyWagon01)){
                this.wagon01.dispatch();
            }
            if (Phaser.Input.Keyboard.JustDown(keyWagon02)){
                this.wagon02.dispatch();
            }
            if (Phaser.Input.Keyboard.JustDown(keyWagon03)){
                this.wagon03.dispatch();
            }
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyESC)){
            this.scene.start('menu');
            //console.log("want to return to menu");
        }

        //reset the game
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)){
            this.scene.restart();
        }
        
        this.archer.arrowGroup.children.each( function(arrow) {
            if (this.checkCollision(arrow, this.wagon01)){
                this.killWagon(this.wagon01);
            }
            if (this.checkCollision(arrow, this.wagon02)){
                this.killWagon(this.wagon02);
            }
            if (this.checkCollision(arrow, this.wagon03)){
                this.killWagon(this.wagon03);
            }
        }, this);
        
    }

    checkCollision(arrow, wagon){
        if (arrow.active && arrow.visible){
            let wagonScale = game.settings.wagonScale;
            if (arrow.x < wagon.x + (wagon.width * wagonScale) && arrow.x + arrow.width > wagon.x && arrow.y < wagon.y + (wagon.height * wagonScale) && arrow.height + arrow.y > wagon.y){
                arrow.setActive(false);
                arrow.setVisible(false);
                arrow.reset();
                return true;
    
            } else {
                return false;
            }
        }
    }

    killWagon(wagon){
        if (wagon.alive == true){
            wagon.alive = false;
            console.log("impact!");
            this.sound.play('arrow_impact');
            wagon.alpha = 0;
            let boom = this.add.sprite(wagon.x, wagon.y, 'wagonFall').setOrigin(0,0).setScale(game.settings.wagonScale);
            boom.anims.play('wagonFallAnim');
            boom.on('animationcomplete', () => {
                wagon.reset();
                wagon.alpha = 1;
                boom.destroy();
            });
            this.p1Score += wagon.points;
            this.scoreLeft.text = this.p1Score;
        }
    }
}


/*
class ArrowGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene) {
		super(scene.physics.world, scene);

		this.createMultiple({
			frameQuantity: 30,
			key: 'rocket',
			active: false,
			visible: false,
			classType: Arrow
		});
	}

    shootArrow(x, y){
        const arrow = this.getFirstDead(false);
        if (arrow){
            arrow.shoot(x,y);
        }
    }
}

class Arrow extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, 'arrow');
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.y <= 5){
            this.setActive(false);
            this.setVisible(false);
        }
    }

    shoot(){
        this.body.reset(x,y);
        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(-10);
    }
}*/