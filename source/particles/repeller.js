/**
 * Created by STORMSEN on 04.12.2016.
 */

var PIXI = require('pixi.js');
import {Vector2} from './../math/vector2';

class Repeller extends PIXI.Container {
    constructor(_location, _radius) {
        super()

        this.location = _location;
        this.radius = _radius;
        this.strength = 750;

        this.gfx = new PIXI.Graphics();

        this.addChild(this.gfx)
        this.gfx.lineStyle(1, 0xff3300);
        this.gfx.drawCircle(this.location.x, this.location.y, this.radius * 2);
    }

    constrain(value, min, max) {
        return Math.min(Math.max(value, min), max)
    }

    repel(p) {
        let dir = Vector2.subtract(this.location, p.location);
        let d = dir.length();
        let force = -1 * this.strength / (d * d);
        dir.normalize().multiplyScalar(force);
        return dir;
    }
}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Repeller;