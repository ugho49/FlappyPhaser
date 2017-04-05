import {Constantes} from "./contantes";
import {BootState} from "./boot.state";
import {LevelState} from "./level.state";

export class FlappyGame extends Phaser.Game {

    constructor() {
        super(Constantes.width, 600, Phaser.AUTO, 'content', null);

        this.state.add('boot', BootState);
        this.state.add('level', LevelState);

        this.state.start('boot');
    }

}
