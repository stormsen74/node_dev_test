/**
 * Created by STORMSEN on 01.12.2016.
 */

var PIXI = require('pixi.js');

import {Vector2} from './math/vector2';
import Agent from './particles/agent';

class Sim_02 extends PIXI.Container {

    constructor(_size) {
        super()

        this.agents = [];
        this.lines = new PIXI.Graphics();
        this.addChild(this.lines);


        this.vMouse = new Vector2();
        this.vMouse.pressed = false;

        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);


        document.addEventListener('mousedown', this.onPointerDown, false);
        document.addEventListener('touchstart', this.onPointerDown, false);

        document.addEventListener('mousemove', this.onPointerMove, false);
        document.addEventListener('touchmove', this.onPointerMove, false);


        // this.vMouse = new Vector2(_size.w * .5, _size.h * .5)

        // this.update();

        this.init();
    }

    init() {
        for (var i = 0; i <= Sim_02.MAX_PARTICLES; i++) {
            let agent = new Agent(new Vector2(Math.random() * 500, Math.random() * 500), .2 + Math.random() * .2)
            this.addChild(agent);
            this.agents.push(agent)
        }
    }

    onPointerDown(event) {
        this.vMouse.pressed = true;
        // this.mouse.charge = 1;
        // this.mouse.mass = 1;
    }

    onPointerMove(event) {
        const {clientX: x, clientY: y} = (
            event.changedTouches ? event.changedTouches[0] : event
        );

        this.vMouse.x = x - parseInt(document.getElementById('screen').style.left);
        this.vMouse.y = y - parseInt(document.getElementById('screen').style.top);
        if (!this.vMouse.pressed) {
            // this.mouse.mass = MOUSE_MASS_NORMAL;
        }
    }


    update() {

        this.lines.clear();

        this.agents.forEach(agent => {

            agent.seek(this.vMouse);
            agent.update();

            agent.tail.unshift({
                x: agent.position.x,
                y: agent.position.y
            });

            if (agent.tail.length > Sim_02.TAIL_LENGTH) {
                agent.tail.pop();
            }

            this.lines.lineStyle(1, 0xffffff);
            this.lines.moveTo(agent.position.x, agent.position.y);

            agent.tail.forEach((point, index) => {
                this.lines.lineTo(point.x, point.y);
            });

        });
    }


}

Sim_02.MAX_PARTICLES = 30;
Sim_02.TAIL_LENGTH = 15;


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sim_02;