/**
 * Created by STORMSEN on 01.12.2016.
 */

var PIXI = require('pixi.js');

import {Vector2} from './math/vector2';
import Particle from './particles/particle';

class Sim_01 extends PIXI.Container {

    constructor(_size) {
        super()

        this.t = 0;
        this.vCenter = new Vector2(_size.WIDTH* .5, _size.HEIGHT * .5);
        this.vPosition = new Vector2(150, 0);
        this.particle = new Particle();
        this.lines = new PIXI.Graphics();
        this.addChild(this.lines);
        this.addChild(this.particle);

        this.update();

        var v1 = new Vector2(100, 100);
        var v2 = new Vector2(50, 50);
        console.log('>>',Vector2.subtract(v1, v2))
    }


    update() {
        this.t += .1;

        this.vPosition.toPolar();
        // phi
        this.vPosition.y = this.t * .3;
        // r
        this.vPosition.x = 100 + Math.random() * 20;

        this.vPosition.toCartesian();

        // this.vCenter.jitter(10, 10);

        this.particle.position.x = this.vCenter.x + this.vPosition.x;
        this.particle.position.y = this.vCenter.y + this.vPosition.y;

        this.particle.tail.unshift({
            x: this.particle.position.x,
            y: this.particle.position.y
        });

        if (this.particle.tail.length > 100) {
            this.particle.tail.pop();
        }

        this.lines.clear();
        // this.lines.lineStyle(1, 0xffffff);
        this.lines.moveTo(this.particle.position.x, this.particle.position.y);
        this.particle.tail.forEach((point, index) => {
            this.lines.lineStyle(index * .1, 0xffffff);
            this.lines.lineTo(point.x, point.y);
        });
    }
}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sim_01;