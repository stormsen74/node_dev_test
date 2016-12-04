/**
 * Created by STORMSEN on 24.11.2016.
 */

var PIXI = require('pixi.js');
import {Vector2} from './../math/vector2';

class Particle extends PIXI.Container {
    constructor(x = 0, y = 0, mass = 1) {
        super();

        this.position.x = x;
        this.position.y = y;

        this.tail = [];

        this.mass = mass;

        this.shape = new PIXI.Graphics();
        this.shape.beginFill(0x00ccff)
        this.shape.drawCircle(0, 0, 2.5)
        this.shape.endFill()
        this.shape.cacheAsBitmap = true;

        this.addChild(this.shape);
        
    }
    



}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Particle;