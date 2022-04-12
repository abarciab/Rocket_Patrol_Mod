class Menu extends Phaser.Scene {
    constructor(){
        super("menu");
    }
    create(){
        this.add.text(20, 20, "menu!!!");

        this.scene.start("play");
    }
}