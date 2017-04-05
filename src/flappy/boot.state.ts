export class BootState extends Phaser.State {


    constructor() {
        super();
        console.log("Boot");
    }

    preload() {
        this.load.image('background', '/assets/fond.png');
        this.load.image('fire', '/assets/fire.png');
        this.load.image('fire2', '/assets/fire2.png');
        this.load.image('rocket', '/assets/rocket.png');
        this.load.image('pipe', '/assets/tube.png');
        this.load.audio('jump', '/assets/jump.wav');
    }

    create() {
        this.game.state.start('level', true, false);
    }

}