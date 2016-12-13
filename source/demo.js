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
import Sim_05 from './sim_05';

import { DEFAULT_SIZE } from './config';


import {Vector2} from './math/vector2';

class Demo {


    constructor() {
        console.log('Demo!')


        this.size = {
            w: DEFAULT_SIZE.WIDTH,
            h: DEFAULT_SIZE.HEIGHT,
            r: DEFAULT_SIZE.WIDTH / DEFAULT_SIZE.HEIGHT
        }


        this.sim = new Sim_04(DEFAULT_SIZE)
        this.sim_t = new Sim_05(DEFAULT_SIZE)

        this.init_PIXI_Renderer();
        this.initSim();

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

        //this.stage.addChild(this.sim)
        this.stage.addChild(this.sim_t)

    }


    update() {

        this.sim.update();
        this.sim_t.update();

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