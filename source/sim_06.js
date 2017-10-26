/**
 * Created by STORMSEN on 01.12.2016.
 */

var gsap = require('gsap')
var SimplexNoise = require('simplex-noise')

import {Vector2} from './math/vector2';
import Agent from './particles/agent';
import mathUtils from './utils/mathUtils';
import Sim from './sim';
import Random from './utils/random'

import {INPUT_DATA} from './config';
import Particle from './particles/particle';

class Sim_06 extends Sim {

    constructor(_size) {
        super()

        // TODO / IDEAS
        /*------------------------------------------------
         - circle radius ... (dat)
         - render style (shadowing) / cubic curve
         - emit particles (lines) on growth / draw lines etc. at grow
         - filters on gfx
         - colors
         -------------------------------------------------*/


        //this.initAgents();
        this.size = _size;

        this.t = 0;
        this.circleRadius = this.size.HEIGHT - 100;
        this.simulation = true;
        this.debugMode = true;

        this.waypoints = [];
        this.numWaypoints = 5;


        this.PARAMS = {
            SEEK_MAX_SPEED: 7.75,
            SEEK_MAX_FORCE: .3,
            LIFESPAN: 100,
            TIME_STEP: .01,
            CIRCLE_RADIUS: 620,
            PERLIN_START_ANGLE: -90,
            PERLIN_RANGE: 45,
            ANGLE: {
                MIN: 0,
                MAX: 0
            }
        }

        for (var i = 0; i <= this.numWaypoints; i++) {
            this.waypoints[i] =
            {
                t: i * this.PARAMS.LIFESPAN / this.numWaypoints,
                locator: new Vector2()
            }
        }

        console.log(this.waypoints);

        this.vCenter = new Vector2(this.size.WIDTH * .5, this.size.HEIGHT);

        // vecWanderTheta
        this.vecWanderTheta = new Vector2(0, this.circleRadius).toPolar().setY(mathUtils.degToRad(this.PARAMS.PERLIN_START_ANGLE));
        this.vecWanderTheta.toCartesian();

        // vecTarget
        this.vecTarget = new Vector2(0, this.circleRadius).toPolar().setY(mathUtils.degToRad(this.PARAMS.PERLIN_START_ANGLE));
        this.vecTarget.toCartesian();

        // pTarget
        this.pTarget = new Particle();
        this.pTarget.alpha = .4;
        this.pTarget.position.x = this.vCenter.x + this.vecWanderTheta.x;
        this.pTarget.position.y = this.vCenter.y + this.vecWanderTheta.y;


        this.driver = new Agent(this.vCenter, 1);


        this.gfx = new PIXI.Graphics();
        this.gfx.lineStyle(1, 0xffffff, 1);


        this.debugMode_gfx = new PIXI.Graphics();


        if (this.debugMode) {
            this.addChild(this.driver)
            this.addChild(this.pTarget);
            this.addChild(this.debugMode_gfx);
        }
        this.addChild(this.gfx);


        this.SIMPLEX = new SimplexNoise();

        this.initDAT();

        this.updateParams();

    }

    initDAT() {
        this.gui = new dat.GUI();
        //this.CONFIG.INFO = '';
        //this.gui.add(this.CONFIG, 'INFO');
        this.gui.add(this.PARAMS, 'SEEK_MAX_SPEED').min(1).max(15).step(0.01).name('SEEK_MAX_SPEED').onChange(this.updateParams.bind(this));
        this.gui.add(this.PARAMS, 'SEEK_MAX_FORCE').min(.1).max(1).step(0.01).name('SEEK_MAX_FORCE').onChange(this.updateParams.bind(this));
        this.gui.add(this.PARAMS, 'LIFESPAN').min(50).max(400).step(0.01).name('LIFESPAN');
        this.gui.add(this.PARAMS, 'TIME_STEP').min(.001).max(.3).step(0.01).name('TIME_STEP');
        this.gui.add(this, 'toggleRun').name('play/pause');
        this.gui.add(this, 'reset').name('reset');

        var f1 = this.gui.addFolder('perlin-based target');
        f1.add(this.PARAMS, 'PERLIN_START_ANGLE').min(-180).max(0).step(0.01).name('PERLIN_START_ANGLE').onChange(this.updateParams.bind(this));
        f1.add(this.PARAMS, 'PERLIN_RANGE').min(0).max(90).step(0.01).name('PERLIN_RANGE').onChange(this.updateParams.bind(this));
        f1.open();
    }

    toggleRun() {
        if (this.simulation) {
            this.simulation = false;
        } else {
            this.simulation = true;
        }
    }

    updateParams() {
        this.driver.SEEK_MAX_SPEED = this.PARAMS.SEEK_MAX_SPEED;
        this.driver.SEEK_MAX_FORCE = this.PARAMS.SEEK_MAX_FORCE;

        this.PARAMS.ANGLE.MIN = mathUtils.degToRad(this.PARAMS.PERLIN_START_ANGLE - this.PARAMS.PERLIN_RANGE);
        this.PARAMS.ANGLE.MAX = mathUtils.degToRad(this.PARAMS.PERLIN_START_ANGLE + this.PARAMS.PERLIN_RANGE);

        this.vecTarget.toPolar();
        this.vecTarget.y = mathUtils.degToRad(this.PARAMS.PERLIN_START_ANGLE);
        this.vecTarget.toCartesian();

        this.driver.LIFESPAN = this.PARAMS.LIFESPAN;
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
        console.log('reset')

        this.gfx.clear();
        this.gfx.lineStyle(1, 0xffffff, 1);
        this.driver.location.x = this.vCenter.x;
        this.driver.location.y = this.vCenter.y;
        this.gfx.moveTo(this.vCenter.x, this.vCenter.y);

        this.driver.LIFESPAN = this.PARAMS.LIFESPAN;


        for (var i = 0; i <= this.numWaypoints; i++) {
            this.waypoints[i] =
            {
                t: i * this.PARAMS.LIFESPAN / this.numWaypoints,
                locator: new Vector2()
            }
        }

    }

    plotPoint(v) {
        this.gfx.lineStyle(1, 0xffc515, .5);
        this.gfx.drawCircle(v.x, v.y, 10)
        console.log('plot', v)
    }


    update() {

        if (this.simulation) {
            this.t += this.PARAMS.TIME_STEP;


            if (this.driver.isDead()) {
                // last waypoint
                this.waypoints[this.waypoints.length - 1].locator.x = this.driver.location.x;
                this.waypoints[this.waypoints.length - 1].locator.y = this.driver.location.y;
                this.plotPoint(this.driver.location);

                this.reset();
            }

            /*------------------------------------------------
             perlin-based target
             -------------------------------------------------*/

            this.vecWanderTheta.toPolar().setY(mathUtils.convertToRange(this.SIMPLEX.noise2D(this.t, 0), [-1, 1], [this.PARAMS.ANGLE.MIN, this.PARAMS.ANGLE.MAX]));
            this.vecWanderTheta.toCartesian();

            /*------------------------------------------------
             sin-based target
             -------------------------------------------------*/

            //this.vecWanderTheta.toPolar().setY(1 * Math.sin(5 * this.t) - Math.PI * .5)
            //this.vecWanderTheta.toCartesian();

            /*------------------------------------------------
             update position
             -------------------------------------------------*/

            this.pTarget.position.x = this.vCenter.x + this.vecWanderTheta.x;
            this.pTarget.position.y = this.vCenter.y + this.vecWanderTheta.y;

            for (var i = 0; i < this.waypoints.length; i++) {
                if (this.driver.LIFESPAN == this.waypoints[i].t && this.waypoints[i].locator.x == 0) {
                    this.waypoints[i].locator.x = this.driver.location.x;
                    this.waypoints[i].locator.y = this.driver.location.y;

                    this.plotPoint(this.driver.location);
                }
            }

            // TODO Lifecycle
            var p = mathUtils.convertToRange(this.driver.LIFESPAN, [0, this.PARAMS.LIFESPAN], [0, 1])
            this.gfx.lineStyle(1, 0x00ccff, 1);
            this.gfx.moveTo(this.driver.location.x, this.driver.location.y);
            this.driver.seek(this.pTarget.position);
            this.driver.update();
            this.gfx.lineTo(this.driver.location.x, this.driver.location.y);


            /*------------------------------------------------
             debugMode
             -------------------------------------------------*/

            if (this.debugMode) {
                this.debugMode_gfx.clear();

                this.debugMode_gfx.lineStyle(1, 0x00ff33, .4);
                this.debugMode_gfx.drawCircle(this.vCenter.x, this.vCenter.y, this.circleRadius);

                //this.debugMode_gfx.moveTo(this.vCenter.x, this.vCenter.y);
                //this.debugMode_gfx.lineTo(this.vCenter.x + this.vecWanderTheta.x, this.vCenter.y + this.vecWanderTheta.y);

                this.debugMode_gfx.lineStyle(1, 0xcccccc, .4);
                this.debugMode_gfx.moveTo(this.vCenter.x, this.vCenter.y);
                this.debugMode_gfx.lineTo(this.vCenter.x + this.vecTarget.x, this.vCenter.y + this.vecTarget.y);

                this.debugMode_gfx.lineStyle(1, 0x00ff33, .2);

                //l
                this.debugMode_gfx.moveTo(this.vCenter.x, this.vCenter.y);
                var pLeft = this.vecTarget.clone();
                pLeft.toPolar().y = mathUtils.degToRad(this.PARAMS.PERLIN_START_ANGLE - this.PARAMS.PERLIN_RANGE);
                pLeft.toCartesian();

                this.debugMode_gfx.lineTo(this.vCenter.x + pLeft.x, this.vCenter.y + pLeft.y);

                //r
                this.debugMode_gfx.moveTo(this.vCenter.x, this.vCenter.y);
                var pRight = this.vecTarget.clone();
                pRight.toPolar().y = mathUtils.degToRad(this.PARAMS.PERLIN_START_ANGLE + this.PARAMS.PERLIN_RANGE);
                pRight.toCartesian();

                this.debugMode_gfx.lineTo(this.vCenter.x + pRight.x, this.vCenter.y + pRight.y);

            }
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