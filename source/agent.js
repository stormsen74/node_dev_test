/**
 * Created by STORMSEN on 24.11.2016.
 */

var PIXI = require('pixi.js');
import {Vector2} from './vector2';

class Agent extends PIXI.Container {
    constructor(x = 0, y = 0, mass = .5) {
        super();

        this.location = new Vector2(x, y);
        this.velocity = new Vector2();
        this.acceleration = new Vector2();
        this.vecDesired = new Vector2();
        this.mass = mass;

        this.position.x = this.location.x;
        this.position.y = this.location.y;

        this.tail = [];
        // this.tail = [];


        this.shape = new PIXI.Graphics();
        this.shape.beginFill(0x00ccff)
        this.shape.drawCircle(0, 0, 2.5)
        this.shape.endFill()
        this.shape.cacheAsBitmap = true;

        // this.addChild(this.shape);
    }


    seek(vTarget) {
        this.vecDesired = Vector2.subtract(vTarget, this.location).normalize().multiplyScalar(Agent.SEEK_MAX_SPEED);
           // .multiply(this.SEEK_MAX_SPEED);

        this.vSteer = Vector2.subtract(this.vecDesired, this.velocity);

        // limit the magnitude of the steering force.
        // this.limitMax(this.vSteer, this.SEEK_MAX_FORCE);
        this.vSteer.clampLength(0, Agent.SEEK_MAX_FORCE);


        // apply the steering force
        this.applyForce(this.vSteer);
    }

    /*------------------------------------------------
     apply force (wind, gravity...)
     -------------------------------------------------*/

    applyForce(vForce) {
        var force = Vector2.divide(vForce, this.mass);
        this.acceleration.add(force);

    }

    update() {
        // this.velocity.add(this.wander);
        this.velocity.add(this.acceleration);
        // limit velocity
        this.velocity.clampLength(1,14);
        // this.limitMin(this.velocity, 1);
        // this.limitMax(this.velocity, 14);

        this.location.add(this.velocity);

        this.position.x = this.location.x;
        this.position.y = this.location.y;

        // set acceleration to zero!
        this.acceleration.multiplyScalar(0);

        // this.gfx.clear();
        // this.gfx.lineStyle(1, 0xffffff);
        // this.gfx.moveTo(0, 0);
        //
        // this.tail.forEach((point, index) => {
        //     this.gfx.lineTo(point.x, point.y);
        // });
    }

}


Agent.SEEK_MAX_SPEED = 15.0;
Agent.SEEK_MAX_FORCE = .2;





// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Agent;