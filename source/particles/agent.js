/**
 * Created by STORMSEN on 24.11.2016.
 */

var PIXI = require('pixi.js');
import {Vector2} from './../math/vector2';
import Random from './../random'

import {DEFAULT_AGENT} from './../config';
import {COLORS} from './../config';
import {CLR} from './../config';
import mathUtils from '../utils/mathUtils';

class Agent extends PIXI.Container {
    constructor(_location, mass = .5) {
        super();

        this.SEEK_MAX_SPEED = 10;
        this.SEEK_MAX_FORCE = 1;
        this.FLEE_MAX_SPEED = 10;
        this.FLEE_MAX_FORCE = 1;
        this.FLEE_RADIUS = 400;
        this.VELOCITY_MIN = 0.05;
        this.VELOCITY_MAX = 15;
        this.TAIL_LENGTH = 20;


        this.mass = mass;
        this.location = new Vector2(_location.x, _location.y);
        this.velocity = new Vector2(.0001, .0001);
        this.acceleration = new Vector2();
        this.angle = 0;

        this.vecDesired = new Vector2();
        this.vecSteer = new Vector2();
        this.vecSteerSeperate = new Vector2();
        this.vecSumSeperate = new Vector2();
        this.vecForce = new Vector2();
        this.vecWander = new Vector2();

        this.position.x = _location.x;
        this.position.y = _location.y;

        this.tail = [];

        this.color = Random.item(COLORS);

        this.body = new PIXI.Graphics();
        this.body.alpha = .5;
        this.body.beginFill(this.color);
        let r = Math.ceil(this.mass) * 5;
        this.SEPERATE_RADIUS = 2 * r;
        this.body.drawCircle(0, 0, r);
        this.body.endFill();
        //this.body.cacheAsBitmap = true;

        this.vDebug = new PIXI.Graphics();
        this.vDebug.lineStyle(1, this.color);
        // this.vDebug.x += r;
        this.vDebug.moveTo(0, 0);
        this.vDebug.lineTo(30, 0);


        // this.body.blendMode = PIXI.BLEND_MODES.ADD;
        // this.addChild(this.body);
        // this.addChild(this.vDebug);

        //console.log(DEFAULT_AGENT)
    }


    seek(vTarget) {
        this.vecDesired = Vector2.subtract(vTarget, this.location).normalize().multiplyScalar(this.SEEK_MAX_SPEED);
        this.vecSteer = Vector2.subtract(this.vecDesired, this.velocity).clampLength(0, this.SEEK_MAX_FORCE);
        this.applyForce(this.vecSteer);
    }


    flee(vTarget) {
        this.vecDesired = Vector2.subtract(this.location, vTarget).normalize().multiplyScalar(this.FLEE_MAX_SPEED);
        this.vecForce = Math.max(1 - (Vector2.getDistance(this.location, vTarget) / this.FLEE_RADIUS), 0);
        this.vecSteer = Vector2.subtract(this.vecDesired, this.velocity).normalize().multiplyScalar(this.vecForce).clampLength(0, this.FLEE_MAX_FORCE);
        this.applyForce(this.vecSteer);
    }

    separate(agents) {
        this.vecSteerSeperate.multiplyScalar(0);
        this.vecSumSeperate.multiplyScalar(0);

        let count = 0, d, diff;
        agents.forEach(agent => {
            d = Vector2.getDistance(this.location, agent.location)
            if ((d > 0) && (d < this.SEPERATE_RADIUS)) {
                diff = Vector2.subtract(this.location, agent.location).normalize().divideScalar(d);
                this.vecSumSeperate.add(diff);
                count++;
            }
        });

        if (count > 0) {
            this.vecSumSeperate.divideScalar(count).normalize().multiplyScalar(1.5);
            this.vecSteerSeperate = Vector2.subtract(this.vecSumSeperate, this.velocity).clampLength(0, 10);
            this.applyForce(this.vecSteerSeperate);

        }

        //TODO getVector();
        // return _vecSteerSeparation;

    }

    wander(jX, jY, strength) {
        this.vecWander.jitter(jX, jY);
        this.vecWander.normalize().multiplyScalar(.15);
        this.applyForce(this.vecWander);
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
            this.vecWander.x *= -1;
        } else if (this.location.x > bounds.x2) {
            this.location.x = bounds.x2;
            this.velocity.x *= -1;
            this.vecWander.x *= -1;
        }
        if (this.location.y < bounds.y1) {
            this.location.y = bounds.y1;
            this.velocity.y *= -1;
            this.vecWander.y *= -1;
        } else if (this.location.y > bounds.y2) {
            this.location.y = bounds.y2;
            this.velocity.y *= -1;
            this.vecWander.y *= -1;
            //this.velocity.multiply(0.5);
        }

    }

}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Agent;