class WagonGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene) {
		super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 8,
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
            wagon.lane = laneNumber;
            wagon.dispatch(yPos);
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

        this.lane;
        this.madeIt = false;
    }

    update() {
        if (this.x <= 0 - this.displayWidth/2){
            this.madeIt = true;
            this.reset();
        }
    }

    reset() {
        this.x = game.config.width + this.width;
        this.alive = true;
        this.ready = true;
        this.visible = false;
        this.active = false;
        this.body.setVelocityX(0);
        if (game.settings.twoPlayer == false){
            console.log("in singleplayer, and want to send a wagon");
        }
    }

    dispatch(yPos) {
        if (this.ready && this.body){
            this.y = yPos;
            this.x = game.config.width;
            this.ready = false;
            this.setActive(true);
            this.setVisible(true);
            this.body.setVelocityX(-game.settings.wagonSpeed, 0);
        }
        
    }

}