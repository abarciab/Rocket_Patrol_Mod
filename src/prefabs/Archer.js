class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, currentTime) {
        super (scene, x, y, texture, currentTime);
    
        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = 5;
        this.sfxRocket = scene.sound.add('sfx_rocket');

        //fire cooldown
        this.fireCoolDown = 3000;
        this.currentTime = currentTime;
        this.targetTime = this.currentTime;
        this.canFire = true

        //arrows
        this.arrowGroup;
    }

    create() {
        this.arrowGroup = new this.arrowGroup(this);
        this.add
    }

    update(updatedTime){

        //fire cooldown
        if (updatedTime >= this.targetTime){
            this.canFire = true;
            console.log("archer can fire");
        } else {
            this.canFire = false;
        }

        //moving
        if (!this.isFiring){
            if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width){
                this.x += this.moveSpeed;
            }
        }
        
        //firing
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring && this.canFire){
            this.targetTime = updatedTime + this.fireCoolDown;
            this.fire();
        }

        //move projectile
        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }

        if (this.y <= borderUISize * 3 + borderPadding){
            this.reset();
        }
    }

    fire(){
        shootArrow();
        this.isFiring = true;
        this.sfxRocket.play({volume:0.2});
    }

    ShootArrow(){
        this.arrowGroup.shootArrow(this.x, this.y - 20);
    }

    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}

class ArrowGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene){
        super(scene.physics.world, scene);
        
        this.createMultiple({
            classType: Arrow,
            frameQuantity: 30,
            active: false,
            visible: false,
            key: 'rocket',
        })
    }

    shootArrow(x, y){
        const arrow = this.getFirstDead(false);
        if (arrow){
            arrow.shoot(x,y);
        }
    }
}

class Arrow {
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
}




