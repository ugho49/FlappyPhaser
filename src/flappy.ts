import TimerEvent = Phaser.TimerEvent;
import {ScoreService} from "./score.service";

export class Flappy {

    private labelStyle = { font: "30px Arial", fill: "#ffffff" };
    private scoreService: ScoreService;
    private currentScore: number = 0;
    private gameWidth: number = 800;
    private gameHeight: number = 600;

    private gameStarted: boolean = false;
    private labelClickToStart: Phaser.Text;

    private game: Phaser.Game;
    private bird: Phaser.Sprite;
    private pipes: Phaser.Group;
    private timer: TimerEvent;
    private labelHightScore: Phaser.Text;
    private labelCurrentScore: Phaser.Text;
    private jumpSound: Phaser.Sound;

    constructor() {
        this.scoreService = new ScoreService("flappy");
        this.game = new Phaser.Game(this.gameWidth, this.gameHeight, Phaser.AUTO, "content", this.mainState);
        /*this.game.state.add("main", this.mainState);
        this.game.state.start("main");*/
    }

    mainState = {
        preload: () => {
            this.game.load.image('background', '/assets/background.jpg');
            this.game.load.image('bird', '/assets/rocket.png');
            this.game.load.image('pipe', '/assets/pipe.png');
            this.game.load.image('pipeL', '/assets/pipe_long.png');
            this.game.load.audio('jump', '/assets/jump.wav');
        },

        create: () => {
            // Set the background
            this.game.add.sprite(0, 0, 'background');
            // Set the physics system
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            // Display the bird at the position x=100 and y=245
            this.bird = this.game.add.sprite(100, 270, 'bird');
            this.bird.scale.setTo(0.25, 0.25 );
            this.bird.checkWorldBounds = true;
            // Move the anchor to the left and downward
            this.bird.anchor.setTo(-0.1, 0.5);
            // Add physics to the bird
            // Needed for: movements, gravity, collisions, etc.
            this.game.physics.arcade.enable(this.bird);
            // Add sound
            this.jumpSound = this.game.add.audio('jump');
            // Create an empty group
            this.pipes = this.game.add.group();
            // Show label "press to start"
            this.labelClickToStart = this.game.add.text(100, 350, "Press space to start", this.labelStyle);

            // Call the 'jump' function when the spacekey is hit
            let spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(this.mainState.jump);
        },

        update: () => {

            if (this.gameStarted) {

                // Go through all the pipes
                this.pipes.forEach((p: Phaser.Sprite) => {
                    if (p.position.x < 0) {
                        p.destroy();
                    } else if (p.position.x < 100.5 && p.position.x > 99.5 && !p.data.scoreDone) {
                        this.currentScore += 1/8;
                        this.mainState.updateScore();
                        p.data.scoreDone = true;
                    }
                }, this);

                if (this.bird.y <= 0) {
                    // If the bird is out of the screen (too low)
                    // Call the 'restartGame' function
                    this.bird.y = 0;
                } else if (this.bird.y > this.gameHeight) {
                    // Else
                    // Set it to the top
                    this.mainState.restartGame();
                }

                if (this.bird.angle < 10)  {
                    this.bird.angle += 1;
                }

                this.game.physics.arcade.overlap(this.bird, this.pipes, this.mainState.hitPipe, null, this);
            }
        },

        jump: () => {

            if (!this.gameStarted) {
                // LAUNCH GAME
                this.gameStarted = true;
                // Add gravity to the bird to make it fall
                this.bird.body.gravity.y = 1600;
                // Show scores
                this.mainState.updateScore();
                // Destroy label "press to start"
                this.labelClickToStart.destroy();
                // Add pipes every 1.8s
                this.timer = this.game.time.events.loop(1300, this.mainState.addRowOfPipes);
            } else {

                if (this.bird.alive == false) {
                    return;
                }

                // JUMP
                // Add a vertical velocity to the bird
                this.bird.body.velocity.y = -500;
                // Play sound
                this.jumpSound.play();
                // Create an animation on the bird
                let animation = this.game.add.tween(this.bird);
                // Change the angle of the bird to -10° in 200 milliseconds
                animation.to({angle: -10}, 200);
                // And start the animation
                animation.start();
            }


        },

        restartGame: () => {
            this.scoreService.setHightscore(this.currentScore);
            //console.log("you loose");
            this.game.paused = true;

            alert("Vous avez perdu !");
            location.reload();
            //this.game.state.destroy();
        },

        addOnePipe: (x: number, y: number, reverse: boolean = false) => {
            // Create a pipe at the position x and y
            let pipe = this.game.add.sprite(x, y, 'pipe');
            pipe.data.scoreDone = false;
            // Automatically kill the pipe when it's no longer visible
            //pipe.checkWorldBounds = true;
            //pipe.outOfBoundsKill = true;

            // Add the pipe to our previously created group
            this.pipes.add(pipe);

            // Enable physics on the pipe
            this.game.physics.arcade.enable(pipe);

            // Add velocity to the pipe to make it move left
            pipe.body.velocity.x = -400;

        },

        addRowOfPipes: () => {
            // Randomly pick a number between 1 and 5
            // This will be the hole position
            let hole = Math.floor(Math.random() * 5) + 1;

            //let hole = Math.floor(Math.random() * 50) + 50;

            // Add the 12 pipes
            // With one big hole at position 'hole' and 'hole + 1'
            for (let i = 0; i < 10; i++) {
                if (i != hole && i != hole + 1) {
                    this.mainState.addOnePipe(this.gameWidth, i * 60 + 5);
                }
            }
        },

        updateScore: () => {
            // If current is not define, define it, else update it
            if (this.labelCurrentScore == null) {
                this.labelCurrentScore = this.game.add.text(20, 60, "Current : " + this.currentScore.toString(), this.labelStyle);
            } else {
                this.labelCurrentScore.text = "Current : " + this.currentScore.toString();
            }

            // Hightscore label is define only at beginning
            if (this.labelHightScore == null) {
                this.labelHightScore = this.game.add.text(20, 20, "Hightscore : " + this.scoreService.getHightscore(), this.labelStyle);
            }
        },

        hitPipe: () => {
            // If the bird has already hit a pipe, do nothing
            // It means the bird is already falling off the screen
            if (this.bird.alive == false) {
                return;
            }

            // Set the alive property of the bird to false
            this.bird.alive = false;

            // Prevent new pipes from appearing
            this.game.time.events.remove(this.timer);

            // Increase bird gravity
            this.bird.body.gravity.y = 4000;

            // Go through all the pipes, and stop their movement
            this.pipes.forEach((p: Phaser.Sprite) => {
                p.body.velocity.x = 0;
            }, this);
        },
    };

}
