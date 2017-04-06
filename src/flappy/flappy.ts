import {Constantes} from "./contantes";
import {BootState} from "./boot.state";
import {LevelState} from "./level.state";
import {MenuState} from "./menu.state";
import {LooseState} from "./loose.state";

export class FlappyGame extends Phaser.Game {

    constructor() {
        super(Constantes.width, Constantes.height, Phaser.AUTO, 'content', null);

        this.state.add('boot', BootState);
        this.state.add('menu', MenuState);
        this.state.add('level', LevelState);
        this.state.add('loose', LooseState);

        this.state.start('boot');
    }

}
