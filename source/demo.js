/**
 * Created by STORMSEN on 29.11.2016.
 */

var raf = require('raf')
var PIXI = require('pixi.js');


import Sim from './sim';
import Sim_01 from './sim_01';
import Sim_02 from './sim_02';
import Sim_03 from './sim_03';
import Sim_04 from './sim_04';

import { DEFAULT_SIZE } from './config';


var turbojs = require('turbojs');
import {Vector2} from './math/vector2';

class Demo {


    constructor() {
        console.log('Demo!')


        this.size = {
            w: 1280,
            h: 720,
            r: 1280 / 720
        }


        this.sim = new Sim_04(DEFAULT_SIZE)

        this.init_PIXI_Renderer();
        this.initSim();

        //this.initTurboTest();
        this.seek_default();
        this.seek_light();

    }

    seek_default() {
        let location = new Vector2(100, 100)
        let velocity = new Vector2(.01, .01)
        let vTarget = new Vector2(500, 500)
        let SEEK_MAX_SPEED = 10;
        let SEEK_MAX_FORCE = .5;
        this.vecDesired = Vector2.subtract(vTarget, location).normalize().multiplyScalar(SEEK_MAX_SPEED);
        this.vecSteer = Vector2.subtract(this.vecDesired, velocity).clampLength(0, SEEK_MAX_FORCE);

        console.log('seek_default', this.vecSteer);
        //this.applyForce(this.vecSteer);
    }


    seek_light() {
        let location = new Vector2(100, 100)
        let velocity = new Vector2(.01, .01)
        let vTarget = new Vector2(500, 500)
        let SEEK_MAX_SPEED = 10.01;
        let SEEK_MAX_FORCE = 0.5;

        var crunch = turbojs.alloc(4);

        crunch.data[0] = location.x
        crunch.data[1] = location.y

        crunch.data[2] = vTarget.x
        crunch.data[3] = vTarget.y

        this.vecDesired = Vector2.subtract(vTarget, location)
        this.vecDesired.normalize()
        this.vecDesired.multiplyScalar(SEEK_MAX_SPEED);

        this.vecSteer = Vector2.subtract(this.vecDesired, velocity)
        this.vecSteer.clampLength(0, SEEK_MAX_FORCE);

        turbojs.run(crunch, `void main(void) {

        vec2 vLocation = vec2(${location.x},${location.y});
        vec2 velocity = vec2(${velocity.x},${velocity.y});
	    vec2 vTarget = vec2(${vTarget.x},${vTarget.y});

	    vec2 vecDesired = normalize(vTarget-vLocation)*${SEEK_MAX_SPEED};
	    vec2 vecSteer = clamp(vecDesired-velocity,.0,${SEEK_MAX_FORCE});

        commit(vec4(vecSteer.rg, 0., 0.));

        }`);
        //vec2 velocityClamp = clamp(velocity, 0.0, ${SEEK_MAX_FORCE})

        console.log(crunch.data.subarray(0, 2));

        console.log('seek_light', this.vecSteer);
        //this.applyForce(this.vecSteer);
    }

    initTurboTest() {

        var crunch = turbojs.alloc(4);

        crunch.data[0] = 1.5
        crunch.data[1] = 1.5

        crunch.data[2] = 2.
        crunch.data[3] = 2.


        turbojs.run(crunch, `void main(void) {
        vec4 vinput = read();
        vec2 v0 = vec2(vinput.rg);
	    vec2 v1 = vec2(vinput.ba);
	    vec2 result = v0*v1;


        commit(vec4(result.rg, 0., 0.));

        }`);


        console.log(crunch.data.subarray(0, 2));
    }

    resize(width, height) {
        let w, h
        // if (width < this.size.w) {
        //     if (width / height >= this.size.r) {
        //         w = height * this.size.r;
        //         h = height;
        //     } else {
        //         w = width;
        //         h = width / this.size.r;
        //     }
        //     this.renderer.view.style.width = w + 'px';
        //     this.renderer.view.style.height = h + 'px';
        // } else {
        // }
        w = this.size.w;
        h = this.size.h;

        document.getElementById('screen').style.width = w + 'px';
        document.getElementById('screen').style.height = h + 'px';

        document.getElementById('screen').style.left = (width - w) * .5 + 'px';
        document.getElementById('screen').style.top = (height - h) * .5 + 'px';
    }

    init_PIXI_Renderer() {
        let _screen = document.getElementById('screen');

        let rendererOptions = {
                transparent: false,
                backgroundColor: 0x404040,
                resolution: 1,
                antialias: true,
                autoResize: false,
                autoClear: false,
                roundPixels: true //performance
            }
            ;

        this.renderer = new PIXI.autoDetectRenderer(this.size.w, this.size.h, rendererOptions);
        _screen.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();
        this.stage.interactive = true;


        // render texture*
        //this.renderTexture = new PIXI.RenderTexture(this.renderer, this.size.w, this.size.h);
        //this.renderTexture2 = new PIXI.RenderTexture(this.renderer, this.size.w, this.size.h);
        //this.outputSprite = new PIXI.Sprite(this.renderTexture);
        //this.stage.addChild(this.outputSprite);
        //
        //this.bg = new PIXI.Graphics();
        //this.bg.beginFill(rendererOptions.backgroundColor, 0.01);
        //this.bg.drawRect(0, 0, this.size.w, this.size.h);
        //this.bg.endFill();
        //this.bg.cacheAsBitmap = true;
        //this.stage.addChild(this.bg);

    }

    initSim() {

        this.stage.addChild(this.sim)

    }


    update() {

        this.sim.update();

    }

    render() {

        this.renderer.render(this.stage);


        // render texture*

        // swap the buffers ...
        //let temp = this.renderTexture;
        //this.renderTexture = this.renderTexture2;
        //this.renderTexture2 = temp;
        //this.outputSprite.texture = this.renderTexture;
        //
        //this.renderTexture2.render(this.stage, null, false);
        //this.renderer.render(this.stage);

    }


}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Demo;