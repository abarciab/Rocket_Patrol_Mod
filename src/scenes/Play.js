


class Play extends Phaser.Scene {
    constructor(){
        super("play");
    }

    preload(){

        //images
        //this.load.image('starfield', 'assets/starfield.png');
        //this.load.image('starfield_small', 'assets/starfield_small.png');
        this.load.image('field', 'assets/grassy field.png');
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('wagon', './assets/wagon.png');
        this.load.image('spaceship', './assets/spaceship.png');

        //animations
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create(){

        //stars parallax
        //this.starsSmall = this.add.tileSprite(0,0, game.config.width, game.config.height, 'starfield_small').setOrigin(0,0);
        //this.starsLarge = this.add.tileSprite(0,0, game.config.width, game.config.height, 'starfield').setOrigin(0,0);

        this.field = this.add.tileSprite(0,0, game.config.width, game.config.height, 'field').setOrigin(0,0).setScale(1);

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

        //enemy spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'wagon', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'wagon', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'wagon', 0, 10).setOrigin(0, 0);

        //explosion animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30,
        });

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
        this.physics.add.overlap(this.ship01, this.archer.arrowGroup, this.testFunction);
        this.physics.add.overlap(this.ship02, this.archer.arrowGroup, this.testFunction);
        this.physics.add.overlap(this.ship03, this.archer.arrowGroup, this.testFunction);
    }

    testFunction(){
        console.log("COLLISION!");
    }

    endGame() {
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', this.scoreConfig).setOrigin(0.5);
            this.gameOver = true;
    }

    getTime(){
        let d = new Date();
        return d.getTime();
    }

    update(){
        
        //console.log(this.archer.arrowGroup.ID);

        let elapsedTime = this.getTime() - this.startTime;  
        let timeLeft = Math.floor((game.settings.gameTimer - elapsedTime)/1000);
        
        if (timeLeft == 0 && !this.gameOver){
            this.endGame();
        }

        //update objects
        if (!this.gameOver){
            this.timeRemaining.text = timeLeft;
            this.archer.update(this.getTime());
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)){
            this.scene.start('menu');
        }

        //reset the game
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)){
            this.scene.restart();
        }
        
        //move background
        //this.starsLarge.tilePositionX -= 4;
        //this.starsSmall.tilePositionX -= 2;
        this.field.tilePositionX -= 1;

        this.archer.arrowGroup.children.each( function(arrow) {
            if (this.checkCollision(arrow, this.ship01)){
                this.killWagon(this.ship01);
            }
            if (this.checkCollision(arrow, this.ship02)){
                this.killWagon(this.ship02);
            }
            if (this.checkCollision(arrow, this.ship03)){
                this.killWagon(this.ship03);
            }
        }, this);
        /*//collision checks
        if (this.checkCollision(this.archer, this.ship01)){
            this.shipExplode(this.ship01);
            this.archer.reset();
        }
        if (this.checkCollision(this.archer, this.ship02)){
            this.shipExplode(this.ship02);
            this.archer.reset();
        }
        if (this.checkCollision(this.archer, this.ship03)){
            this.shipExplode(this.ship03);
            this.archer.reset();
        }*/
    }

    checkCollision(rocket, ship){
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y){
            return true;
        } else {
            return false;
        }
    }

    killWagon(wagon){
        this.sound.play('sfx_explosion', {volume: 0.6});
        wagon.alpha = 0;
        let boom = this.add.sprite(wagon.x, wagon.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            wagon.reset();
            wagon.alpha = 1;
            boom.destroy();
        });
        this.p1Score += wagon.points;
        this.scoreLeft.text = this.p1Score;
        
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