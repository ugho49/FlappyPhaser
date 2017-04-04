import TimerEvent = Phaser.TimerEvent;
import {ScoreService} from "./score.service";

export class Flappy {

    private game: Phaser.Game;

    private labelStyle = { font: "30px IndieFlower", fill: "#000000" };
    private scoreService: ScoreService;
    private currentScore: number = 0;
    private gameWidth: number;
    private gameHeight: number;

    private gameStarted: boolean = false;
    private labelClickToStart: Phaser.Text;

    private rocket: Phaser.Sprite;
    private fires: Phaser.Group;
    private pipes: Phaser.Group;
    private timer: TimerEvent;
    private labelHightScore: Phaser.Text;
    private labelCurrentScore: Phaser.Text;
    private jumpSound: Phaser.Sound;
    private background: Phaser.TileSprite;

    constructor() {
        this.gameHeight = window.innerHeight /*600*/;
        this.gameWidth = window.innerWidth /*800*/;
        this.scoreService = new ScoreService("flappy");
        this.game = new Phaser.Game(this.gameWidth, this.gameHeight, Phaser.AUTO, "content", this.mainState);
    }

    mainState = {
        preload: () => {
            this.game.load.image('background', '/assets/fond.png');

            this.game.load.image('fire', '/assets/fire.png');
            this.game.load.image('fire2', '/assets/fire2.png');

            this.game.load.image('rocket', '/assets/rocket.png');
            this.game.load.image('pipe', '/assets/pipe.png');
            this.game.load.image('tube', '/assets/tube.png');
            this.game.load.audio('jump', '/assets/jump.wav');
        },

        create: () => {
            // Set the background
            this.game.stage.setBackgroundColor('#ffffff');
            this.background = this.game.add.tileSprite(0, 0, this.gameWidth, this.gameHeight, 'background');

            this.background.tileScale.x = 0.68;
            this.background.tileScale.y = 0.68;

            // Set the physics system
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            // Display the rocket at the position x=100 and y=245
            this.rocket = this.game.add.sprite(100, 270, 'rocket');
            this.rocket.scale.setTo(0.25, 0.25);
            //this.rocket.checkWorldBounds = true;
            // Move the anchor to the left and downward
            this.rocket.anchor.setTo(-0.1, 0.5);
            // Add physics to the rocket
            // Needed for: movements, gravity, collisions, etc.
            this.game.physics.arcade.enable(this.rocket);
            // Add sound
            this.jumpSound = this.game.add.audio('jump');
            // Create an empty group
            this.pipes = this.game.add.group();
            // Create an empty group
            this.fires = this.game.add.group();
            // Label "Press to begin"
            this.labelClickToStart = this.game.add.text(100, 350, "", this.labelStyle);
            // Call the 'jump' function when the spacekey is hit
            let spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(this.mainState.jump);
        },

        update: () => {

            this.mainState.moveBackground();
            this.mainState.updateRocketFire();

            if (this.gameStarted) {

                // Go through all the pipes
                this.pipes.forEach((p: Phaser.Sprite) => {
                    if (p.position.x < 0) {
                        p.destroy();
                    } else if (p.position.x < 100.5 && p.position.x > 99.5 && !p.data.scoreDone) {
                        this.currentScore += 1;
                        this.mainState.updateScore();
                        p.data.scoreDone = true;
                    }
                }, this);


                if (this.rocket.y <= 0) {
                    // If the rocket is out of the screen (too low)
                    // Call the 'restartGame' function
                    this.rocket.y = 0;
                } else if (this.rocket.y > this.gameHeight) {
                    // Else
                    // Set it to the top
                    this.mainState.restartGame();
                }

                if (this.rocket.angle < 10)  {
                    this.rocket.angle += 1;
                }

                this.game.physics.arcade.overlap(this.rocket, this.pipes, this.mainState.hitPipe, null, this);
            } else {
                if (this.labelClickToStart != null) {
                    this.labelClickToStart.destroy();
                    this.labelClickToStart = this.game.add.text(100, 350, "Press space to start", this.labelStyle);
                }
            }
        },

        jump: () => {

            if (!this.gameStarted) {
                // LAUNCH GAME
                this.gameStarted = true;
                // Add gravity to the rocket to make it fall
                this.rocket.body.gravity.y = 1600;
                // Show scores
                this.mainState.updateScore();
                // Destroy label "press to start"
                this.labelClickToStart.destroy();
                // Add pipes every 1.8s
                this.timer = this.game.time.events.loop(1200, this.mainState.addRowOfPipes);
            } else {

                if (this.rocket.alive == false) {
                    return;
                }

                // JUMP
                // Add a vertical velocity to the rocket
                this.rocket.body.velocity.y = -500;
                // Play sound
                this.jumpSound.play();
                // Create an animation on the rocket
                let animation = this.game.add.tween(this.rocket);
                // Change the angle of the rocket to -10° in 200 milliseconds
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

        updateRocketFire: () => {

            if (this.fires.length == 0) {
                let f1 = this.game.add.sprite(0, 0, 'fire');
                let f2 = this.game.add.sprite(10, 0, 'fire2');

                f1.alpha = 0;
                f1.scale.setTo(0.25, 0.25);

                f2.alpha = 0;
                f2.scale.setTo(0.25, 0.25);

                this.game.add.tween(f1).to( { alpha: 1 }, 800,  "Linear", true, 0, -1, true);
                this.game.add.tween(f2).to( { alpha: 1 }, 800,  "Linear", true, 800, -1, true);

                this.fires.add(f1);
                this.fires.add(f2);
            }


            this.fires.x = this.rocket.x - 20;
            this.fires.y = this.rocket.y - 5;
            this.fires.angle = this.rocket.angle;

        },

        addOnePipe: (y:number, gate: number, reverse: boolean = false) => {

            let pipe;
            if (!reverse) {
                pipe = this.game.add.sprite(this.gameWidth, y + gate, 'tube');
                pipe.scale.setTo(0.435, 0.435);

            } else {
                pipe = this.game.add.sprite(this.gameWidth + 105, y + gate, 'tube');
                pipe.scale.setTo(-0.435, -0.435);
            }

            pipe.data.scoreDone = false;

            // Add the pipe to our previously created group
            this.pipes.add(pipe);

            // Enable physics on the pipe
            this.game.physics.arcade.enable(pipe);

            // Add velocity to the pipe to make it move left
            pipe.body.velocity.x = -400;
        },

        addRowOfPipes: () => {
            // Randomly pick a number between 450 and 70
            let value = Math.floor(Math.random() * 450) + 70;

            if (value > 450) {
                value = 450;
            } else if (value < 70) {
                value = 70;
            }

            let holeP2 = value;
            let holeP1 = holeP2 - 520;

            this.mainState.addOnePipe(0, holeP1);
            this.mainState.addOnePipe(this.gameHeight, holeP2, true);
        },

        updateScore: () => {

            // Hightscore label is define only at beginning
            if (this.labelHightScore == null) {
                this.labelHightScore = this.game.add.text(20, 20, "Hightscore : " + this.scoreService.getHightscore(), this.labelStyle);
            }

            // If current is not define, define it, else update it
            if (this.labelCurrentScore == null) {
                this.labelCurrentScore = this.game.add.text(20, 60, "Current : " + this.currentScore.toString(), this.labelStyle);
            } else {
                this.labelCurrentScore.text = "Current : " + this.currentScore.toString();
            }
        },

        hitPipe: () => {
            // If the rocket has already hit a pipe, do nothing
            // It means the rocket is already falling off the screen
            if (this.rocket.alive == false) {
                return;
            }

            // Stop background
            this.background.data.stopPosition = this.background.tilePosition.x;

            // Set the alive property of the rocket to false
            this.rocket.alive = false;

            // Prevent new pipes from appearing
            this.game.time.events.remove(this.timer);

            // Increase rocket gravity
            this.rocket.body.gravity.y = 4000;

            // Go through all the pipes, and stop their movement
            this.pipes.forEach((p: Phaser.Sprite) => {
                p.body.velocity.x = 0;
            }, this);
        },

        moveBackground: () => {
            if (!this.background.data.stopPosition) {
                this.background.tilePosition.x -= 8;
            } else {
                this.background.tilePosition.x = this.background.data.stopPosition;
            }
        }
    };

}
