/**
 * Created by STORMSEN on 24.11.2016.
 */

var PIXI = require('pixi.js');
import {Vector2} from './../math/vector2';
import Random from './../random'

import {DEFAULT_AGENT} from './../config';
import {COLORS} from './../config';
import {CLR} from './../config';

class Agent extends PIXI.Container {
    constructor(_location, mass = .5) {
        super();

        this.SEEK_MAX_SPEED = 10;
        this.SEEK_MAX_FORCE = .15;
        this.VELOCITY_MIN = 1;
        this.VELOCITY_MAX = 15;
        this.TAIL_LENGTH = 20;


        this.mass = mass;
        this.location = new Vector2(_location.x, _location.y);
        this.velocity = new Vector2();
        this.acceleration = new Vector2();
        this.angle = 0;

        this.vecDesired = new Vector2();
        this.vWander = new Vector2();

        this.position.x = _location.x;
        this.position.y = _location.y;

        this.tail = [];

        this.color = Random.item(COLORS);

        this.body = new PIXI.Graphics();
        this.body.alpha = .5;
        this.body.beginFill(this.color);
        //TODO -> UTILS MAP
        let r = Math.ceil(this.mass * 5);
        this.body.drawCircle(0, 0, r);
        this.body.endFill();
        //this.body.cacheAsBitmap = true;

        this.vDebug = new PIXI.Graphics();
        this.vDebug.lineStyle(1, this.color);
        // this.vDebug.x += r;
        this.vDebug.moveTo(0, 0);
        this.vDebug.lineTo(30, 0);

        //this.addChild(this.body);
        this.addChild(this.vDebug);

        //console.log(DEFAULT_AGENT)
    }


    seek(vTarget) {
        this.vecDesired = Vector2.subtract(vTarget, this.location).normalize().multiplyScalar(this.SEEK_MAX_SPEED);

        this.vSteer = Vector2.subtract(this.vecDesired, this.velocity);

        // limit the magnitude of the steering force.
        this.vSteer.clampLength(0, this.SEEK_MAX_FORCE);

        // apply the steering force
        this.applyForce(this.vSteer);
    }

    wander(jX, jY, strength) {
        this.vWander.jitter(jX, jY);
        this.vWander.normalize().multiplyScalar(.05);
        this.applyForce(this.vWander);
    }

    /*------------------------------------------------
     apply force
     -------------------------------------------------*/

    applyForce(vForce) {
        let force = Vector2.divide(vForce, this.mass);
        this.acceleration.add(force);
    }

    /*------------------------------------------------
     update
     -------------------------------------------------*/

    update() {

        this.velocity.add(this.acceleration);
        this.velocity.clampLength(this.VELOCITY_MIN, this.VELOCITY_MAX);
        this.location.add(this.velocity);

        this.angle = Vector2.getAngleRAD(this.velocity);

        this.position.x = this.location.x;
        this.position.y = this.location.y;
        this.rotation = this.angle;

        // set acceleration to zero!
        this.acceleration.multiplyScalar(0);

    }

    /*------------------------------------------------
     bounds 
     -------------------------------------------------*/

    wrap(bounds) {

        if (this.location.x < bounds.x1) {
            this.location.x = bounds.x2;
        } else if (this.location.x > bounds.x2) {
            this.location.x = bounds.x1;
        }
        if (this.location.y < bounds.y1) {
            this.location.y = bounds.y2;
        } else if (this.location.y > bounds.y2) {
            this.location.y = bounds.y1;
        }
    }


    bounce(bounds) {

        if (this.location.x < bounds.x1) {
            this.location.x = bounds.x1;
            this.velocity.x *= -1;
            this.vWander.x *= -1;
        } else if (this.location.x > bounds.x2) {
            this.location.x = bounds.x2;
            this.velocity.x *= -1;
            this.vWander.x *= -1;
        }
        if (this.location.y < bounds.y1) {
            this.location.y = bounds.y1;
            this.velocity.y *= -1;
            this.vWander.y *= -1;
        } else if (this.location.y > bounds.y2) {
            this.location.y = bounds.y2;
            this.velocity.y *= -1;
            this.vWander.y *= -1;
            //this.velocity.multiply(0.5);
        }

    }

}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Agent;