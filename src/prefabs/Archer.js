class Archer extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, currentTime) {
        super (scene, x, y, texture, currentTime);
    
        scene.add.existing(this);
        this.moveSpeed = 5;
        this.sfxRocket = scene.sound.add('sfx_rocket');
        this.sfxReload = scene.sound.add('reload_bow');

        //fire cooldown
        this.fireCoolDown = 1000;
        this.currentTime = currentTime;
        this.targetTime = this.currentTime;
        this.canFire = true

        //arrows
        this.arrowGroup;
    }

    create(scene) {
        this.arrowGroup = new ArrowGroup(scene);
    }

    update(updatedTime){

        //fire cooldown
        if (updatedTime >= this.targetTime && this.canFire == false){
            this.canFire = true;
            this.sfxReload.play({volume: 1});
            console.log("can fire");
        } else if (updatedTime < this.targetTime){
            this.canFire = false;
        }

        //moving
        if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.moveSpeed;
        } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width){
            this.x += this.moveSpeed;
        }
        
        
        //firing
        if (Phaser.Input.Keyboard.JustDown(keyF) && this.canFire){
            this.targetTime = updatedTime + this.fireCoolDown;
            this.fire();
        }

    }

    fire(){
        this.ShootArrow();
        this.sfxRocket.play({volume:0.2});
    }

    ShootArrow(){
        //return;
        this.arrowGroup.shootArrow(this.x, this.y - 20);
    }

    reset() {
        this.y = game.config.height - borderUISize - borderPadding;
    }
}

class ArrowGroup extends Phaser.Physics.Arcade.Group
{

	constructor(scene) {
		super(scene.physics.world, scene);

		this.createMultiple({
			frameQuantity: 30,
			key: 'rocket',
			active: true,
			visible: true,
			classType: Arrow
		});

        this.ID = 15;
	}

    shootArrow(x, y){
        let arrow = this.getFirstDead(false);
        if (arrow){
            arrow.shoot(x,y);
        }
    }
}

class Arrow extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, 'rocket');
        console.log("made an arrow!");
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.y <= 5){
            this.setActive(false);
            this.setVisible(false);
        }
    }

    shoot(x, y){
        this.body.reset(x,y);
        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(-900);
    }
}




