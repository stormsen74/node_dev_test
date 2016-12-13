/**
 * Created by STORMSEN on 01.12.2016.
 */

var gsap = require('gsap')
var SimplexNoise = require('simplex-noise')

import {Vector2} from './math/vector2';
import Agent from './particles/agent';
import ParticleSystem from './particles/pSystem';
import Repeller from './particles/repeller';
import Attractor from './particles/attractor';
import mathUtils from './utils/mathUtils';
import Sim from './sim';
import Random from './random'

import {SIM_DEFAULT} from './config';
import {INPUT_DATA} from './config';
import {SETTINGS} from './config';

class Sim_05 extends Sim {

    constructor(_size) {
        super()

        this.size = _size;
        this.vArray = [];
        this.vArray = [];

        this.range = 10;
        //private t:number = 0;
        //private deltaT:number = 0.0025;
        this.vCell = new Vector2();
        this.magVector = new Vector2();
        //private fieldX:number;
        //private fieldY:number;
        this.FIELD_SEED = 0.3755982327274978;
        this.FIELD_SCALE = 10;
        this.PERLIN_THETA = 0;


        this.cellWidth = this.size.WIDTH / this.range;
        this.cellHeight = this.size.HEIGHT / this.range;

        this.vArray = new Array(this.range);
        for (var i = 0; i < this.vArray.length; i++) {
            this.vArray[i] = new Array(this.range);
        }


        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);


        //this.init();
        this.update();

        this.gui = new dat.GUI();
        this.gui.add(SETTINGS, 'minSide').min(0).max(100).name('Min Side Length');
        this.gui.add(SETTINGS, 'minAngle').min(0.0).max(1.2).step(0.01).name('Min Angle (rad)');
        this.gui.add(SETTINGS, 'iterations').min(1).max(100).name('Iterations');
        this.gui.add(SETTINGS, 'randomness').min(0.0).max(1.0).step(0.01).name('Randomness');
        this.gui.add(SETTINGS, 'opposite').min(0.0).max(1.0).step(0.01).name('Opposite Sides');
        this.gui.add(this, 'test').name('Start / Stop');
        this.gui.close();


    }


    test() {
        console.log('call', 5, SETTINGS.minSide);

        this.initField();

        this.draw();


    }

    initField() {

        let a1 = -2.5;
        let b1 = 7;
        let a2 = -6.75;
        let b2 = -1.85;

        for (var i = 0; i < this.vArray.length; i++) {

            let fieldX = mathUtils.convertToRange(i, [0, this.range - 1], [-this.range * .5, this.range * .5]);

            for (var j = 0; j < this.vArray[1].length; j++) {

                let fieldY = mathUtils.convertToRange(j, [0, this.range - 1], [-this.range * .5, this.range * .5]);

                /* ~ RULE ? */

                // |x^2-y^2,x+y|
                //vCell.set(Math.pow(fieldX, 2) - Math.pow(fieldY, 2), fieldX + fieldY);

                // |x^2,y^2|
                //vCell.set(Math.pow(fieldX, 2), Math.pow(fieldY, 2));

                // |y^2,x^2|
                //vCell.set(Math.pow(fieldY, 2), Math.pow(fieldX, 2));

                // |cos(x^2+y),x+y^2+1|
                //vCell.set(Math.cos(Math.pow(fieldX, 2) + fieldY), fieldX - Math.pow(fieldY, 2) + 1);

                /* ~ RULE ? */

                //http://demonstrations.wolfram.com/PhasePortraitAndFieldDirectionsOfTwoDimensionalLinearSystems/
                this.vCell.set(a1 * fieldX + b1 * fieldY, a2 * fieldX + b2 * fieldY);


                let mag = this.vCell.length();
                mag = 1 / mag;
                this.vCell.normalize();
                this.vCell.multiplyScalar(mag);

                this.vArray[i][j] = this.vCell.clone();

                //console.log(i, j, this.vArray[i][j]);
            }
        }

    }

    initPerlinField() {

        let simplex = new SimplexNoise(Math.random);
        //noise.seed(this.FIELD_SEED);

        for (var i = 0; i < this.vArray.length; i++) {

            var fieldX = mathUtils.convertToRange(i, [0, this.range - 1], [-this.range * .5, this.range * .5]);

            for (var j = 0; j < this.vArray[1].length; j++) {

                var fieldY = mathUtils.convertToRange(j, [0, this.range - 1], [-this.range * .5, this.range * .5]);

                /* ~ perlin-noise ~*/
                var theta = mathUtils.convertToRange(simplex.noise2D(fieldX / this.FIELD_SCALE, fieldY / this.FIELD_SCALE), [-1, 1], [0, mathUtils.TWO_PI]);

                this.vCell.set(Math.cos(theta), Math.sin(theta));

                //var mag = vCell.length();
                //mag = 1 / mag;


                this.vCell.normalize();
                var mag = Math.abs(simplex.noise2D(fieldX / this.FIELD_SCALE, fieldY / this.FIELD_SCALE)) * 15;
                this.vCell.multiplyScalar(mag);

                this.vArray[i][j] = this.vCell.clone();

                //console.log(i, j, this.vArray[i][j]);

            }
        }

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



        // inherit
        if (this.vMouse.pressed) {
        }


    }


    draw() {

        console.log('draw');

        this.graphics.clear();

        for (var i = 0; i < this.vArray.length; i++) {

            for (var j = 0; j < this.vArray[1].length; j++) {

                this.graphics.lineStyle(1, 0x006699, .1);
                this.graphics.beginFill(0xcc33ff);

                // draw cols
                //this.graphics.moveTo(i * this.cellWidth, 0);
                //this.graphics.lineTo(i * this.cellWidth, this.height);


                // draw rows
                //this.graphics.moveTo(0, j * this.cellHeight);
                //this.graphics.lineTo(this.size.WIDTH + this.cellWidth * .5, j * this.cellHeight);
                let centerX = i * this.cellWidth + this.cellWidth * .5;
                let centerY = j * this.cellHeight + this.cellHeight * .5;
                this.graphics.drawCircle(centerX, centerY, 2, 0, 2 * 3.14, false);
                this.graphics.endFill();

                //draw center point
                //this.graphics.lineStyle(0, 0x000000, 0);
                //this.graphics.beginFill(0xcc0000);

                //this.t_center.x = i * this.cellWidth + this.cellWidth * .5;
                //this.t_center.y = j * this.cellHeight + this.cellHeight * .5;

                // draw mag vector
                this.graphics.moveTo(centerX, centerY);

                this.magVector = this.vArray[i][j].clone();
                //value = mathUtils.convertToRange(this.magVector.length(), [0, 18], [0, 1]);
                //this.color.setHSV(.5 + value * .5, .5, 0.0);
                //this.color.setBrightness(.5 + value);

                this.graphics.lineStyle(1, 0xf3f3f3, 1);

                this.magVector.normalize();
                this.magVector.multiplyScalar(25);
                this.graphics.lineTo(centerX + this.magVector.x, centerY + this.magVector.y);
                console.log(this.magVector)


            }
        }
    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sim_05;