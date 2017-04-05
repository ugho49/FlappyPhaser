export class MenuState extends Phaser.State {

    private clickSound: Phaser.Sound;

    constructor() {
        super();
    }

    create() {
        // Set the background
        let background = this.game.add.sprite(0, 0, 'fond-launcher');
        background.scale.setTo(0.5, 0.6);
        // Set the sound
        this.clickSound = this.game.add.audio('click');
        // Set the title
        let title = this.game.add.sprite(20, 40, 'titre');
        title.scale.setTo(0.5);
        // Set the rocket
        let rocket = this.game.add.sprite(380, 420, 'fusee-accueil');
        rocket.scale.setTo(0.5);
        // Set the cloud
        let cloud = this.game.add.sprite(630, 470, 'fumee-accueil');
        cloud.scale.setTo(0.5);
        // Set the hand
        let hand = this.game.add.sprite(470, 340, 'hand');
        hand.scale.setTo(0.25);
        this.game.add.tween(hand).to( { y: 310 }, 1000, Phaser.Easing.Linear.None, true, 100, -1, true);
        // Set the button
        let button = this.game.add.button(130, 400, 'jouer', this.play, this, 0, 1, 0);
        button.scale.setTo(0.5);
    }

    play() {
        this.clickSound.play();
        this.game.state.start('level');
    }

}