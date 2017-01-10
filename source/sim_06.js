/**
 * Created by STORMSEN on 01.12.2016.
 */

var gsap = require('gsap')
var SimplexNoise = require('simplex-noise')

import {Vector2} from './math/vector2';
import Agent from './particles/agent';
import ParticleSystem from './particles/pSystem';
import Repeller from './particles/repeller';
import FlowField from './particles/flowField';
import mathUtils from './utils/mathUtils';
import Sim from './sim';
import Random from './utils/random'

import {SIM_DEFAULT} from './config';
import {INPUT_DATA} from './config';
import {FIELD_PARAMS} from './config';
import Particle from './particles/particle';

class Sim_06 extends Sim {

    constructor(_size) {
        super()


        //this.init();

        this.t = 0;
        this.vCenter = new Vector2(_size.WIDTH * .5, _size.HEIGHT - 50);
        this.vPosition = new Vector2(_size.HEIGHT - 100, 0);
        this.particle = new Particle();
        this.addChild(this.particle);


        this.driver = new Agent(this.vCenter, 1)
        this.driver.SEEK_MAX_SPEED = 2;
        this.driver.SEEK_MAX_FORCE = 0.3;
        this.addChild(this.driver)

        this.gfx = new PIXI.Graphics();
        this.gfx.lineStyle(1, 0xffffff, 1);
        this.addChild(this.gfx)

        this.update();

        // this.addChild(this.target)

        this.draw = true;
        this.update();

    }


    test() {
        //console.log('call', 5, FIELD_PARAMS.minSide);
    }


    onStartDrag() {
        this.vMouse.emit = false;
    }

    onStopDrag() {
        this.vMouse.emit = true;
    }

    onPointerDown(event) {
        this.vMouse.pressed = true;
    }

    onPointerUp(event) {
        this.vMouse.pressed = false;
    }


    onPointerMove(event) {
        const {clientX: x, clientY: y} = (
            event.changedTouches ? event.changedTouches[0] : event
        );
        this.vMouse.x = x - parseInt(document.getElementById('screen').style.left);
        this.vMouse.y = y - parseInt(document.getElementById('screen').style.top);

        INPUT_DATA.POINTER_LOCATION.set(this.vMouse.x, this.vMouse.y)


        if (this.vMouse.pressed) {
        }

        //console.log(this.vMouse)
    }


    update() {


        this.t += .05;

        this.vPosition.toPolar();
        // phi
        this.vPosition.y = .5 * Math.sin(this.t) - Math.PI * .5;
        this.vPosition.jitter(0, .1)
        // r
        // this.vPosition.x = 100;

        this.vPosition.toCartesian();


        this.particle.position.x = this.vCenter.x + this.vPosition.x;
        this.particle.position.y = this.vCenter.y + this.vPosition.y;

        if (Vector2.getDistance(this.driver.position, this.particle.position) > 150 && this.draw) {

            this.gfx.moveTo(this.driver.position.x, this.driver.position.y);

            this.driver.seek(this.particle.position);
            this.driver.update();

            this.gfx.lineTo(this.driver.position.x, this.driver.position.y);

        } else {

            this.draw = false

        }


        // inherit
        if (this.vMouse.pressed) {
        }


    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sim_06;