class Play extends Phaser.Scene {
    constructor(){
        super("play");
    }

    preload(){
        this.load.image('starfield', 'assets/starfield.png');
        this.load.image('starfield_small', 'assets/starfield_small.png');
    }

    create(){

        this.starsSmall = this.add.tileSprite(0,0, game.config.width, game.config.height, 'starfield_small').setOrigin(0,0);
        this.starsLarge = this.add.tileSprite(0,0, game.config.width, game.config.height, 'starfield').setOrigin(0,0);
        

        this.add.text(20, 20, "play!!!");

        this.add.rectangle(0, 20, game.config.width, 80, 0x00FF00).setOrigin(0,0);
        this.add.rectangle(0, 0, game.config.width, borderPadding, 0xfacade).setOrigin(0,0);
        this.add.rectangle(0, 0, borderPadding, game.config.height, 0xfacade).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderPadding, game.config.width, borderPadding, 0xfacade).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderPadding, 0, borderPadding, game.config.height, 0xfacade).setOrigin(0,0);

    }
    update(){

        this.starsLarge.tilePositionX -= 2;
        this.starsSmall.tilePositionX -= 1;
    }

}