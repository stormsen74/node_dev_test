/**
 * Created by STORMSEN on 01.12.2016.
 */

var PIXI = require('pixi.js');
var colormap = require('colormap')

import {Vector2} from './math/vector2';
import Agent from './particles/agent';
import Sim from './sim';

import Random from './utils/random'

import { SIM_DEFAULT } from './config';
import { CLR } from './config';

class Sim_03 extends Sim {

    constructor(_size) {
        super()

        this.size = _size;


        this.agents = [];
        this.lines = new PIXI.Graphics();
        this.lines.blendMode = PIXI.BLEND_MODES.ADD;
        this.addChild(this.lines);

        //https://www.npmjs.com/package/colormap
        //let options = {
        //    colormap: 'copper',   // pick a builtin colormap or add your own
        //    nshades: 30,       // how many divisions
        //    format: 'hex',     // "hex" or "rgb" or "rgbaString"
        //    alpha: 1           // set an alpha value or a linear alpha mapping [start, end]
        //}
        //var PALETTE = colormap(options);
        //for (var i = 0; i < PALETTE.length; i++) {
        //    PALETTE[i] = this.hexStringToNumber(PALETTE[i])
        //    console.log(PALETTE)
        //}


        this.init();
        this.update();
    }

    hexStringToNumber(string) {
        return parseInt(string.substring(1), 16);
    }

    init() {
        console.log('i:')
        for (var i = 0; i <= SIM_DEFAULT.MAX_PARTICLES; i++) {
            let agent = new Agent(new Vector2(Random() * this.size.WIDTH, Random() * this.size.HEIGHT), .2 + Random() * .2)
            this.addChild(agent);
            this.agents.push(agent);
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

                if (agent.tail.length > agent.TAIL_LENGTH) {
                    agent.tail.pop();
                }

                //console.log(agent.color)
                this.lines.lineStyle(1, agent.color);
                this.lines.moveTo(agent.position.x, agent.position.y);

                agent.tail.forEach((point, index) => {
                    this.lines.lineTo(point.x, point.y);
                });

            });
        }

    }


}

//Sim_03.MAX_PARTICLES = 100;
//Sim_03.TAIL_LENGTH = 10;


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sim_03;