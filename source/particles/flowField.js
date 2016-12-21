/**
 * Created by STORMSEN on 01.12.2016.
 */

var gsap = require('gsap')
var SimplexNoise = require('simplex-noise')
var PIXI = require('pixi.js');

import {Vector2} from './../math/vector2';
import Agent from './../particles/agent';
import mathUtils from './../utils/mathUtils';
import Random from '../utils/random'

import {SIM_DEFAULT} from './../config';
import {INPUT_DATA} from './../config';
import {SETTINGS} from './../config';

class FlowField extends PIXI.Container {

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
        this.centerX = 0;
        this.centerY = 0;
        this.SIMPLEX;
        this.t = 0;
        this.deltaT = 0.0025;
        this.FIELD_X = 0;
        this.FIELD_Y = 0;
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
        this.gui.add(this, 'drawField').name('drawField');
        //this.gui.close();


    }


    initField() {

        let a1 = -2.5;
        let b1 = 7;
        let a2 = -6.75;
        let b2 = -1.85;

        for (var i = 0; i < this.vArray.length; i++) {

            this.fieldX = mathUtils.convertToRange(i, [0, this.range - 1], [-this.range * .5, this.range * .5]);

            for (var j = 0; j < this.vArray[1].length; j++) {

                this.fieldY = mathUtils.convertToRange(j, [0, this.range - 1], [-this.range * .5, this.range * .5]);

                /* ~ RULE ? */

                // |x^2-y^2,x+y|
                //vCell.set(Math.pow(fieldX, 2) - Math.pow(fieldY, 2), fieldX + fieldY);

                // |x^2,y^2|
                // this.vCell.set(Math.pow(this.fieldX, 2), Math.pow(this.fieldY, 2));

                // |y^2,x^2|
                this.vCell.set(Math.pow(this.fieldY, 2), Math.pow(this.fieldX, 2));

                // |cos(x^2+y),x+y^2+1|
                //  this.vCell.set(Math.cos(Math.pow(this.fieldX, 2) + this.fieldY), this.fieldX - Math.pow(this.fieldY, 2) + 1);

                /* ~ RULE ? */

                //http://demonstrations.wolfram.com/PhasePortraitAndFieldDirectionsOfTwoDimensionalLinearSystems/
                // this.vCell.set(a1 * this.fieldX + b1 * this.fieldY, a2 * this.fieldX + b2 * this.fieldY);


                let mag = this.vCell.length();
                mag = 1 / mag;
                // this.vCell.normalize();
                // this.vCell.multiplyScalar(mag);

                this.vArray[i][j] = this.vCell.clone();

                //console.log(i, j, this.vArray[i][j]);
            }
        }

        this.drawField();

    }

    initPerlinField() {

        this.SIMPLEX = new SimplexNoise();
        //noise.seed(this.FIELD_SEED);

        for (var i = 0; i < this.vArray.length; i++) {

            this.fieldX = mathUtils.convertToRange(i, [0, this.range - 1], [-this.range * .5, this.range * .5]);

            for (var j = 0; j < this.vArray[1].length; j++) {

                this.fieldY = mathUtils.convertToRange(j, [0, this.range - 1], [-this.range * .5, this.range * .5]);

                /* ~ perlin-noise ~*/
                this.PERLIN_THETA = mathUtils.convertToRange(this.SIMPLEX.noise2D(this.fieldX / this.FIELD_SCALE, this.fieldY / this.FIELD_SCALE), [-1, 1], [0, Math.PI * 2]);

                this.vCell.set(Math.cos(this.PERLIN_THETA), Math.sin(this.PERLIN_THETA));

                //var mag = vCell.length();
                //mag = 1 / mag;


                this.vCell.normalize();
                let mag = Math.abs(this.SIMPLEX.noise2D(this.fieldX / this.FIELD_SCALE, this.fieldY / this.FIELD_SCALE)) * 15;
                this.vCell.multiplyScalar(mag);

                this.vArray[i][j] = this.vCell.clone();
                // console.log(i, j, this.vArray[i][j]);

            }
        }

    }

    stepPerlinField() {

        this.t += this.deltaT;


        for (var i = 0, len = this.vArray.length; i < len; i++) {

            this.fieldX = mathUtils.convertToRange(i, [0, this.range - 1], [-this.range * .5, this.range * .5]);

            for (var j = 0, len2 = this.vArray[1].length; j < len2; j++) {

                this.fieldY = mathUtils.convertToRange(j, [0, this.range - 1], [-this.range * .5, this.range * .5]);

                /* ~ perlin-noise ~*/
                this.PERLIN_THETA = mathUtils.convertToRange(this.SIMPLEX.noise3D(this.fieldX / this.FIELD_SCALE, this.fieldY / this.FIELD_SCALE, this.t), [-1, 1], [0, Math.PI * 2]);

                this.vCell.set(Math.cos(this.PERLIN_THETA), Math.sin(this.PERLIN_THETA));

                //var mag = vCell.length();
                //mag = 1 / mag;


                this.vCell.normalize();
                var mag = Math.abs(this.SIMPLEX.noise2D(this.fieldX / this.FIELD_SCALE, this.fieldY / this.FIELD_SCALE)) * 15;
                //var mag = Math.abs(noise.perlin3(this.fieldX / this.FIELD_SCALE, this.fieldY / this.FIELD_SCALE, this.t)) * 15;
                this.vCell.multiplyScalar(mag);

                this.vArray[i][j] = this.vCell.clone();

            }
        }

        //this.drawField();

    }


    lookup(vLookup) {

        // reference vector -> position
        let vMap = vLookup.clone();

        // limit this vector
        vMap.min(0, 0);
        vMap.max(this.width, this.height);

        // map range
        this.mappedX = ~~mathUtils.convertToRange(vMap.x, [0, this.width], [0, this.range - 1]);
        this.mappedY = ~~mathUtils.convertToRange(vMap.y, [0, this.height], [0, this.range - 1]);

        // console.log(vLookup.x, canvas.width);
        // console.log(vLookup.y, canvas.height);

        return this.vArray[this.mappedX][this.mappedY].clone();
    }


    update() {


    }


    drawField() {

        //console.log('drawField');


        this.graphics.clear();

        for (var i = 0; i < this.vArray.length; i++) {

            for (var j = 0; j < this.vArray[1].length; j++) {

                this.graphics.lineStyle(1, 0x006699, .1);
                this.graphics.beginFill(0xcc33ff);

                // drawField cols
                //this.graphics.moveTo(i * this.cellWidth, 0);
                //this.graphics.lineTo(i * this.cellWidth, this.height);


                // drawField rows
                //this.graphics.moveTo(0, j * this.cellHeight);
                //this.graphics.lineTo(this.size.WIDTH + this.cellWidth * .5, j * this.cellHeight);
                this.centerX = i * this.cellWidth + this.cellWidth * .5;
                this.centerY = j * this.cellHeight + this.cellHeight * .5;
                this.graphics.drawCircle(this.centerX, this.centerY, 2, 0, 2 * 3.14, false);
                this.graphics.endFill();

                //drawField center point
                //this.graphics.lineStyle(0, 0x000000, 0);
                //this.graphics.beginFill(0xcc0000);

                //this.t_center.x = i * this.cellWidth + this.cellWidth * .5;
                //this.t_center.y = j * this.cellHeight + this.cellHeight * .5;

                // drawField mag vector
                this.graphics.moveTo(this.centerX, this.centerY);

                this.magVector = this.vArray[i][j].clone();
                //value = mathUtils.convertToRange(this.magVector.length(), [0, 18], [0, 1]);
                //this.color.setHSV(.5 + value * .5, .5, 0.0);
                //this.color.setBrightness(.5 + value);

                this.graphics.lineStyle(1, 0xf3f3f3, 1);

                this.magVector.normalize();
                this.magVector.multiplyScalar(20);
                this.graphics.lineTo(this.centerX + this.magVector.x, this.centerY + this.magVector.y);
                // console.log(this.magVector)


            }
        }
    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default FlowField;