/**
 * Created by STORMSEN on 29.11.2016.
 */

var raf = require('raf')
var PIXI = require('pixi.js');

import Bling from './bling';
import Particle from './particle';
import {Vector2} from './Vector2';

class Demo {
    constructor() {
        console.log('PixiSet!')


        var bling = new Bling(3);
        console.log(bling.id)

        var va = new Vector2(100, 0);
        var vb = new Vector2(200, 0);
        var x = new Vector2();
        x.addVectors(va, vb)
        console.log(x)

        this.vCenter = new Vector2(window.innerWidth * .5, window.innerHeight * .5);
        this.vPosition = new Vector2(100, 0);
        this.t = 0;
        this.particle = new Particle();


        this.initPIXI();
        this.initParticle();


        this.loop()
    }

    initPIXI() {
        let _screen = document.getElementById('screen');

        let rendererOptions = {
            transparent: false,
            backgroundColor: 0x404040,
            resolution: 1,
            antialias: true,
            autoResize: false,
            roundPixels: true //performance
        };

        this.renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, rendererOptions);
        _screen.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();
        this.stage.interactive = true;

    }

    initParticle() {

        this.stage.addChild(this.particle);
    }

    loop() {
        raf(() => {
            this.loop()
        });
        this.update();
        this.render();
    }

    update() {
        this.t += .5;
        //this.vPosition.add(new Vector2(Math.sin(10*this.t), 0))
        // this.vPosition.multiplyScalar(.5)
        this.vPosition.toPolar();
        this.vPosition.x += Math.sin(this.t);
        //this.vPosition.y = this.t;
        this.vPosition.toCartesian();
        this.vPosition.rotate(.01);
        //this.vPosition.rotateAround(new Vector2(0, 0), .01);
        console.log(this.vPosition)
        this.particle.position.x = this.vCenter.x + this.vPosition.x;
        this.particle.position.y = this.vCenter.y + this.vPosition.y;
    }

    render() {
        this.renderer.render(this.stage);
    }


}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Demo;