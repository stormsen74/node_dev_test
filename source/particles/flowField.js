/**
 * Created by STORMSEN on 01.12.2016.
 */

var gsap = require('gsap')
var SimplexNoise = require('simplex-noise')
var PIXI = require('pixi.js');

import {Vector2} from './../math/vector2';
import mathUtils from './../utils/mathUtils';
import {FIELD_PARAMS} from './../config';

class FlowField extends PIXI.Container {

    constructor(_size) {
        super()

        this.size = _size;

        this.CONFIG = {};
        this.CONFIG.INFO = 'config info';
        this.CONFIG.RULE = FIELD_PARAMS.rules['|x^2-y^2,x+y|'];

        this.RESOLUTION = {
            X: 10,
            Y: 5
        };
        this.vCell = new Vector2();
        this.vMap = new Vector2();
        this.magVector = new Vector2();
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

        this.cellWidth = this.size.WIDTH / this.RESOLUTION.X;
        this.cellHeight = this.size.HEIGHT / this.RESOLUTION.Y;

        this.vArray = new Array(this.RESOLUTION.X);
        for (var i = 0; i < this.vArray.length; i++) {
            this.vArray[i] = new Array(this.RESOLUTION.Y);
        }

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

    }


    update2DSystem() {
        this.init2DSystemField();
    }


    init2DSystemField() {

        //http://demonstrations.wolfram.com/PhasePortraitAndFieldDirectionsOfTwoDimensionalLinearSystems/

        if (!this.gui) {
            this.gui = new dat.GUI();
            this.gui.add(FIELD_PARAMS.system2D, 'a1').min(-3).max(3).step(0.01).name('a1').onChange(this.update2DSystem.bind(this));
            this.gui.add(FIELD_PARAMS.system2D, 'a2').min(-3).max(3).step(0.01).name('a2').onChange(this.update2DSystem.bind(this));
            this.gui.add(FIELD_PARAMS.system2D, 'b1').min(-3).max(3).step(0.01).name('a1').onChange(this.update2DSystem.bind(this));
            this.gui.add(FIELD_PARAMS.system2D, 'b2').min(-3).max(3).step(0.01).name('b2').onChange(this.update2DSystem.bind(this));
            // this.gui.add(this, 'drawField').name('drawField');
            // this.gui.close();
        }


        for (var i = 0, len = this.vArray.length; i < len; i++) {
            this.FIELD_X = mathUtils.convertToRange(i, [0, this.RESOLUTION.X - 1], [-this.RESOLUTION.X * .5, this.RESOLUTION.X * .5]);
            for (var j = 0, len = this.vArray.length; j < len; j++) {
                this.FIELD_Y = mathUtils.convertToRange(j, [0, this.RESOLUTION.Y - 1], [-this.RESOLUTION.Y * .5, this.RESOLUTION.Y * .5]);

                this.vCell.set(FIELD_PARAMS.system2D.a1 * this.FIELD_X + FIELD_PARAMS.system2D.b1 * this.FIELD_Y, FIELD_PARAMS.system2D.a2 * this.FIELD_X + FIELD_PARAMS.system2D.b2 * this.FIELD_Y);
                this.vArray[i][j] = this.vCell.clone();
            }
        }

    }


    initField() {

        console.log('initField', this.CONFIG.RULE)

        if (!this.gui) {
            this.gui = new dat.GUI();
            this.gui.add(this.CONFIG, 'INFO');
            this.gui.add(this.CONFIG, 'RULE').options(FIELD_PARAMS.rules).onChange(this.initField.bind(this));

        }

        for (var i = 0; i < this.vArray.length; i++) {
            this.FIELD_X = mathUtils.convertToRange(i, [0, this.RESOLUTION.X - 1], [-this.RESOLUTION.X * .5, this.RESOLUTION.X * .5]);
            for (var j = 0; j < this.vArray[1].length; j++) {
                this.FIELD_Y = mathUtils.convertToRange(j, [0, this.RESOLUTION.Y - 1], [-this.RESOLUTION.Y * .5, this.RESOLUTION.Y * .5]);

                /* ~ RULE ? */

                switch (this.CONFIG.RULE) {
                    case '|x^2-y^2,x+y|':
                        this.vCell.set(Math.pow(this.FIELD_X, 2) - Math.pow(this.FIELD_Y, 2), this.FIELD_X + this.FIELD_Y);
                        break;
                    case '|x^2,y^2|':
                        this.vCell.set(Math.pow(this.FIELD_X, 2), Math.pow(this.FIELD_Y, 2));
                        break;
                    case '|y^2,x^2|':
                        this.vCell.set(Math.pow(this.FIELD_Y, 2), Math.pow(this.FIELD_X, 2));
                        break;
                    case '|cos(x^2+y),x+y^2+1|':
                        this.vCell.set(Math.cos(Math.pow(this.FIELD_X, 2) + this.FIELD_Y), this.FIELD_X - Math.pow(this.FIELD_Y, 2) + 1);
                        break;
                }


                // let mag = this.vCell.length();
                // mag = 1 / mag;
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

            this.FIELD_X = mathUtils.convertToRange(i, [0, this.RESOLUTION.X - 1], [-this.RESOLUTION.X * .5, this.RESOLUTION.X * .5]);

            for (var j = 0; j < this.vArray[1].length; j++) {

                this.FIELD_Y = mathUtils.convertToRange(j, [0, this.RESOLUTION.Y - 1], [-this.RESOLUTION.Y * .5, this.RESOLUTION.Y * .5]);

                /* ~ perlin-noise ~*/
                this.PERLIN_THETA = mathUtils.convertToRange(this.SIMPLEX.noise2D(this.FIELD_X / this.FIELD_SCALE, this.FIELD_Y / this.FIELD_SCALE), [-1, 1], [0, Math.PI * 2]);

                this.vCell.set(Math.cos(this.PERLIN_THETA), Math.sin(this.PERLIN_THETA));

                //var mag = vCell.length();
                //mag = 1 / mag;


                this.vCell.normalize();
                let mag = Math.abs(this.SIMPLEX.noise2D(this.FIELD_X / this.FIELD_SCALE, this.FIELD_Y / this.FIELD_SCALE)) * 15;
                this.vCell.multiplyScalar(mag);

                this.vArray[i][j] = this.vCell.clone();
                // console.log(i, j, this.vArray[i][j]);

            }
        }

    }

    stepPerlinField() {

        this.t += this.deltaT;


        for (var i = 0, len = this.vArray.length; i < len; i++) {

            this.FIELD_X = mathUtils.convertToRange(i, [0, this.RESOLUTION.X - 1], [-this.RESOLUTION.X * .5, this.RESOLUTION.X * .5]);

            for (var j = 0, len2 = this.vArray[1].length; j < len2; j++) {

                this.FIELD_Y = mathUtils.convertToRange(j, [0, this.RESOLUTION.Y - 1], [-this.RESOLUTION.Y * .5, this.RESOLUTION.Y * .5]);

                /* ~ perlin-noise ~*/
                this.PERLIN_THETA = mathUtils.convertToRange(this.SIMPLEX.noise3D(this.FIELD_X / this.FIELD_SCALE, this.FIELD_Y / this.FIELD_SCALE, this.t), [-1, 1], [0, Math.PI * 2]);

                this.vCell.set(Math.cos(this.PERLIN_THETA), Math.sin(this.PERLIN_THETA));

                //var mag = vCell.length();
                //mag = 1 / mag;


                this.vCell.normalize();
                var mag = Math.abs(this.SIMPLEX.noise2D(this.FIELD_X / this.FIELD_SCALE, this.FIELD_Y / this.FIELD_SCALE)) * 15;
                this.vCell.multiplyScalar(mag);

                this.vArray[i][j] = this.vCell.clone();

            }
        }

    }


    lookup(vLookup) {

        // reference vector -> position
        this.vMap = vLookup.clone();

        // limit this vector
        //vMap.min(0, 0);
        //vMap.max(this.width, this.height);

        // map range
        this.mappedX = ~~mathUtils.convertToRange(this.vMap.x, [0, this.size.WIDTH], [0, this.RESOLUTION.X - 1]);
        this.mappedY = ~~mathUtils.convertToRange(this.vMap.y, [0, this.size.HEIGHT], [0, this.RESOLUTION.Y - 1]);

        // console.log(vLookup.x, canvas.width);
        // console.log(vLookup.y, canvas.height);

        return this.vArray[this.mappedX][this.mappedY].clone();
    }


    update() {

    }


    drawField() {

        // console.log('drawField');

        this.graphics.clear();

        this.graphics.lineStyle(.5, 0x00ff00, .5);
        // drawField cols
        for (var i = 1; i < this.RESOLUTION.X; i++) {
            this.graphics.moveTo(i * this.cellWidth, 0);
            this.graphics.lineTo(i * this.cellWidth, this.size.HEIGHT);
        }
        // drawField rows
        for (var i = 1; i < this.RESOLUTION.Y; i++) {
            this.graphics.moveTo(0, i * this.cellHeight);
            this.graphics.lineTo(this.size.WIDTH, i * this.cellHeight);
        }

        for (var i = 0; i < this.vArray.length; i++) {

            for (var j = 0; j < this.vArray[1].length; j++) {

                this.graphics.lineStyle(1, 0x006699, .1);
                this.graphics.beginFill(0xcc33ff);

                //drawField center point
                this.centerX = i * this.cellWidth + this.cellWidth * .5;
                this.centerY = j * this.cellHeight + this.cellHeight * .5;
                this.graphics.drawCircle(this.centerX, this.centerY, 2, 0, 2 * 3.14, false);
                this.graphics.endFill();

                // drawField mag vector
                this.graphics.moveTo(this.centerX, this.centerY);
                this.magVector = this.vArray[i][j].clone();
                //value = mathUtils.convertToRange(this.magVector.length(), [0, 18], [0, 1]);
                //this.color.setHSV(.5 + value * .5, .5, 0.0);
                //this.color.setBrightness(.5 + value);

                this.graphics.lineStyle(1, 0xf3f3f3, 1);

                //this.magVector.normalize();
                //this.magVector.multiplyScalar(20);
                this.graphics.lineTo(this.centerX + this.magVector.x, this.centerY + this.magVector.y);

            }
        }
    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default FlowField;