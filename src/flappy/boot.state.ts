export class BootState extends Phaser.State {


    constructor() {
        super();
    }

    preload() {

        // Spritesheets
        this.load.spritesheet('rocket', '/assets/rocket-sheet.png', 434, 163, 3, 0, 10);
        this.load.spritesheet('etoile', '/assets/etoile-sheet.png', 138, 159, 2, 0, 10);
        this.load.spritesheet('jouer', '/assets/jouer-sheet.png', 403, 191, 2, 0, 10);
        this.load.spritesheet('quitter', '/assets/quitter-sheet.png', 403, 191, 2, 0, 10);
        this.load.spritesheet('rejouer', '/assets/rejouer-sheet.png', 403, 191, 2, 0, 10);

        // Images
        this.load.image('fire', '/assets/fire.png');
        this.load.image('fire2', '/assets/fire2.png');
        this.load.image('pipe', '/assets/tube.png');
        this.load.image('background', '/assets/fond.png');
        this.load.image('titre', '/assets/titre.png');
        this.load.image('fond-launcher', '/assets/fond-launcher.png');
        this.load.image('fusee-accueil', '/assets/fusee-accueil.png');
        this.load.image('fumee-accueil', '/assets/fumee-accueil.png');
        this.load.image('hand', '/assets/hand.png');
        this.load.image('ending', '/assets/ending-screen.png');

        // Sounds
        this.load.audio('jump', '/assets/jump.wav');
        this.load.audio('click', '/assets/clic.ogg');

        // Font
        this.game.load.bitmapFont('myfont', '/fonts/hand/font.png', '/fonts/hand/font.fnt');
    }

    create() {
        this.game.state.start('menu');
    }

}