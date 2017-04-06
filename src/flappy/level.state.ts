import {ScoreService} from "../score.service";
import {Constantes} from "./contantes";
import {LooseState} from "./loose.state";

export class LevelState extends Phaser.State {

    private currentScore: number;
    private gameStarted: boolean;

    private scoreService: ScoreService;
    private backgroundTween: Phaser.Tween;
    private rocket: Phaser.Sprite;
    private jumpSound: Phaser.Sound;
    private pipes: Phaser.Group;
    private timer: Phaser.TimerEvent;
    private labelHightScore: Phaser.BitmapText;
    private labelCurrentScore: Phaser.BitmapText;
    private labelClickToStart: Phaser.BitmapText;

    constructor() {
        super();
        this.scoreService = new ScoreService(Constantes.GAME_NAME);
    }

    create() {

        this.time.advancedTiming = true;
        //this.game.time.desiredFps = 30;
        /*if (this.game.raf.isRAF()) {
            this.game.raf.start();
        }*/

        this.currentScore = 0;
        this.gameStarted = false;

        // Set the background
        this.game.stage.setBackgroundColor('#ffffff');
        let background = this.game.add.sprite(0, 0, 'background');
        background.scale.setTo(0.6);
        this.backgroundTween = this.game.add.tween(background)
            .to({ x: -2800 }, 10000, Phaser.Easing.Linear.None, true, 0, -1);

        // Set the physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        // Display the rocket at the position x=100 and y=245
        this.rocket = this.game.add.sprite(70, 270, 'rocket');
        this.rocket.scale.setTo(0.25, 0.25);
        // Move the anchor to the left and downward
        this.rocket.anchor.setTo(-0.1, 0.5);
        // Add physics to the rocket
        // Needed for: movements, gravity, collisions, etc.
        this.game.physics.arcade.enable(this.rocket);
        // Add sound
        this.jumpSound = this.game.add.audio('jump');
        // Create an empty group
        this.pipes = this.game.add.group();
        // Label "Press to begin"
        this.labelClickToStart = this.game.add.bitmapText(270, 240, 'myfont', 'Toucher pour commencer', 60);
        this.labelClickToStart.smoothed = true;
        // Call the 'jump' function when the spacekey is hit
        let spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        this.game.input.onDown.add(this.jump, this);
    }

    render() {
        if (Constantes.DEBUG) {
            this.game.debug.text(this.game.time.fps.toString(), 2, 14, "#00ff00");
        }
    }

    update() {

        if (this.gameStarted) {

            this.manageTimer();

            // Go through all the pipes
            this.pipes.forEach((p: Phaser.Sprite) => {
                if (this.game.physics.arcade.overlap(this.rocket, p, this.hitPipe, null, this)) {
                    return;
                }

                if (p.position.x < 0) {
                    p.destroy();
                } else if (p.position.x < 105 && p.position.x > 95 && !p.data.scoreDone) {
                    this.currentScore++;
                    this.updateScore();
                    p.data.scoreDone = true;
                }
            }, this);

            console.log(this.pipes);

            if (this.rocket.y <= 0) {
                // If the rocket is out of the screen (too low)
                // Call the 'restartGame' function
                this.rocket.y = 0;
            } else if (this.rocket.y > this.game.height) {
                // Else
                // Set it to the top
                this.restartGame();
            }

            if (this.rocket.angle < 10)  {
                this.rocket.angle += 1;
            }
        } else {
            this.rocket.frame = 2;
        }
    }

    jump () {

        if (!this.gameStarted) {
            // LAUNCH GAME
            this.gameStarted = true;
            // Add gravity to the rocket to make it fall
            this.rocket.body.gravity.y = 2000;

            this.rocket.animations.add('walk');
            this.rocket.animations.play('walk', 5, true);

            // Show scores
            this.updateScore();
            // Destroy label "press to start"
            this.labelClickToStart.destroy();

        } else {

            if (this.rocket.alive == false) {
                return;
            }

            // JUMP
            // Add a vertical velocity to the rocket
            this.rocket.body.velocity.y = -700;
            // Play sound
            this.jumpSound.play();
            // Create an animation on the rocket
            this.game.add.tween(this.rocket).to({angle: -10}, 200).start();
            // Fire animation
            this.rocket.frame = 1;
        }
    }

    manageTimer() {

        let time;

        if (this.currentScore < Constantes.MEDIUM_SCORE) {
            time = 2200;//2500;
        } else if (this.currentScore < Constantes.HARD_SCORE) {
            time = 1900;//2200;
        } else {
            time = 1600;//1900;
        }

        if (this.timer == null) {
            // Add pipes time
            this.timer = this.game.time.events.loop(time, this.addRowOfPipes, this);

            return;
        } else {
            if (this.timer.delay !== time) {
                this.game.time.events.remove(this.timer);
                this.timer = this.game.time.events.loop(time, this.addRowOfPipes, this);
            }
        }
    }

    restartGame() {
        this.scoreService.setHightscore(this.currentScore);
        LooseState.currentScore = this.currentScore;
        this.game.state.start("loose");
    }

    addOnePipe(y:number, gate: number, reverse: boolean = false) {

        let pipe;
        if (!reverse) {
            pipe = this.game.add.sprite(this.game.width, y + gate, 'pipe');
            pipe.scale.setTo(0.435, 0.435);

        } else {
            pipe = this.game.add.sprite(this.game.width + 105, y + gate, 'pipe');
            pipe.scale.setTo(-0.435, -0.435);
        }

        pipe.data.scoreDone = false;

        // Add the pipe to our previously created group
        this.pipes.add(pipe);

        // Enable physics on the pipe
        this.game.physics.arcade.enable(pipe);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -400;
    }

    addRowOfPipes()  {

        const max = 520;
        let min;

        if (this.currentScore < Constantes.MEDIUM_SCORE) {
            min = 200;
        } else if (this.currentScore < Constantes.HARD_SCORE) {
            min = 170;
        } else if (this.currentScore < Constantes.EXTREME_SCORE) {
            min = 150;
        } else {
            min = 130;
        }

        // Randomly pick a number between 450 and 70
        let value = Math.floor(Math.random() * max) + min;

        if (value > max) {
            value = max;
        } else if (value < min) {
            value = min;
        }

        const holeP2 = value;
        const holeP1 = holeP2 - (max + min);

        this.addOnePipe(0, holeP1);
        this.addOnePipe(this.game.height, holeP2, true);
    }

    updateScore() {
        // Hightscore label is define only at beginning
        if (this.labelHightScore == null) {
            this.labelHightScore = this.game.add.bitmapText(20, 20, 'myfont', 'Hightscore : ' + this.scoreService.getHightscore(), 40);
            this.labelHightScore.smoothed = true;
        }

        const currText = "Actuel : " + this.currentScore.toString();
        // If current is not define, define it, else update it
        if (this.labelCurrentScore == null) {
            this.labelCurrentScore = this.game.add.bitmapText(20, 60, 'myfont', currText, 40);
            this.labelCurrentScore.smoothed = true;
        } else {
            this.labelCurrentScore.text = currText;
        }
    }

    hitPipe() {
        // If the rocket has already hit a pipe, do nothing
        // It means the rocket is already falling off the screen
        if (this.rocket.alive == false) {
            return;
        }

        // Stop background
        this.backgroundTween.pause();

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
    }
}