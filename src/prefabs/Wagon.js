class Spaceship extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, texture, frame, pointValue){
        super (scene, x, y, texture, frame, pointValue);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = 0;

        this.alive = true;

        this.timesAcross = 0;
        this.ready = true;
        if (game.settings.twoPlayer == false){
            this.dispatch();
        }
    }

    update() {
        this.x -= this.moveSpeed;

        if (this.x <= 0 - this.width){
            this.timesAcross += 1;
            this.reset();
        }
    }

    reset() {
        this.x = game.config.width;
        this.alive = true;
        this.moveSpeed = 0;
        this.ready = true;
        if (game.settings.twoPlayer == false){
            this.dispatch();
        }
    }

    dispatch() {
        if (this.ready){
            this.ready = false;
            this.moveSpeed = game.settings.spaceshipSpeed;
        }
        
    }

}