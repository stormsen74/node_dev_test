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
import Sim_06 from './sim_06';

import {DEFAULT_SIZE} from './config';


import {Vector2} from './math/vector2';

// http://www.html5gamedevs.com/topic/23122-filters-that-require-a-margin/

class Demo {


    constructor() {
        console.log('Demo!')

        this.DEMO = {
            renderTexture: false
        }

        this._tempTexture;
        this.blurFilter = new PIXI.filters.BlurFilter(1, 2);
        this.blurFilter.padding = 10;


        this.size = {
            w: DEFAULT_SIZE.WIDTH,
            h: DEFAULT_SIZE.HEIGHT,
            r: DEFAULT_SIZE.WIDTH / DEFAULT_SIZE.HEIGHT
        }


        this.simulation = new Sim_06(DEFAULT_SIZE)

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
            transparent: true,
            //backgroundColor: 0x404040,
            backgroundColor: 0x000000,
            resolution: 1,
            antialias: true,
            autoResize: false,
            autoClear: false,
            roundPixels: true //performance
        }

        this.renderer = new PIXI.autoDetectRenderer(this.size.w, this.size.h, rendererOptions);
        _screen.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();
        this.stage.interactive = true;

        if (this.DEMO.renderTexture) {
            this.renderTexture_1 = new PIXI.RenderTexture(this.renderer, this.size.w, this.size.h);
            this.renderTexture_2 = new PIXI.RenderTexture(this.renderer, this.size.w, this.size.h);
            this.outputSprite = new PIXI.Sprite(this.renderTexture_1);
            this.outputSprite.filters = [this.blurFilter];
            this.stage.addChild(this.outputSprite);

            this.bg = new PIXI.Graphics();
            this.bg.beginFill(rendererOptions.backgroundColor, 0.1);
            this.bg.drawRect(0, 0, this.size.w, this.size.h);
            this.bg.endFill();
            this.bg.cacheAsBitmap = true;
            this.stage.addChild(this.bg);

        }

    }

    initSim() {

        this.stage.addChild(this.simulation)

    }


    update() {

        this.simulation.update();

    }

    render() {

        this.renderer.render(this.stage);


        if (this.DEMO.renderTexture) {
            // swap the buffers ...
            this._tempTexture = this.renderTexture_1;
            this.renderTexture_1 = this.renderTexture_2;
            this.renderTexture_2 = this._tempTexture;
            this.outputSprite.texture = this.renderTexture_1;

            //this.renderTexture_2.render(this.stage, null, false);
            //this.renderer.render(this.stage);

            this.renderer.render(this.stage, this.renderTexture_2)
        }

    }


}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Demo;