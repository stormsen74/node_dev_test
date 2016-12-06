/**
 * Created by STORMSEN on 04.12.2016.
 */

var PIXI = require('pixi.js');

import { SIM_DEFAULT } from '../config';
import { DEFAULT_AGENT } from '../config';
import { INPUT_DATA } from '../config';
import Agent from '../particles/agent';
import Bounds from '../particles/bounds';
import mathUtils from '../math/mathUtils';
import {Vector2} from '../math/vector2';
import Random from '../random'

class ParticleSystem extends PIXI.Container {

    constructor(_size, _origin) {
        super()

        this.particles = [];
        this.size = _size;
        this.origin = _origin;
        this.bounds = new Bounds(0, 0, _size.WIDTH, _size.HEIGHT);


        this.lines = new PIXI.Graphics();
        this.lines.blendMode = PIXI.BLEND_MODES.ADD;
        this.addChild(this.lines);

        //this.init();

        console.log(mathUtils.getRandomBetween())
        console.log(mathUtils.getRandomBetween())
    }

    //init() {
    //    for (var i = 0; i <= 10; i++) {
    //
    //    }
    //}

    addParticle(_location, _mass) {
        let agent = new Agent(_location, _mass);
        this.addChild(agent);
        this.particles.push(agent);
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


    applyTest() {
        this.particles.forEach(agent => {
            this.particles.forEach(_agent => {
                let f = a.attract(_agent);
                agent.applyForce(f);
            })
        });
    }

    seek(vTarget) {
        this.particles.forEach(agent => {
            let vecDesired = Vector2.subtract(vTarget, agent.location).normalize().multiplyScalar(DEFAULT_AGENT.SEEK_MAX_SPEED);
            let vSteer = Vector2.subtract(vecDesired, agent.velocity);
            vSteer.clampLength(0, DEFAULT_AGENT.SEEK_MAX_FORCE);

            agent.applyForce(vSteer);
        });
    }

    update() {

        this.lines.clear();

        this.particles.forEach(agent => {

            //agent.wander();

            agent.update();

            // extend
            agent.tail.unshift({
                x: agent.position.x,
                y: agent.position.y
            });

            if (agent.tail.length > agent.TAIL_LENGTH) {
                agent.tail.pop();
            }

            //console.log(agent.color)
            this.lines.lineStyle(1, agent.color);
            this.lines.moveTo(agent.position.x, agent.position.y);

            agent.tail.forEach((point, index) => {
                this.lines.lineTo(point.x, point.y);
            });

            // bounds
            agent.bounce(this.bounds);


        });
    }


}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default ParticleSystem;