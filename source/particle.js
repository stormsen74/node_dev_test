/**
 * Created by STORMSEN on 24.11.2016.
 */

var PIXI = require('pixi.js');
import {Vector2} from './Vector2';

class Particle extends PIXI.Sprite {
    constructor(x = 0, y = 0, mass = 1) {
        super();

        this.position.x = x;
        this.position.y = y;

        this.dsf = 3;


        this.mass = mass;

        this.shape = new PIXI.Graphics();
        this.shape.beginFill(0xffffff)
        this.shape.drawCircle(0, 0, 10)
        this.shape.endFill()
        // this.shape.cacheAsBitmap = false;

        this.addChild(this.shape);
    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Particle;