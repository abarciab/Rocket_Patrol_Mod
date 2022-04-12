class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, currentTime) {
        super (scene, x, y, texture, currentTime);
    
        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = 5;
        this.sfxRocket = scene.sound.add('sfx_rocket');

        //fire coolDown
        this.fireCoolDown = 3000;
        
        this.currentTime = currentTime;
        this.targetTime = this.currentTime;
        this.canFire = true;
        console.log("rocket created. time: " + currentTime);
    }

    update(updatedTime){

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
            this.isFiring = true;
            this.targetTime = updatedTime + this.fireCoolDown;
            this.sfxRocket.play({volume:0.2});
        }

        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }

        if (this.y <= borderUISize * 3 + borderPadding){
            this.reset();
        }
    }

    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}


