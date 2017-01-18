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

class Sim_05 extends Sim {

    constructor(_size) {
        super()


        this.flowField = new FlowField(_size, FIELD_PARAMS.type.perlinField);
        this.flowField.updateDraw = true;
        this.addChild(this.flowField);

        //this.initAgents();
        this.update();

        //this.gui = new dat.GUI();
        //this.gui.add(FIELD_PARAMS, 'minSide').min(0).max(100).name('Min Side Length');
        //this.gui.add(FIELD_PARAMS, 'minAngle').min(0.0).max(1.2).step(0.01).name('Min Angle (rad)');
        //this.gui.add(FIELD_PARAMS, 'iterations').min(1).max(100).name('Iterations');
        //this.gui.add(FIELD_PARAMS, 'randomness').min(0.0).max(1.0).step(0.01).name('Randomness');
        //this.gui.add(FIELD_PARAMS, 'opposite').min(0.0).max(1.0).step(0.01).name('Opposite Sides');
        //this.gui.add(this, 'test').name('Start / Stop');
        //this.gui.close();

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

        this.flowField.update();

        // inherit
        if (this.vMouse.pressed) {
            this.flowField.modify();
        }


    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sim_05;