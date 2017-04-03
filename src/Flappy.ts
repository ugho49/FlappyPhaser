export class Flappy {

    currentScore: number = 0;
    gameWidth: number = 800;
    gameHeight: number = 600;

    game: Phaser.Game;
    bird: Phaser.Sprite;
    pipes: Phaser.Sprite[] = [];

    constructor() {
        this.game = new Phaser.Game(this.gameWidth, this.gameHeight, Phaser.AUTO, "content", this.mainState);
        /*this.game.state.add("main", this.mainState);
        this.game.state.start("main");*/
    }

    mainState = {
        preload: () => {
            this.game.load.image('background', '/assets/background.jpg');
            this.game.load.image('bird', '/assets/bird.png');
            this.game.load.image('pipe', '/assets/pipe.png');
            this.game.load.audio('jump', '/assets/jump.wav');
        },

        create: () => {
            // Set the background
            this.game.add.sprite(0, 0, 'background');
            // Set the physics system
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            // Display the bird at the position x=100 and y=245
            this.bird = this.game.add.sprite(100, 245, 'bird');
            // Add physics to the bird
            // Needed for: movements, gravity, collisions, etc.
            this.game.physics.arcade.enable(this.bird);
            // Add gravity to the bird to make it fall
            this.bird.body.gravity.add(0, 1000);
            // Call the 'jump' function when the spacekey is hit
            let spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(this.jump);
        },

        update: () => {
            // If the bird is out of the screen (too high or too low)
            // Call the 'restartGame' function

            if (this.bird.y < 0 || this.bird.y > this.gameHeight) {
                this.restartGame();
            }
        },

        jump: () => {
            console.log("jump called");
            // Add a vertical velocity to the bird
            this.bird.body.velocity.add(0, -250);
        },

        restartGame: () => {
            console.log("you loose");
            //this.
            this.game.state.restart();
        }
    };

}
