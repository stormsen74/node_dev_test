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

    constructor(_size, _type) {
        super()

        this.size = _size;
        this.type = _type;

        console.log(this.type)


        this.updateDraw = true;

        this.RESOLUTION = {
            X: 30,
            Y: 15
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

        this.CONFIG = {};
        this.CONFIG.INFO = 'flow field';
        this.CONFIG.RULE = FIELD_PARAMS.rules['|y,-x|'];

        this.cellWidth = this.size.WIDTH / this.RESOLUTION.X;
        this.cellHeight = this.size.HEIGHT / this.RESOLUTION.Y;

        this.vArray = new Array(this.RESOLUTION.X);
        for (var i = 0; i < this.vArray.length; i++) {
            this.vArray[i] = new Array(this.RESOLUTION.Y);
        }

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);


        switch (this.type) {
            case 'vectorField':
                // https://en.wikipedia.org/wiki/Vector_field
                if (!this.gui) {
                    this.gui = new dat.GUI();
                    this.CONFIG.INFO = 'vectorField';
                    this.gui.add(this.CONFIG, 'INFO');
                    this.gui.add(this.CONFIG, 'RULE').options(FIELD_PARAMS.rules).onChange(this.initVectorField.bind(this));
                }
                this.initVectorField();
                break;
            case 'linearSystemField':
                // http://demonstrations.wolfram.com/PhasePortraitAndFieldDirectionsOfTwoDimensionalLinearSystems/
                if (!this.gui) {
                    this.gui = new dat.GUI();
                    this.CONFIG.INFO = 'linearSystemField';
                    this.gui.add(this.CONFIG, 'INFO');
                    this.gui.add(FIELD_PARAMS.system2D, 'a1').min(-3).max(3).step(0.01).name('a1').onChange(this.plotLinearSystemField.bind(this));
                    this.gui.add(FIELD_PARAMS.system2D, 'a2').min(-3).max(3).step(0.01).name('a2').onChange(this.plotLinearSystemField.bind(this));
                    this.gui.add(FIELD_PARAMS.system2D, 'b1').min(-3).max(3).step(0.01).name('a1').onChange(this.plotLinearSystemField.bind(this));
                    this.gui.add(FIELD_PARAMS.system2D, 'b2').min(-3).max(3).step(0.01).name('b2').onChange(this.plotLinearSystemField.bind(this));
                }
                this.plotLinearSystemField();
                break;
            case 'perlinField':
                if (!this.gui) {
                    this.gui = new dat.GUI();
                    this.CONFIG.INFO = 'perlinField';
                    this.gui.add(this.CONFIG, 'INFO');
                    this.gui.add(FIELD_PARAMS.perlin, 'FIELD_SCALE').min(1).max(10).step(0.01).name('FIELD_SCALE').onChange(this.stepPerlinField.bind(this));
                    this.gui.add(FIELD_PARAMS.perlin, 'FIELD_STRENGTH').min(1).max(30).step(0.01).name('FIELD_STRENGTH').onChange(this.stepPerlinField.bind(this));
                    this.gui.add(FIELD_PARAMS, 'deltaT').min(0.001).max(0.01).step(0.0001).name('deltaT').onChange(this.stepPerlinField.bind(this));

                }
                this.initPerlinField();
                break;
        }

        // this.gui.add(this, 'drawField').name('drawField');
        // this.gui.close();

        if (this.updateDraw) this.drawField();

    }


    plotLinearSystemField() {

        for (var i = 0, len = this.vArray.length; i < len; i++) {
            this.FIELD_X = mathUtils.convertToRange(i, [0, this.RESOLUTION.X - 1], [-this.RESOLUTION.X * .5, this.RESOLUTION.X * .5]);
            for (var j = 0, len = this.vArray.length; j < len; j++) {
                this.FIELD_Y = mathUtils.convertToRange(j, [0, this.RESOLUTION.Y - 1], [-this.RESOLUTION.Y * .5, this.RESOLUTION.Y * .5]);

                this.vCell.set(FIELD_PARAMS.system2D.a1 * this.FIELD_X + FIELD_PARAMS.system2D.b1 * this.FIELD_Y, FIELD_PARAMS.system2D.a2 * this.FIELD_X + FIELD_PARAMS.system2D.b2 * this.FIELD_Y);
                this.vArray[i][j] = this.vCell.clone();
            }
        }

    }


    initVectorField() {

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
                    case '|sin(y),sin(x)|':
                        this.vCell.set(Math.sin(this.FIELD_X), Math.sin(this.FIELD_Y)).multiplyScalar(10);
                        break;
                    case '|x,y|':
                        this.vCell.set(this.FIELD_X, this.FIELD_Y).multiplyScalar(3);
                        break;
                    case '|y,x|':
                        this.vCell.set(this.FIELD_Y, this.FIELD_X).multiplyScalar(3);
                        break;
                    case '|y,-x|':
                        this.vCell.set(this.FIELD_Y, -this.FIELD_X).multiplyScalar(3);
                        break;
                }

                // let mag = this.vCell.length();
                // mag = 1 / mag;
                // this.vCell.normalize();
                // this.vCell.multiplyScalar(10);

                this.vArray[i][j] = this.vCell.clone();
            }
        }

    }

    initPerlinField() {

        this.SIMPLEX = new SimplexNoise();
        //noise.seed(this.FIELD_SEED);

        for (var i = 0; i < this.vArray.length; i++) {

            this.FIELD_X = mathUtils.convertToRange(i, [0, this.RESOLUTION.X - 1], [-this.RESOLUTION.X * .5, this.RESOLUTION.X * .5]);

            for (var j = 0; j < this.vArray[1].length; j++) {

                this.FIELD_Y = mathUtils.convertToRange(j, [0, this.RESOLUTION.Y - 1], [-this.RESOLUTION.Y * .5, this.RESOLUTION.Y * .5]);

                /* ~ perlin-noise ~ */
                this.PERLIN_THETA = mathUtils.convertToRange(this.SIMPLEX.noise2D(this.FIELD_X / FIELD_PARAMS.perlin.FIELD_SCALE, this.FIELD_Y / FIELD_PARAMS.perlin.FIELD_SCALE), [-1, 1], [0, Math.PI * 2]);

                this.vCell.set(Math.cos(this.PERLIN_THETA), Math.sin(this.PERLIN_THETA));

                //var mag = vCell.length();
                //mag = 1 / mag;


                this.vCell.normalize();
                let mag = Math.abs(this.SIMPLEX.noise2D(this.FIELD_X / FIELD_PARAMS.perlin.FIELD_SCALE, this.FIELD_Y / FIELD_PARAMS.perlin.FIELD_SCALE)) * FIELD_PARAMS.perlin.FIELD_STRENGTH;
                this.vCell.multiplyScalar(mag);

                this.vArray[i][j] = this.vCell.clone();
            }
        }

    }

    stepPerlinField() {

        this.t += FIELD_PARAMS.deltaT;


        for (var i = 0, len = this.vArray.length; i < len; i++) {

            this.FIELD_X = mathUtils.convertToRange(i, [0, this.RESOLUTION.X - 1], [-this.RESOLUTION.X * .5, this.RESOLUTION.X * .5]);

            for (var j = 0, len2 = this.vArray[1].length; j < len2; j++) {

                this.FIELD_Y = mathUtils.convertToRange(j, [0, this.RESOLUTION.Y - 1], [-this.RESOLUTION.Y * .5, this.RESOLUTION.Y * .5]);

                /* ~ perlin-noise ~*/
                this.PERLIN_THETA = mathUtils.convertToRange(this.SIMPLEX.noise3D(this.FIELD_X / FIELD_PARAMS.perlin.FIELD_SCALE, this.FIELD_Y / FIELD_PARAMS.perlin.FIELD_SCALE, this.t), [-1, 1], [0, Math.PI * 2]);

                this.vCell.set(Math.cos(this.PERLIN_THETA), Math.sin(this.PERLIN_THETA));

                //var mag = vCell.length();
                //mag = 1 / mag;


                this.vCell.normalize();
                var mag = Math.abs(this.SIMPLEX.noise2D(this.FIELD_X / FIELD_PARAMS.perlin.FIELD_SCALE, this.FIELD_Y / FIELD_PARAMS.perlin.FIELD_SCALE)) * FIELD_PARAMS.perlin.FIELD_STRENGTH;
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

    modify() {
        for (var i = 0, len = this.vArray.length; i < len; i++) {
            for (var j = 0, len2 = this.vArray[1].length; j < len2; j++) {
                this.vArray[i][j] = this.vArray[i][j].clone().rotate(.05).clone();
            }
        }
    }


    update() {
        if (this.type == 'perlinField') {
            this.stepPerlinField();
        } else if (this.type == 'linearSystemField') {
            this.plotLinearSystemField();
        }

        if (this.updateDraw) this.drawField();

    }

    plotGrid() {

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
    }

    drawGrid() {

        this.graphics.lineStyle(.5, 0xffffff, .5);
        // drawField cols
        for (var i = 0; i < this.RESOLUTION.X; i++) {
            this.graphics.moveTo(i * this.cellWidth, 0);
            this.graphics.lineTo(i * this.cellWidth, this.size.HEIGHT);

            this.graphics.beginFill(0xff4455, .5);
            this.graphics.drawRect(i * this.cellWidth, 0, this.cellWidth, this.cellHeight)
            this.graphics.endFill();
        }
        // drawField rows
        for (var i = 1; i < this.RESOLUTION.Y; i++) {
            this.graphics.moveTo(0, i * this.cellHeight);
            this.graphics.lineTo(this.size.WIDTH, i * this.cellHeight);
        }
    }


    drawField() {

        this.graphics.clear();

        //this.drawGrid();

        //this.graphics.lineStyle(.5, 0x00ff00, .5);
        //// drawField cols
        //for (var i = 1; i < this.RESOLUTION.X; i++) {
        //    this.graphics.moveTo(i * this.cellWidth, 0);
        //    this.graphics.lineTo(i * this.cellWidth, this.size.HEIGHT);
        //}
        //// drawField rows
        //for (var i = 1; i < this.RESOLUTION.Y; i++) {
        //    this.graphics.moveTo(0, i * this.cellHeight);
        //    this.graphics.lineTo(this.size.WIDTH, i * this.cellHeight);
        //}

        for (var i = 0; i < this.vArray.length; i++) {

            for (var j = 0; j < this.vArray[1].length; j++) {

                this.magVector = this.vArray[i][j].clone();

                this.graphics.lineStyle(1, 0x334477, 1);
                this.graphics.moveTo(this.centerX, this.centerY);
                this.graphics.lineTo(this.centerX + this.magVector.x, this.centerY + this.magVector.y);

                this.graphics.lineStyle(1, 0x232323, .1);
                this.graphics.beginFill(0x232323);

                //drawField center point
                this.centerX = i * this.cellWidth + this.cellWidth * .5;
                this.centerY = j * this.cellHeight + this.cellHeight * .5;
                this.graphics.drawCircle(this.centerX, this.centerY, 2, 0, 2 * 3.14, false);
                this.graphics.endFill();

                // drawField mag vector
                //this.color.setHSV(.5 + value * .5, .5, 0.0);
                //this.color.setBrightness(.5 + value);


                //this.magVector.normalize();
                //this.magVector.multiplyScalar(20);


                // var value = mathUtils.convertToRange(this.magVector.length(), [0, 25], [0, 1]);
                var value = mathUtils.convertToRange(this.magVector.angle(), [0, 2 * 3.14], [.2, 1]);
                // console.log(this.magVector.length())

                this.graphics.beginFill(0xff4455, value);
                this.graphics.drawRect(i * this.cellWidth, j * this.cellHeight, this.cellWidth, this.cellHeight)
                this.graphics.endFill();

            }
        }
    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default FlowField;