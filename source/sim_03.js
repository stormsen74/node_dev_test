/**
 * Created by STORMSEN on 01.12.2016.
 */

var PIXI = require('pixi.js');
var colormap = require('colormap')

import {Vector2} from './math/vector2';
import Random from './utils/random'
import Agent from './particles/agent';
import Sim from './sim';
import Bounds from './particles/bounds';

class Sim_03 extends Sim {

    constructor(_size) {
        super()

        this.size = _size;

        this.WANDER_PARAMS = {
            RADIUS: 50,
            DELTA_T: .1,
            ANGLE_DIRECTION: -90,
            ANGLE_RANGE: 45,
            SEEK_MAX_SPEED: 5,
            SEEK_MAX_FORCE: .1,
            DEBUG: false
        }

        this.simulation = true;

        this.NUM_AGENTS = 32;
        this.agents = [];
        this.colors = []

        this.blurFilter = new PIXI.filters.BlurFilter(1, 3)

        this.lines = new PIXI.Graphics();
        // this.lines.blendMode = PIXI.BLEND_MODES.ADD;
        this.addChild(this.lines);
        // this.lines.filters = [this.blurFilter]

        //this.LINE_STYLE = {
        //    lineWidth: 1,
        //    lineColor: 0xffffff
        //}

        this.bounds = new Bounds(0, 0, this.size.WIDTH, this.size.HEIGHT);
        this.vFriction = new Vector2();

        //https://www.npmjs.com/package/colormap
        let options = {
            colormap: 'portland',   // pick a builtin colormap or add your own
            nshades: 32,       // how many divisions
            format: 'hex',     // "hex" or "rgb" or "rgbaString"
            alpha: 1           // set an alpha value or a linear alpha mapping [start, end]
        }
        this.PALETTE = colormap(options);
        for (var i = 0; i < this.PALETTE.length; i++) {
            this.PALETTE[i] = this.hexStringToNumber(this.PALETTE[i])
        }
        console.log(this.PALETTE)


        this.initAgents();
        this.initDAT();
        this.update();
    }

    hexStringToNumber(string) {
        return parseInt(string.substring(1), 16);
    }

    numberToHex(number) {
        return number.toString(16);
    }

    initDAT() {
        this.gui = new dat.GUI();

        this.gui.add(this.WANDER_PARAMS, 'DELTA_T').min(.001).max(.5).step(.001).name('DELTA_T').onChange(this.updateParams.bind(this));
        this.gui.add(this.WANDER_PARAMS, 'RADIUS').min(1).max(500).step(1).name('RADIUS').onChange(this.updateParams.bind(this));
        this.gui.add(this.WANDER_PARAMS, 'ANGLE_DIRECTION').min(-180).max(180).step(1).name('ANGLE_DIRECTION').onChange(this.updateParams.bind(this));
        this.gui.add(this.WANDER_PARAMS, 'ANGLE_RANGE').min(0).max(360).step(1).name('ANGLE_RANGE').onChange(this.updateParams.bind(this));

        this.gui.add(this.WANDER_PARAMS, 'SEEK_MAX_SPEED').min(1).max(12).step(.01).name('SEEK_MAX_SPEED').onChange(this.updateParams.bind(this));
        this.gui.add(this.WANDER_PARAMS, 'SEEK_MAX_FORCE').min(0).max(1).step(.01).name('SEEK_MAX_FORCE').onChange(this.updateParams.bind(this));

        this.gui.add(this.WANDER_PARAMS, 'DEBUG').name('DEBUG').onChange(this.updateParams.bind(this));

        this.gui.add(this, 'toggleRun').name('play/pause');
        //this.gui.add(this, 'reset').name('reset');
    }

    toggleRun() {
        if (this.simulation) {
            this.simulation = false;
        } else {
            this.simulation = true;
        }
    }

    updateParams() {

        this.agents.forEach(agent => {
            agent.WANDER_PARAMS.DELTA_T = this.WANDER_PARAMS.DELTA_T;
            agent.WANDER_PARAMS.RADIUS = this.WANDER_PARAMS.RADIUS;
            agent.WANDER_PARAMS.ANGLE_DIRECTION = this.WANDER_PARAMS.ANGLE_DIRECTION;
            agent.WANDER_PARAMS.ANGLE_RANGE = this.WANDER_PARAMS.ANGLE_RANGE;

            agent.SEEK_MAX_SPEED = this.WANDER_PARAMS.SEEK_MAX_SPEED;
            agent.SEEK_MAX_FORCE = this.WANDER_PARAMS.SEEK_MAX_FORCE;

            agent.toggleDebugMode(this.WANDER_PARAMS.DEBUG);
        });

    }


    initAgents() {
        for (var i = 0; i < this.NUM_AGENTS; i++) {
            //let agent = new Agent(new Vector2(Random() * this.size.WIDTH, Random() * this.size.HEIGHT), .2 + Random() * .2);
            let agent = new Agent(new Vector2(this.size.WIDTH / this.NUM_AGENTS * i, this.size.HEIGHT), .2 + Random() * .2);
            agent.toggleDebugMode(this.WANDER_PARAMS.DEBUG);
            agent.color = Random.item(this.PALETTE);
            this.colors[i] = this.PALETTE[i];
            //this.LINE_STYLE.lineColor = agent.color;
            agent.TAIL_LENGTH = 15;
            this.addChild(agent);
            this.agents.push(agent);
        }

        console.log(this.colors)
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

        if (this.simulation) {
            this.lines.clear();

            this.agents.forEach((agent, index) => {

                // agent.seek(this.vMouse);
                // this.vFriction.set(agent.velocity.x, agent.velocity.y).multiplyScalar(-1).normalize().multiplyScalar(.3);
                // agent.applyForce(this.vFriction);
                agent.update();
                agent.circleWander();

                agent.wrap(this.bounds);

                //return

                agent.tail.unshift({
                    x: agent.position.x,
                    y: agent.position.y
                });

                if (agent.tail.length > agent.TAIL_LENGTH) {
                    agent.tail.pop();
                }

                //console.log(agent.color)
                this.lines.lineStyle(agent.r, this.colors[index]);
                this.lines.lineStyle(agent.r, this.colors[index]);
                this.lines.moveTo(agent.position.x, agent.position.y);

                agent.tail.forEach((point, index) => {
                    this.lines.lineTo(point.x, point.y);
                });


                if (
                    agent.position.x < this.bounds.x1 ||
                    agent.position.x > this.bounds.x2 ||
                    agent.position.y < this.bounds.y1 ||
                    agent.position.y > this.bounds.y2
                ) {
                    agent.tail = [];
                    this.lines.clear();
                }

            });
        }


    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sim_03;