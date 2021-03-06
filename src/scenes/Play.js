class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        //images
        this.load.image('sign_hollow', './assets/wood sign cutout.png');
        this.load.image('tree', './assets/tree.png');
        this.load.image('arrow', './assets/arrow.png');
        this.load.image('handle', './assets/handle.png');
        this.load.image('bar', './assets/colored bar.png');
        this.load.image('wagonIcon', './assets/wagon icon.png');

        //animations
        this.load.spritesheet('explosion', './assets/explosion.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9 });
        this.load.spritesheet('wagonFall', './assets/wagon fall.png', { frameWidth: 130, frameHeight: 65, startFrame: 0, endFrame: 3 });
        this.load.spritesheet('archer', './assets/dude.png', { frameWidth: 45, frameHeight: 58, startFrame: 0, endFrame: 5 });
        this.load.spritesheet('wagonTrail', './assets/wagon dash trails.png', { frameWidth: 63, frameHeight: 33, startFrame: 0, endFrame: 3 });

        if (!game.settings.twoPlayer) {
            this.load.audio('wagon_success_bad', './assets/wagon success singleplayer.wav');
        }

    }

    create() {

        //adding borders 
        this.setupBorders();

        //adding animations
        this.setupAnims();

        //adding keys
        this.setupKeys();

        //determining the position of each 'lane', for both wagons and obstacles
        this.setupLanes();

        //add scoreboard and set score to 0
        this.setUpScoreboard();

        //adding icons for both players
        this.setupIcons();

        //background
        this.field = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'field').setOrigin(0, 0);

        this.sfxMuted = false;
        this.musicMuted = false;
        this.volumeButton = this.add.sprite(game.config.width - borderPadding, game.config.height, 'volume_button').setOrigin(1)
            .setInteractive()
            .setDepth(13)
            .on('pointerdown', () => this.musicMuted = !this.musicMuted);

        //creating the wagon group and wagons
        if (game.settings.twoPlayer) {
            game.settings.wagonSpeed *= 1.2;
            game.settings.lanePointsArcher[1] = 5
            game.settings.lanePointsArcher[2] = 15
            game.settings.lanePointsArcher[3] = 25
        }
        this.wagonGroup = new WagonGroup(this);
        this.wagonGroup.children.iterate((wagon) => {
            wagon.anims.play('wagonMoveAnim', true);
            wagon.setScale(game.settings.wagonScale);
            wagon.setOrigin(0);
            wagon.body.setSize(100, 40);
            wagon.body.setOffset(20, 0);
            wagon.setInteractive()
            wagon.on('pointerdown', () => {
                this.boostWagon(wagon);
            });
        });

        //wagon boost cooldown
        this.boostTargetTime = this.getTime();

        //creating archer and arrows
        this.archer = new Archer(this, game.config.width / 2, game.config.height - borderUISize - borderPadding + 10, 'dude', this.getTime()).setOrigin(0.5, 1).setDepth(7).setScale(1.2);

        //countdown clock
        this.startTime = this.getTime();
        this.scoreConfig.fixedWidth = 0;
        this.gameOver = false;

        //music
        this.music = this.sound.add('game_music', { volume: 0.5, loop: true });
        this.music.play();

        //obstacles
        this.treeGroup = new ObstacleGroup(this, 'tree');
        this.treeGroup.children.iterate((tree) => {
            tree.setScale(1.5);
            tree.setOrigin(0.5);
            tree.setSize(20, 90);
            tree.setOffset(16, 30)
        });
        this.nextObstacleTime = this.getTime();

        //collisions between arrows, wagons, and obstacles
        this.physics.add.overlap(this.archer.arrowGroup, this.treeGroup, this.arrowObstacleCollission);
        this.physics.add.overlap(this.archer.arrowGroup, this.wagonGroup, this.arrowWagonCollission.bind(this));

        this.nexWagonTime = 0;
    }

    setupIcons() {
        //UI arrows displayed on the lower left to indicate how many times the archer can shoot
        this.arrowIcon1 = this.add.sprite(config.width / 8 - 80, config.height - borderPadding / 2, 'arrow').setOrigin(1).setDepth(8).setScale(1.2);
        this.arrowIcon2 = this.add.sprite(config.width / 8 - 60, config.height - borderPadding / 2, 'arrow').setOrigin(1).setDepth(8).setScale(1.2);
        this.arrowIcon3 = this.add.sprite(config.width / 8 - 40, config.height - borderPadding / 2, 'arrow').setOrigin(1).setDepth(8).setScale(1.2);
        this.arrowIcon4 = this.add.sprite(config.width / 8 - 20, config.height - borderPadding / 2, 'arrow').setOrigin(1).setDepth(8).setScale(1.2);
        this.arrowIcon5 = this.add.sprite(config.width / 8, config.height - borderPadding / 2, 'arrow').setOrigin(1).setDepth(8).setScale(1.2);

        if (game.settings.twoPlayer) {
            //UI wagons displayed on the lower right to indicate how many wagons dispatcher can send
            this.wagonIcon1 = this.add.sprite(config.width * 0.6, config.height - borderPadding / 2, 'wagonIcon').setOrigin(1).setDepth(8).setScale(1.2);
            this.wagonIcon2 = this.add.sprite(config.width * 0.6 + 80, config.height - borderPadding / 2, 'wagonIcon').setOrigin(1).setDepth(8).setScale(1.2);
            this.wagonIcon3 = this.add.sprite(config.width * 0.6 + 160, config.height - borderPadding / 2, 'wagonIcon').setOrigin(1).setDepth(8).setScale(1.2);
            this.wagonIcon4 = this.add.sprite(config.width * 0.6 + 240, config.height - borderPadding / 2, 'wagonIcon').setOrigin(1).setDepth(8).setScale(1.2);
            this.wagonIcon5 = this.add.sprite(config.width * 0.6 + 320, config.height - borderPadding / 2, 'wagonIcon').setOrigin(1).setDepth(8).setScale(1.2);
            this.boostIcon = this.add.sprite(config.width * 0.6 + 400, config.height - borderPadding / 2, 'wagonIcon').setOrigin(1).setDepth(8).setScale(1.2).setTint('0xb04a4a');
        }
    }

    setupLanes() {
        //lane Position for obstacles
        this.obsLane3 = borderUISize * 6;
        this.obsLane2 = borderUISize * 8.5;
        this.obsLane1 = borderUISize * 11;

        //lane Position for wagons
        this.wagonLane3 = borderUISize * 4;
        this.wagonLane2 = borderUISize * 5 + borderPadding * 4;
        this.wagonLane1 = borderUISize * 6 + borderPadding * 8;

        //cooldown for sending wagons in each of the three lanes
        this.topLaneTime = 0;
        this.midLaneTime = 0;
        this.lowLaneTime = 0;
    }

    setupAnims() {
        //wagon animations
        this.anims.create({
            key: 'wagonFallAnim',
            frames: this.anims.generateFrameNumbers('wagonFall', { start: 0, end: 3, first: 0 }),
            frameRate: 12,
            repeat: 0,
        });
        this.anims.create({
            key: 'wagonMoveAnim',
            frames: this.anims.generateFrameNumbers('wagonMove', { start: 0, end: 3, first: 0 }),
            frameRate: 6,
            repeat: -1,
        })
        this.anims.create({
            key: 'wagonDashAnim',
            frames: this.anims.generateFrameNumbers('wagonTrail', { start: 0, end: 3, first: 0 }),
            frameRate: 10,
            repeat: 0,
        })

        //archer animations
        this.anims.create({
            key: 'archerMove',
            frames: this.anims.generateFrameNumbers('archer', { start: 1, end: 4, first: 1 }),
            frameRate: 12,
            repeat: -1,
        })
        this.anims.create({
            key: 'archerIdle',
            frames: this.anims.generateFrameNumbers('archer', { start: 0, end: 0, first: 0 }),
            frameRate: 6,
            repeat: -1,
        })
        this.anims.create({
            key: 'archerShoot',
            frames: this.anims.generateFrameNumbers('archer', { start: 5, end: 5, first: 5 }),
            frameRate: 5,
            repeat: 0,
        })
    }

    setupKeys() {
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySendWagonHigh = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FORWARD_SLASH);
        keySendWagonMid = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PERIOD);
        keySendWagonLow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.COMMA);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.cheatKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    }

    setupBorders() {
        if (game.settings.twoPlayer) {
            this.add.sprite(game.config.width / 2, -1, 'sign_hollow').setOrigin(0.5, 0).setScale(5, 1).setDepth(8);
        } else {
            this.add.sprite(game.config.width / 2, -1, 'sign').setOrigin(0.5, 0).setScale(5, 1).setDepth(6);
        }
        this.add.sprite(game.config.width / 2, game.config.height + 35, 'sign').setOrigin(0.5, 1).setScale(20, 1).setDepth(6);
    }

    setUpScoreboard() {
        this.score = 0;
        this.p1Score = 0;
        this.p2Score = 0;
        this.scoreConfig = {
            frontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#000000',
            align: 'center',

            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.archerScore = this.add.text(borderUISize, borderUISize / 2 - 5, this.score, this.scoreConfig).setDepth(11);
        this.dispatcherScore = this.add.text(game.config.width - borderUISize - borderPadding * 8, borderUISize / 2 - 5, this.score, this.scoreConfig).setDepth(11);
        this.timeRemaining = this.add.text(game.config.width / 2, borderUISize + borderPadding * 2, game.settings.gameTimer, this.scoreConfig).setOrigin(.5, 0).setDepth(7);

        this.scoreConfig.align = 'left';
        this.scorebar = this.physics.add.sprite(game.config.width / 2, borderUISize / 2 + 20, 'bar').setOrigin(0.5).setDepth(7).setScale(20, 2);
        this.scoreHandle = this.physics.add.sprite(game.config.width / 2, borderUISize / 2 + 10, 'handle').setOrigin(0.5, 0.5).setDepth(7).setScale(0.5, 2);
        this.actualScorePos = game.config.width / 2;

        if (!game.settings.twoPlayer) {
            this.add.text(game.config.width / 2, 15, "Wagons Left:").setDepth(8).setOrigin(0.5);
            this.scorebar.setVisible(false);
            this.scoreHandle.setVisible(false);
            this.dispatcherScore.setVisible(false);
            this.archerScore.x = game.config.width / 2;
            this.archerScore.y = game.config.height - borderUISize / 2;
            this.archerScore.setOrigin(0.5);
            this.timeRemaining.y = borderUISize / 2 + 4;
        } else {
            this.add.text(game.config.width / 2, borderUISize * 1.4, "Time Left:").setDepth(8).setOrigin(0.5);
        }
        this.wagonsLeft = game.settings.wagonsAllowed;
        this.timeRemaining.text = this.wagonsLeft;
    }

    updateIcons(arrowsReady, activeWagons) {
        if (arrowsReady >= 1) { this.arrowIcon1.setAlpha(1); }
        else { this.arrowIcon1.setAlpha(0.2); }
        if (arrowsReady >= 2) { this.arrowIcon2.setAlpha(1); }
        else { this.arrowIcon2.setAlpha(0.2); }
        if (arrowsReady >= 3) { this.arrowIcon3.setAlpha(1); }
        else { this.arrowIcon3.setAlpha(0.2); }
        if (arrowsReady >= 4) { this.arrowIcon4.setAlpha(1); }
        else { this.arrowIcon4.setAlpha(0.2); }
        if (arrowsReady >= 5) { this.arrowIcon5.setAlpha(1); }
        else { this.arrowIcon5.setAlpha(0.2); }

        if (game.settings.twoPlayer) {
            activeWagons = 5 - activeWagons;
            if (activeWagons >= 1) { this.wagonIcon1.setAlpha(1); }
            else { this.wagonIcon1.setAlpha(0.2); }
            if (activeWagons >= 2) { this.wagonIcon2.setAlpha(1); }
            else { this.wagonIcon2.setAlpha(0.2); }
            if (activeWagons >= 3) { this.wagonIcon3.setAlpha(1); }
            else { this.wagonIcon3.setAlpha(0.2); }
            if (activeWagons >= 4) { this.wagonIcon4.setAlpha(1); }
            else { this.wagonIcon4.setAlpha(0.2); }
            if (activeWagons >= 5) { this.wagonIcon5.setAlpha(1); }
            else { this.wagonIcon5.setAlpha(0.2); }
        }
    }

    endGame() {
        let string = "P1 - Archer - won!"
        if (this.score < 0) {
            string = "P2 - Wagon master - won!"
        }
        else if (this.score == 0) {
            string = "It's a tie!";
        }
        if (!game.settings.twoPlayer) {
            string = "Final Score: " + this.p1Score.toLocaleString(undefined);
        }
        this.add.sprite(game.config.width / 2, game.config.height / 2, 'long_sign').setScale(1.5, 1).setDepth(7);
        this.scoreConfig.backgroundColor = null;
        this.scoreConfig.color = '#f7efcd';

        this.add.text(game.config.width / 2, game.config.height / 2 - 60, 'GAME OVER', this.scoreConfig).setOrigin(0.5).setDepth(7);
        this.add.text(game.config.width / 2, game.config.height / 2 - 10, string, this.scoreConfig).setOrigin(0.5).setDepth(7);
        this.scoreConfig.fontSize = '23px';
        this.add.text(game.config.width / 2, game.config.height / 2 + 40, 'Press (R) to Restart or ESC for Menu', this.scoreConfig).setOrigin(0.5).setDepth(7);
        this.gameOver = true;

        this.wagonGroup.children.iterate((wagon) => {
            wagon.anims.stop();
            wagon.stop();
        });
    }

    getTime() {
        let d = new Date();
        return d.getTime();
    }

    AddObstacle() {
        let yPos = this.pickObsLane();
        let depth;

        if (yPos == this.obsLane3) {
            depth = 1
        } else if (yPos == this.obsLane2) {
            depth = 3;
        } else if (yPos == this.obsLane1) {
            depth = 5;
        }
        this.treeGroup.SpawnObstacle(yPos, depth);
    }

    arrowObstacleCollission(arrow, obstacle) {
        if (arrow.visible && obstacle.visible) {
            arrow.reset();
        }
    }

    arrowWagonCollission(arrow, wagon) {
        if (arrow.visible && wagon.visible) {
            arrow.reset();
            this.killWagon(wagon);
            this.cameras.main.shake(50, 0.005);
        }
    }

    updateScore(change) {
        if (change > 0) {
            this.p1Score += change;
        } else {
            this.p2Score -= change;
        }
        this.score += change;

        this.archerScore.text = this.p1Score.toLocaleString(undefined);
        this.dispatcherScore.text = this.p2Score.toLocaleString(undefined);

        if (!game.settings.twoPlayer && change < 0) {
            this.wagonsLeft -= 1;
            this.timeRemaining.text = this.wagonsLeft;
            this.cameras.main.shake(90, 0.005);
        }

        if (this.wagonsLeft == 0) {
            this.endGame();
        }

        if (!game.settings.twoPlayer && this.score % 500 == 0) {
            this.wagonsLeft += 1;
            this.sound.play('wagon_sucess');
            this.timeRemaining.text = this.wagonsLeft;
        }

        //this is so that the score handle doesn't go off screen
        this.actualScorePos += change / 2;
        if ((this.scoreHandle.x > 385 && change < 0) || (this.scoreHandle.x < game.config.width - 380 && change > 0)) {
            this.scoreHandle.x = this.actualScorePos;
            this.scorebar.x = this.actualScorePos;
        }

        if (this.scoreHandle.x > game.config.width - 380) {
            this.scoreHandle.x = game.config.width - 380;
            this.scorebar.x = game.config.width - 380;
        }
        else if (this.scoreHandle.x < 385) {
            this.scoreHandle.x = 385;
            this.scorebar.x = 385;
        }
    }

    increaseDifficulty() {
        if (game.settings.singlePlayerWagonChance < 100) {
            game.settings.singlePlayerWagonChance += 1;
            console.log("wagon chance: " + game.settings.singlePlayerWagonChance);
        } else if (game.settings.wagonFrequency > 0.1) {
            console.log("wagon frequency: " + game.settings.wagonFrequency);
            game.settings.wagonFrequency *= 0.99;
            game.settings.archerMoveSpeed *= 1.01;
        } else if (game.settings.wagonSpeed < 320) {
            console.log("wagon speed: " + game.settings.wagonSpeed);
            game.settings.wagonSpeed *= 1.02;
            game.settings.archerMoveSpeed *= 1.01;
        }
    }

    update() {
        //mute button
        if (!this.musicMuted) {
            this.volumeButton.setAlpha(1);
            this.music.setVolume(0.2);
        } else {
            this.volumeButton.setAlpha(0.2);
            this.music.setVolume(0);
        }

        //archer animations
        if (this.archer.shooting && !this.gameOver) {
            this.archer.anims.play("archerShoot");
            this.archer.shooting = false;
        }
        else if (this.archer.movingRight && !this.gameOver) {
            this.archer.flipX = false;
            if (!this.archer.anims.isPlaying || this.archer.anims.currentAnim.key != 'archerMove') {
                this.archer.anims.play('archerMove');
            }
        }
        else if (this.archer.movingLeft && !this.gameOver) {
            this.archer.flipX = true;
            if (!this.archer.anims.isPlaying || this.archer.anims.currentAnim.key != 'archerMove') {
                this.archer.anims.play('archerMove');
            }
        }
        else if ((this.gameOver) || (!this.archer.movingRight && !this.archer.movingLeft && !(this.archer.anims.isPlaying && this.archer.anims.currentAnim.key == 'archerShoot'))) {
            if (!this.archer.anims.isPlaying || this.archer.anims.currentAnim.key != 'archerIdle') {
                this.archer.anims.play('archerIdle');
            }
        }

        //try to add a new obstacle to the scene
        if (this.getTime() >= this.nextObstacleTime) {
            if (Phaser.Math.Between(1, 100) < 5) {
                this.AddObstacle();
                this.nextObstacleTime = this.getTime() + game.settings.obstacleFrequency * 1000;
            }
        }

        //countdown timer
        let elapsedTime = this.getTime() - this.startTime;
        let timeLeft = Math.floor((game.settings.gameTimer - elapsedTime) / 1000);
        if (timeLeft <= 0 && !this.gameOver && game.settings.twoPlayer) {
            this.endGame();
        }

        //update objects
        if (!this.gameOver) {

            //wagon boost icon
            if (this.getTime() >= this.boostTargetTime && game.settings.twoPlayer) {
                this.boostIcon.setAlpha(1);
            } else if (game.settings.twoPlayer) {
                this.boostIcon.setAlpha(0.2);
            }

            //update arrows and display
            this.updateIcons(this.archer.arrowsReady, this.wagonGroup.countActive(true));
            this.archer.update(this.getTime());

            //update UI
            if (game.settings.twoPlayer) { this.timeRemaining.text = timeLeft; }

            //move background
            this.field.tilePositionX -= game.settings.environmentSpeed;

            //return to menu
            if (Phaser.Input.Keyboard.JustDown(keyESC)) {
                this.music.stop();
                this.scene.start('menu');
            }

            if (!game.settings.twoPlayer) {
                if (Phaser.Input.Keyboard.JustDown(this.cheatKey)) {
                    this.wagonsLeft += 100;
                    this.timeRemaining.text = this.wagonsLeft;
                }
            }

            //p2 dispatch wagons
            if (game.settings.twoPlayer) {
                if (Phaser.Input.Keyboard.JustDown(keySendWagonHigh) && this.getTime() >= this.topLaneTime) {
                    this.wagonGroup.dispatch(this.wagonLane3, 3, 0);
                    this.topLaneTime = this.getTime() + game.settings.laneCooldown;
                }
                if (Phaser.Input.Keyboard.JustDown(keySendWagonMid) && this.getTime() >= this.midLaneTime) {
                    this.wagonGroup.dispatch(this.wagonLane2, 2, 2);
                    this.midLaneTime = this.getTime() + game.settings.laneCooldown;
                }
                if (Phaser.Input.Keyboard.JustDown(keySendWagonLow) && this.getTime() >= this.lowLaneTime) {
                    this.wagonGroup.dispatch(this.wagonLane1, 1, 4);
                    this.lowLaneTime = this.getTime() + game.settings.laneCooldown;
                }
            }

            //move obstacles
            this.treeGroup.children.each(function (tree) {
                tree.move(game.settings.environmentSpeed);
            }, this);

            //update wagons
            this.wagonGroup.children.iterate((wagon) => {
                if (wagon.active) {
                    wagon.update();
                    if (wagon.madeIt) {
                        wagon.madeIt = false;
                        this.updateScore(-game.settings.lanePointsWagon[wagon.lane])
                        if (game.settings.twoPlayer) {
                            this.sound.play('wagon_sucess');
                        } else {
                            this.sound.play('wagon_success_bad');
                        }
                    }
                }
            });

            //single-player: automatically dispatch wagons
            if (!game.settings.twoPlayer) {
                if (this.getTime() >= this.nexWagonTime) {
                    if (Phaser.Math.Between(1, 100) < game.settings.singlePlayerWagonChance) {

                        let lane = this.pickWagonLane();
                        if (lane == this.wagonLane3) {
                            this.wagonGroup.dispatch(this.wagonLane3, 3, 0);
                        }
                        else if (lane == this.wagonLane2) {
                            this.wagonGroup.dispatch(this.wagonLane2, 2, 2);
                        }
                        else if (lane == this.wagonLane1) {
                            this.wagonGroup.dispatch(this.wagonLane1, 1, 4);
                        }
                        this.nexWagonTime = this.getTime() + game.settings.wagonFrequency * 1000;
                    }
                }
            }
        }

        //return to menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.music.stop();
            this.scene.start('menu');
        }

        //reset the game
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.music.stop();
            this.scene.restart();
        }
    }

    //this is called whenever a wagon is clicked
    boostWagon(wagon) {
        if (!game.settings.twoPlayer) {
            return;
        }
        if (this.getTime() < this.boostTargetTime) {
            console.log("can't boost yet");
            return;
        }

        if (wagon.alive) {
            this.boostTargetTime = this.getTime() + (game.settings.wagonBoostCoolDown * 1000);
            this.sound.play('wagon_dash', { volume: 0.5 });

            let trail = this.add.sprite(wagon.x, wagon.y, 'wagonTrail').setOrigin(0).setScale(2).setDepth(wagon.depth);
            trail.x += 150;
            trail.y += 10
            trail.anims.play('wagonDashAnim');
            trail.on('animationcomplete', () => {
                trail.destroy();
            });

            wagon.boost();
        }
    }

    pickObsLane() {
        let lane = Phaser.Math.Between(1, 3);

        switch (lane) {
            case 1:
                return this.obsLane1;
            case 2:
                return this.obsLane2;
            default:
                return this.obsLane3;
        }
    }

    pickWagonLane() {
        let lane = Phaser.Math.Between(1, 3);

        switch (lane) {
            case 1:
                return this.wagonLane1;
            case 2:
                return this.wagonLane2;
            default:
                return this.wagonLane3;
        }
    }

    killWagon(wagon) {
        if (wagon.alive == true) {
            wagon.alive = false;
            this.sound.play('arrow_impact');
            wagon.alpha = 0;
            let boom = this.add.sprite(wagon.x, wagon.y, 'wagonFall').setOrigin(0).setScale(game.settings.wagonScale).setDepth(wagon.depth);
            boom.anims.play('wagonFallAnim');
            boom.on('animationcomplete', () => {
                wagon.reset();
                wagon.alpha = 1;
                boom.destroy();
            });
            this.updateScore(game.settings.lanePointsArcher[wagon.lane])
            if (!game.settings.twoPlayer) {
                this.increaseDifficulty();
            }

        }
    }
}

class ObstacleGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene, texture) {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 15,
            key: texture,
            active: false,
            visible: false,
            classType: Obstacle,
        });
    }

    SpawnObstacle(y, depth, tint) {
        let obstacle = this.getFirstDead(false);
        if (obstacle) {
            obstacle.Spawn(y, depth);
            obstacle.setTint(tint);
        }
    }
}

class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, 0, 0, texture);

    }

    update() {

        if (this.x >= game.config.width + this.displayWidth) {
            this.setActive(false);
            this.setVisible(false);
        }
    }

    Spawn(y, depth) {
        this.setActive(true);
        this.setVisible(true);
        this.x = -80;
        this.y = y;
        this.setDepth(depth);
    }

    move(moveSpeed) {
        this.update();
        this.x += moveSpeed;
    }
}

