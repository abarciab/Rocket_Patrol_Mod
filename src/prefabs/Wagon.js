class WagonGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene) {
		super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 5,
            key: 'wagon',
            active: false,
            visible: false,
            x: game.config.width/2,
            y: game.config.height/2,
            classType: Wagon,
        })
    }

    dispatch(yPos, laneNumber, depth){
        let wagon = this.getFirstDead(false)
        if (wagon){
            wagon.dispatch(yPos, laneNumber);
            wagon.setDepth(depth);
        }
    }
}

class Wagon extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y){
        super (scene, x, y, 'wagon');
        scene.add.existing(this);
        
        this.moveSpeed = 0;
        this.alive = true;        
        this.ready = true;
        if (game.settings.twoPlayer == false){
            this.dispatch();
        }

        this.lane = -1;
        this.madeIt = false;

        this.boostFrames = 0;
    }

    getLane(){
        return this.lane;
    }

    boost(){
        //this.x -= game.settings.wagonBoostDist;
        this.boostFrames = 18;
        this.body.setVelocityX(-game.settings.wagonBoostDist);
    }

    update() {
        if (this.boostFrames > 0){
            this.boostFrames -= 1;
            if (this.boostFrames == 0){
                this.body.setVelocityX(-game.settings.wagonSpeed);
            }
        }
        if (this.x <= 0 - this.displayWidth){
            this.madeIt = true;
            this.reset();
        }
    }

    stop(){
        this.body.setVelocityX(0);
    }

    reset() {
        this.x = game.config.width + this.width;
        this.alive = true;
        this.ready = true;
        this.visible = false;
        this.active = false;
        this.body.setVelocityX(0);
    }

    dispatch(yPos, laneNumber) {
        if (this.ready && this.body){
            this.lane = laneNumber;
            console.log("lane updated: " + this.lane);
            this.y = yPos;
            this.x = game.config.width;
            this.ready = false;
            this.setActive(true);
            this.setVisible(true);
            this.body.setVelocityX(-game.settings.wagonSpeed, 0);
            this.alive = true;
        }
        
    }

}