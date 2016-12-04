/**
 * Created by STORMSEN on 04.12.2016.
 */

var PIXI = require('pixi.js');

class Bounds extends PIXI.Container {

    constructor(x1, y1, x2, y2) {
        super()

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Bounds;