/**
 * Created by STORMSEN on 24.11.2016.
 */

var PIXI = require('pixi.js');
var SimplexNoise = require('simplex-noise');

import {Vector2} from './../math/vector2';
import Random from '../utils/random'

import {DEFAULT_AGENT} from './../config';
import {COLORS} from './../config';
import {CLR} from './../config';
import mathUtils from '../utils/mathUtils';

class Agent extends PIXI.Container {
    constructor(_location, mass) {
        super();

        this.SEEK_MAX_SPEED = 2;
        this.SEEK_MAX_FORCE = 0.1;
        this.FLEE_MAX_SPEED = 15;
        this.FLEE_MAX_FORCE = .5;
        this.FLEE_RADIUS = 150;
        this.VELOCITY_MIN = 0.05;
        this.VELOCITY_MAX = 10;
        this.TAIL_LENGTH = 20;
        this.LIFESPAN = 150;


        this.WANDER_DISTANCE = 100;
        this.WANDER_RADIUS = 50;
        this.T = 0;
        this.SIMPLEX = new SimplexNoise();


        this.mass = mass;
        this.location = new Vector2(_location.x, _location.y);
        this.velocity = new Vector2(.1 + Random() * .1, .1 + Random() * .1);
        this.acceleration = new Vector2(.1 + Random() * .1, .1 + Random() * .1);
        this.angle = 0;

        this.vecDesired = new Vector2();
        this.vecSteer = new Vector2();
        this.vecSumSeperate = new Vector2();
        this.vecForce = new Vector2();
        this.vecJitter = new Vector2();
        this.wandertheta = 0;
        this.vecWanderPosition = new Vector2(this.WANDER_RADIUS, 0);
        this.vecWanderTarget = new Vector2();

        this.position.x = _location.x;
        this.position.y = _location.y;

        this.tail = [];

        this.color = Random.item(COLORS.VENUS);

        this.body = new PIXI.Graphics();
        this.body.alpha = .5;
        this.body.beginFill(this.color);
        //this.body.beginFill(0x00cc00);
        let r = Math.ceil(this.mass) * 5;
        this.SEPERATE_RADIUS = 2 * r;
        this.body.drawCircle(0, 0, r);
        this.body.endFill();
        //this.body.cacheAsBitmap = true;

        this.vDebug = new PIXI.Graphics();
        // this.vDebug.lineStyle(1, this.color);
        this.vDebug.lineStyle(1, 0x00cc00);
        // this.vDebug.x += r;

        this.vDebug.moveTo(0, 0);
        this.vDebug.lineTo(5 * r, 0);


        this.vDebugWander = new PIXI.Graphics();
        this.vDebugWander.lineStyle(1, 0xffffff);


        this.addChild(this.body);
        this.addChild(this.vDebug);
        this.addChild(this.vDebugWander);
        //this.body.blendMode = PIXI.BLEND_MODES.ADD;

        //console.log(DEFAULT_AGENT)

    }


    seek(vTarget) {
        this.vecDesired = Vector2.subtract(vTarget, this.location).normalize().multiplyScalar(this.SEEK_MAX_SPEED);
        this.vecSteer = Vector2.subtract(this.vecDesired, this.velocity).clampLength(0, this.SEEK_MAX_FORCE);

        this.applyForce(this.vecSteer);
    }


    flee(vTarget) {
        this.vecDesired = Vector2.subtract(this.location, vTarget).normalize().multiplyScalar(this.FLEE_MAX_SPEED);
        let force = Math.max(1 - (Vector2.getDistance(this.location, vTarget) / this.FLEE_RADIUS), 0);
        this.vecSteer = Vector2.subtract(this.vecDesired, this.velocity).normalize().multiplyScalar(force).clampLength(0, this.FLEE_MAX_FORCE);

        //console.log('do!', Vector2.getDistance(vTarget, this.position))

        if (Vector2.getDistance(vTarget, this.position) < this.FLEE_RADIUS) {
            this.applyForce(this.vecSteer);
        } else {
            this.seek(vTarget)
        }
    }

    separate(agents) {
        this.vecSteer.multiplyScalar(0);
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
            this.vecSteer = Vector2.subtract(this.vecSumSeperate, this.velocity).clampLength(0, 10);

            this.applyForce(this.vecSteer);
        }

        //TODO getVector();
        // return _vecSteerSeparation;

    }

    wander() {
        this.T += .01

        this.vecWanderPosition.toPolar().setY(mathUtils.convertToRange(this.SIMPLEX.noise2D(this.T, 0), [-1, 1], [mathUtils.degToRad(-180), mathUtils.degToRad(180)]));
        this.vecWanderPosition.toCartesian();

        // this.vecWanderTarget.x = this.location.x + this.vecWanderPosition.x;
        // this.vecWanderTarget.y = this.location.y + this.vecWanderPosition.y;

        this.vecWanderTarget = Vector2.add(this.location, this.vecWanderPosition);


        this.seek(this.vecWanderTarget);

        // circle
        this.vDebugWander.clear()
        this.vDebugWander.lineStyle(1, 0xffffff);
        this.vDebugWander.drawCircle(0, 0, this.WANDER_RADIUS)

        // target
        this.vDebugWander.lineStyle(1, 0xff0000);
        this.vDebugWander.moveTo(0, 0)
        this.vDebugWander.lineTo(this.vecWanderPosition.x, this.vecWanderPosition.y)
    }

    jitter(jX, jY) {
        this.vecJitter.jitter(jX, jY);
        this.vecJitter.normalize().multiplyScalar(this.SEEK_MAX_FORCE);

        this.applyForce(this.vecJitter);
    }

    applyField(field) {
        //flowField.lookup(this.location);

        // this.vecDesired = field.lookup(this.location);
        // this.vecDesired = Vector2.subtract(field.lookup(this.location), this.location).normalize().multiplyScalar(this.SEEK_MAX_SPEED);
        this.vecSteer = Vector2.subtract(field.lookup(this.location), this.velocity).clampLength(0, this.SEEK_MAX_FORCE);

        // limit the magnitude of the steering force.
        //this.limitMax(this.vSteer, this.SEEK_MAX_FORCE);

        // apply the steering force
        this.applyForce(this.vecSteer);

        //TODO getVector();
        // return _vecSteer;

    }

    /*------------------------------------------------
     apply force
     -------------------------------------------------*/

    applyForce(vForce) {
        this.vecForce = Vector2.divide(vForce, this.mass);
        this.acceleration.add(this.vecForce);
    }


    isDead() {
        return this.LIFESPAN <= 0 ? true : false;
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


        this.LIFESPAN -= 1;
        //console.log(this.LIFESPAN)


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
            this.vecJitter.x *= -1;
        } else if (this.location.x > bounds.x2) {
            this.location.x = bounds.x2;
            this.velocity.x *= -1;
            this.vecJitter.x *= -1;
        }
        if (this.location.y < bounds.y1) {
            this.location.y = bounds.y1;
            this.velocity.y *= -1;
            this.vecJitter.y *= -1;
        } else if (this.location.y > bounds.y2) {
            this.location.y = bounds.y2;
            this.velocity.y *= -1;
            this.vecJitter.y *= -1;
            //this.velocity.multiply(0.5);
        }

    }

}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Agent;