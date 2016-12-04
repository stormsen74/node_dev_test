/**
 * Created by STORMSEN on 01.12.2016.
 */

var PIXI = require('pixi.js');

import {Vector2} from './math/vector2';
import Agent from './particles/agent';

class Sim extends PIXI.Container {

    constructor(_size) {
        super()

        this.vMouse = new Vector2();
        this.vMouse.pressed = false;

        this.initListener();

    }

    initListener() {

        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);


        document.addEventListener('mousedown', this.onPointerDown, false);
        document.addEventListener('touchstart', this.onPointerDown, false);

        document.addEventListener('mouseup', this.onPointerUp, false);
        document.addEventListener('touchend', this.onPointerUp, false);

        document.addEventListener('mousemove', this.onPointerMove, false);
        document.addEventListener('touchmove', this.onPointerMove, false);
    }

    init() {

    }

    onPointerDown(event) {
        this.vMouse.pressed = true;
    }

    onPointerUp(event) {
        this.vMouse.pressed = false;
    }

    onPointerMove(event) {
        //const {clientX: x, clientY: y} = (
        //    event.changedTouches ? event.changedTouches[0] : event
        //);
    }


    update() {
        if (this.vMouse.pressed) {
            //console.log(this.vMouse)
        }


    }


}

Sim.PARAMETERS = {};


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sim;