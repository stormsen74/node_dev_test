/**
 * Created by STORMSEN on 04.12.2016.
 */

var PIXI = require('pixi.js');

import {SIM_DEFAULT} from '../config';
import {DEFAULT_AGENT} from '../config';
import {INPUT_DATA} from '../config';
import Agent from '../particles/agent';
import Bounds from '../particles/bounds';
import mathUtils from '../utils/mathUtils';
import {Vector2} from '../math/vector2';
import Random from '../utils/random'

class ParticleSystem extends PIXI.Container {

    constructor(_size, _origin) {
        super()

        this.particles = [];
        this.size = _size;
        this.origin = _origin;
        this.bounds = new Bounds(0, 0, this.size.WIDTH, this.size.HEIGHT);

        this.vFriction = new Vector2();


        this.gfx = new PIXI.Graphics();
        //this.gfx.blendMode = PIXI.BLEND_MODES.ADD;
        this.addChild(this.gfx);

        //this.init();

        console.log(mathUtils.getRandomBetween())
        console.log(mathUtils.getRandomBetween())
    }


    addParticle(_location, _mass) {
        if (_location === undefined) _location = this.origin;
        let agent = new Agent(_location, _mass);
        //agent.acceleration.set(Random.sign() * 3, Random.sign() * 3)
        this.addChild(agent);
        this.particles.push(agent);
    }

    //TODO
    applyBehavior() {

    }

    applyFriction(strength) {
        this.particles.forEach(agent => {
            this.vFriction.set(agent.velocity.x, agent.velocity.y).multiplyScalar(-1).normalize().multiplyScalar(strength);
            agent.applyForce(this.vFriction);
        });
    }

    applyForce(f) {
        this.particles.forEach(agent => {
            agent.applyForce(f);
        });
    }

    applyRepeller(r) {
        this.particles.forEach(agent => {
            let f = r.repel(agent);
            agent.applyForce(f);
        });
    }

    applyAttractor(a) {
        this.particles.forEach(agent => {
            let f = a.attract(agent);
            agent.applyForce(f);
        });
    }

    seek(vTarget) {
        this.particles.forEach(agent => {
            agent.seek(vTarget);
        });
    }

    flee(vTarget) {
        this.particles.forEach(agent => {
            agent.flee(vTarget);
        });
    }

    separate() {
        this.particles.forEach(agent => {
            agent.separate(this.particles);
        });
    }

    wander(jX, jY, maxLength) {
        this.particles.forEach(agent => {
            agent.wander(jX, jY, maxLength);
        });
    }

    applyField(field) {
        this.particles.forEach(agent => {
            agent.applyField(field);
        });
    }


    drawTail() {
        this.gfx.clear();

        this.particles.forEach(agent => {


            agent.tail.unshift({
                x: agent.position.x,
                y: agent.position.y
            });

            if (agent.tail.length > agent.TAIL_LENGTH) {
                agent.tail.pop();
            }

            // case wrap bounds!  TODO
            if (agent.position.x < this.bounds.x1 || agent.position.x > this.bounds.x2) {
                agent.tail = []
            }

            if (agent.position.y < this.bounds.y1 || agent.position.y > this.bounds.y2) {
                agent.tail = []
            }
            // case wrap bounds!  TODO

            this.gfx.lineStyle(1, agent.color);
            this.gfx.moveTo(agent.position.x, agent.position.y);

            agent.tail.forEach((point, index) => {
                this.gfx.lineTo(point.x, point.y);
            });
        })

    }

    update() {


        this.particles.forEach(agent => {

            agent.wrap(this.bounds);

            agent.update();

        });
    }


}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default ParticleSystem;