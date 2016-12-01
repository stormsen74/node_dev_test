/**
 * Created by STORMSEN on 01.12.2016.
 */

var PIXI = require('pixi.js');

import {Vector2} from './vector2';
import Agent from './agent';
import Sim from './sim';

class Sim_03 extends Sim {

    constructor(_size) {
        super()

        this.agents = [];
        this.lines = new PIXI.Graphics();
        this.addChild(this.lines);


        this.init();

        this.update();
    }

    init() {
        console.log('i:')
        for (var i = 0; i <= Sim_03.MAX_PARTICLES; i++) {
            let agent = new Agent(Math.random() * 500, Math.random() * 500, .2 + Math.random() * .2)
            Agent.SEEK_MAX_FORCE = .1;
            this.addChild(agent);
            this.agents.push(agent)
        }
    }

    onPointerMove(event) {
        const {clientX: x, clientY: y} = (
            event.changedTouches ? event.changedTouches[0] : event
        );
        this.vMouse.x = x - parseInt(document.getElementById('screen').style.left);
        this.vMouse.y = y - parseInt(document.getElementById('screen').style.top);

        //console.log(this.vMouse)
    }


    update() {

        // inherit
        if (!this.vMouse.pressed) {

            this.lines.clear();

            this.agents.forEach(agent => {

                agent.seek(this.vMouse);
                agent.update();

                agent.tail.unshift({
                    x: agent.position.x,
                    y: agent.position.y
                });

                if (agent.tail.length > Sim_03.TAIL_LENGTH) {
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


}

Sim_03.MAX_PARTICLES = 100;
Sim_03.TAIL_LENGTH = 10;


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sim_03;