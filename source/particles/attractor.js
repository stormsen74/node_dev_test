/**
 * Created by STORMSEN on 04.12.2016.
 */

var PIXI = require('pixi.js');
import {Vector2} from './../math/vector2';

class Attractor extends PIXI.Container {
    constructor(_location, _radius) {
        super()

        this.location = _location;
        this.radius = _radius;
        this.strength = 1000;

        this.gfx = new PIXI.Graphics();

        this.addChild(this.gfx)
        this.gfx.lineStyle(1, 0x33ff00);
        this.gfx.drawCircle(this.location.x, this.location.y, this.radius * 2);
    }

    constrain(value, min, max) {
        return Math.min(Math.max(value, min), max)
    }

    attract(p) {
        let dir = Vector2.subtract(this.location, p.location);
        let d = dir.length();
        let force = (this.strength * p.mass) / (d * d);
        dir.normalize().multiplyScalar(force);
        return dir;
    }
}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Attractor;