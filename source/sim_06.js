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

        this.vecRotation = new Vector2(_size.HEIGHT - 100, 0);

        this.pTarget = new Particle();
        this.addChild(this.pTarget);

        this.PARAMS = {
            SEEK_MAX_SPEED: 2,
            SEEK_MAX_FORCE: .3
        }

        this.driver = new Agent(this.vCenter, 1)

        this.addChild(this.driver)

        this.gfx = new PIXI.Graphics();
        this.gfx.lineStyle(1, 0xffffff, 1);
        this.addChild(this.gfx)

        this.update();


        this.gui = new dat.GUI();
        //this.CONFIG.INFO = '';
        //this.gui.add(this.CONFIG, 'INFO');
        this.gui.add(this.PARAMS, 'SEEK_MAX_SPEED').min(1).max(15).step(0.01).name('SEEK_MAX_SPEED').onChange(this.updateParams.bind(this));
        this.gui.add(this.PARAMS, 'SEEK_MAX_FORCE').min(.1).max(1).step(0.01).name('SEEK_MAX_FORCE').onChange(this.updateParams.bind(this));

    }

    updateParams() {
        this.driver.SEEK_MAX_SPEED = this.PARAMS.SEEK_MAX_SPEED;
        this.driver.SEEK_MAX_FORCE = this.PARAMS.SEEK_MAX_FORCE;
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


    reset() {
        this.driver.location.x = this.vCenter.x;
        this.driver.location.y = this.vCenter.y;
        this.gfx.moveTo(this.vCenter.x, this.vCenter.y);
        //this.gfx.clear();
    }


    update() {





        this.t += .05;

        this.vecRotation.toPolar();
        // phi
        this.vecRotation.y = .5 * Math.sin(this.t) - Math.PI * .5;
        // r
        // this.vecRotation.x = 100;
        this.vecRotation.toCartesian();


        this.pTarget.position.x = this.vCenter.x + this.vecRotation.x;
        this.pTarget.position.y = this.vCenter.y + this.vecRotation.y;


        this.gfx.moveTo(this.driver.position.x, this.driver.position.y);

        this.driver.seek(this.pTarget.position);
        this.driver.update();

        this.gfx.lineTo(this.driver.position.x, this.driver.position.y);


        if (Vector2.getDistance(this.driver.position, this.pTarget.position) <= 150) {
            this.reset();
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