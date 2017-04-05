import {Constantes} from "./contantes";
import {LevelState} from "./level.state";
import {ScoreService} from "../score.service";

export class LooseState extends Phaser.State {

    static currentScore: number = 0;
    private scoreService: ScoreService;
    private clickSound: Phaser.Sound;

    constructor() {
        super();
        this.scoreService = new ScoreService(Constantes.GAME_NAME);
    }

    create() {
        // Set the background color
        this.game.stage.setBackgroundColor('#ffffff');
        // Set the sound
        this.clickSound = this.game.add.audio('click');
        // Set the background
        let ending = this.game.add.sprite(70, 30, 'ending');
        ending.scale.setTo(0.55);
        // Set the button replay
        let buttonReplay = this.game.add.button(70, 480, 'rejouer', this.replay, this, 0, 1, 0);
        buttonReplay.scale.setTo(0.5);
        // Set the button replay
        let buttonQuit = this.game.add.button(490, 480, 'quitter', this.quit, this, 0, 1, 0);
        buttonQuit.scale.setTo(0.5);
        // Texts
        this.game.add.bitmapText(300, 20, 'myfont', 'Bravo !', 120);

        if (this.scoreService.getHightscore() === LooseState.currentScore) {
            this.game.add.bitmapText(250, 120, 'myfont', 'Tu as obtenu', 70);
            this.game.add.bitmapText(230, 170, 'myfont', 'le meilleur score', 70);
        } else {
            this.game.add.bitmapText(250, 150, 'myfont', 'Tu as obtenu', 70);
        }

        this.game.add.bitmapText(280, 210, 'myfont', LooseState.currentScore.toString() + ' pts', 120);
        // Add stars
        let star1 = this.game.add.sprite(250, 320, 'etoile');
        star1.scale.setTo(0.5);
        star1.frame = 1;

        if (LooseState.currentScore >= Constantes.MEDIUM_SCORE) {
            star1.frame = 0;
        }

        let star2 = this.game.add.sprite(350, 320, 'etoile');
        star2.scale.setTo(0.5);
        star2.frame = 1;

        if (LooseState.currentScore >= Constantes.HARD_SCORE) {
            star2.frame = 0;
        }

        let star3 = this.game.add.sprite(450, 320, 'etoile');
        star3.scale.setTo(0.5);
        star3.frame = 1;

        if (LooseState.currentScore >= Constantes.EXTREME_SCORE) {
            star3.frame = 0;
        }
    }

    replay() {
        this.clickSound.play();

        this.game.state.remove('level');
        this.game.state.add('level', LevelState);
        this.game.state.start('level', true, false);
    }

    quit() {
        this.clickSound.play();

        this.game.state.remove('level');
        this.game.state.add('level', LevelState);
        this.game.state.start('menu');
    }

}