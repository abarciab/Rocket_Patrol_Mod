class Play extends Phaser.Scene {
    constructor(){
        super("play");
    }

    preload(){

        //images
        this.load.image('field', 'assets/grassy field.png');
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('tree', './assets/tree.png')
        this.load.image('arrow', './assets/arrow.png')

        //animations
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('wagonMove', './assets/wagon.png', {frameWidth: 130, frameHeight: 65, startFrame: 0, endFrame: 3});
        this.load.spritesheet('wagonFall', './assets/wagon fall.png', {frameWidth: 130, frameHeight: 65, startFrame: 0, endFrame: 3});

        

    }

    create(){

        //background
        this.field = this.add.tileSprite(0,0, game.config.width, game.config.height, 'field').setOrigin(0,0);

        //lane yPosition for obstacles
        this.obsLane1 = borderUISize * 6;
        this.obsLane2 = borderUISize * 8.5;
        this.obsLane3 = borderUISize * 11;

        //lane yPosition for wagons
        this.wagonLane1 = borderUISize*4;
        this.wagonLane2 = borderUISize*5 + borderPadding*4;
        this.wagonLane3 = borderUISize*6 + borderPadding*8;

        //obstacles
        this.obstacle01 = this.add.sprite(0, game.config.height/2, 'rocket');

         //enemy spaceships
        this.wagon01 = new Wagon(this, game.config.width + borderUISize*6, this.wagonLane1, 'wagonMove', 0, 30).setOrigin(0, 0).setScale(game.settings.wagonScale).setDepth(1);
        this.wagon02 = new Wagon(this, game.config.width + borderUISize*3, this.wagonLane2, 'wagonMove', 0, 20).setOrigin(0, 0).setScale(game.settings.wagonScale).setDepth(3);
        this.wagon03 = new Wagon(this, game.config.width, this.wagonLane3, 'wagonMove', 0, 10).setOrigin(0, 0).setScale(game.settings.wagonScale).setDepth(5);

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
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(7);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(7);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(7);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(7);

        this.arrow3 = this.add.sprite(config.width/8, config.height - borderPadding/2, 'arrow').setOrigin(1).setDepth(8).setScale(1.2);
        this.arrow2 = this.add.sprite(config.width/8-20, config.height - borderPadding/2, 'arrow').setOrigin(1).setDepth(8).setScale(1.2);
        this.arrow1 = this.add.sprite(config.width/8-40, config.height - borderPadding/2, 'arrow').setOrigin(1).setDepth(8).setScale(1.2);

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

        //music
        this.music = this.sound.add('game_music', {volume: 0.5});
        this.music.play();

        //obstacles
        this.treeGroup = new ObstacleGroup(this, 'tree');
        this.treeGroup.children.iterate((tree) => {
            tree.setScale(1.5);
            tree.setOrigin(0.5);
        });
        this.nextObstacleTime = this.getTime();

    }

    tintArrows(arrowsReady){
        if (arrowsReady >= 1){
            this.arrow1.setAlpha(1);
        }
        else{
            this.arrow1.setAlpha(0.2);
        }
        if (arrowsReady >= 2){
            this.arrow2.setAlpha(1);
        }
        else{
            this.arrow2.setAlpha(0.2);
        }
        if (arrowsReady >= 3){
            this.arrow3.setAlpha(1);
        }
        else{
            this.arrow3.setAlpha(0.2);
        }
    }

    testFunction(){
        console.log("COLLISION!");
    }

    endGame() {
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5).setDepth(7);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ESC for Menu', this.scoreConfig).setOrigin(0.5).setDepth(7);
        this.gameOver = true;

        this.wagon01.anims.stop();
        this.wagon02.anims.stop();
        this.wagon03.anims.stop();
        this.music.stop();
    }

    getTime(){
        let d = new Date();
        return d.getTime();
    }

    AddObstacle(){
        let yPos = this.pickLane();
        let depth = 2;
        if (yPos == this.obsLane2){
            depth = 4
        } else if (yPos == this.obsLane3){
            depth = 6;
        }
        this.treeGroup.SpawnObstacle(yPos, depth);
    }

    update(){

        if (this.getTime() >= this.nextObstacleTime){
            if (Phaser.Math.Between(1, 100) < 5){
                this.AddObstacle();
                this.nextObstacleTime = this.getTime() + game.settings.obstacleFrequency*1000;
            }
        }
        
        let elapsedTime = this.getTime() - this.startTime;  
        let timeLeft = Math.floor((game.settings.gameTimer - elapsedTime)/1000);
        
        if (timeLeft <= 0 && !this.gameOver){
            this.endGame();
        }

        //update objects
        if (!this.gameOver){

            this.tintArrows(this.archer.arrowsReady);
            
            this.wagon01.anims.play('wagonMoveAnim', true);
            this.wagon02.anims.play('wagonMoveAnim', true);
            this.wagon03.anims.play('wagonMoveAnim', true);

            this.timeRemaining.text = timeLeft;
            this.archer.update(this.getTime());
            this.wagon01.update();
            this.wagon02.update();
            this.wagon03.update();

            //move background
            this.field.tilePositionX -= game.settings.environmentSpeed;

            if (Phaser.Input.Keyboard.JustDown(keyESC)){
                this.music.stop();
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

            //collision checks for arrows vs wagons
            this.archer.arrowGroup.children.each( function(arrow) {
                if (this.checkCollision(arrow, this.wagon01, 1, game.settings.wagonScale)){
                    this.killWagon(this.wagon01);
                }
                if (this.checkCollision(arrow, this.wagon02, 1, game.settings.wagonScale)){
                    this.killWagon(this.wagon02);
                }
                if (this.checkCollision(arrow, this.wagon03, 1, game.settings.wagonScale)){
                    this.killWagon(this.wagon03);
                }

                this.treeGroup.children.each( function(tree) {
                    if (this.checkCollision(arrow, tree, 1, 0.6)){
                        arrow.reset();
                    }
                }, this);

            }, this);

            this.treeGroup.children.each( function(tree) {
                tree.move(game.settings.environmentSpeed);
            }, this);
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyESC)){
            this.scene.start('menu');
            //console.log("want to return to menu");
        }

        //reset the game
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)){
            this.scene.restart();
        }
        
    }

    pickLane(){
        let lane = Phaser.Math.Between(1, 3);

        switch(lane){
            case 1:
                return this.obsLane1;
            case 2:
                return this.obsLane2;
            default:
                return this.obsLane3;
        }
    }

    checkCollision(obj1, obj2, scale1, scale2){
        if (obj1.active && obj1.visible && obj2.active && obj2.visible){
            if (obj1.x < obj2.x + (obj2.width * scale2) && obj1.x + (obj1.width*scale1) > obj2.x && obj1.y < obj2.y + (obj2.height * scale2) && (obj1.height*scale1) + obj1.y > obj2.y){
                obj1.setActive(false);
                obj1.setVisible(false);
                obj1.reset();
                return true;
            } else {
                return false;
            }
        }
    }

    killWagon(wagon){
        if (wagon.alive == true){
            wagon.alive = false;
            this.sound.play('arrow_impact');
            wagon.alpha = 0;
            let boom = this.add.sprite(wagon.x, wagon.y, 'wagonFall').setOrigin(0,0).setScale(game.settings.wagonScale).setDepth(wagon.depth);
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

class ObstacleGroup extends Phaser.Physics.Arcade.Group{
    constructor(scene, texture){
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 15,
            key: texture,
            active: false,
            visible: false,
            classType: Obstacle,
        })
    }

    SpawnObstacle(y, depth){
        let obstacle = this.getFirstDead(false);
        if (obstacle){
            obstacle.Spawn(y, depth);
        }
    }
}

class Obstacle extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture) {
        super(scene, 0, 0, texture);
    }

    update(){

        if (this.x >= game.config.width){
            this.setActive(false);
            this.setVisible(false);
        }
    }

    Spawn(y, depth){
        this.setActive(true);
        this.setVisible(true);
        this.x = 0;
        this.y = y;
        this.setDepth(depth);

        //this.setVelocityX(game.settings.environmentSpeed* 1000);
    }

    move(moveSpeed){
        this.update();
        //console.log("current pos: " + this.x + "adding: " + moveSpeed);
        this.x += moveSpeed;
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