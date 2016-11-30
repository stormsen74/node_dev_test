/**
 * Created by STORMSEN on 29.11.2016.
 */

var raf = require('raf')
var PIXI = require('pixi.js');

import Particle from './particle';
import {Vector2} from './Vector2';

class Demo {


    constructor() {
        console.log('PixiSet!')


        this.size = {
            w: 1280,
            h: 720,
            r: 1280 / 720
        }


        this.vCenter = new Vector2(this.size.w * .5, this.size.h * .5);
        this.vPosition = new Vector2(100, 0);
        this.t = 0;
        this.particle = new Particle();


        this.initPIXI();
        this.initParticle();

        this.loop()

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

        this.renderer = new PIXI.autoDetectRenderer(this.size.w, this.size.h, rendererOptions);
        _screen.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();
        this.stage.interactive = true;


    }

    initParticle() {

        this.lines = new PIXI.Graphics();
        this.stage.addChild(this.lines);
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
        this.t += .1;
        //this.vPosition.add(new Vector2(Math.sin(10*this.t), 0))
        // this.vPosition.multiplyScalar(.5)
        this.vPosition.toPolar();
        // phi
        this.vPosition.y = this.t * .2;
        // r
        this.vPosition.x += 2 * Math.sin(this.t * 3);
        // this.vPosition.x = this.vPosition.y

        this.vPosition.toCartesian();
        // this.vPosition.rotate(.01);
        // this.vPosition.rotateAround(new Vector2(0, 0), .01);
        // console.log(this.vPosition)
        this.particle.position.x = this.vCenter.x + this.vPosition.x;
        this.particle.position.y = this.vCenter.y + this.vPosition.y;

        this.particle.tail.unshift({
            x: this.particle.position.x,
            y: this.particle.position.y
        });

        if (this.particle.tail.length > 100) {
            this.particle.tail.pop();
        }

        this.lines.clear();
        this.lines.lineStyle(1, 0xffffff);
        this.lines.moveTo(this.particle.position.x, this.particle.position.y);
        this.particle.tail.forEach((point, index) => {
            this.lines.lineTo(point.x, point.y);
        });


    }

    render() {
        this.renderer.render(this.stage);
    }


}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Demo;