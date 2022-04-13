class Archer extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, currentTime) {
        super (scene, x, y, texture, currentTime);
    
        scene.add.existing(this);
        this.moveSpeed = 5;
        this.sfxShoot = scene.sound.add('bow_shot');
        this.sfxReload = scene.sound.add('reload_bow');

        //fire cooldown
        this.fireCoolDown = 1000 * game.settings.arrowReloadSpeed;
        this.currentTime = currentTime;
        this.targetTime = this.currentTime;
        this.canFire = true
        this.reloaded = true;

        //arrows
        this.arrowGroup;
    }

    create(scene) {
        this.arrowGroup = new ArrowGroup(scene);
    }

    update(updatedTime){

        //play reload sound, just early enough that the player can only shoot once the sound is done playing
        if (updatedTime >= this.targetTime - this.sfxReload.duration*1000 && this.reloaded == false){
            this.sfxReload.play({volume: 1});
            this.reloaded = true;
        }
        //actually reload the bow
        if (updatedTime >= this.targetTime && this.canFire == false){
            this.canFire = true;
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
            this.reloaded = false;
        }

    }

    fire(){
        this.ShootArrow();
        this.sfxShoot.play();
    }

    ShootArrow(){
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

    reset(){
        this.positionX = -10;
    }
}




