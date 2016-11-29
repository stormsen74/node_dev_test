/**
 * Created by STORMSEN on 25.11.2016.
 */

var PIXI = require('pixi.js');
var raf = require('raf')

class Sim {
    constructor() {
        this.renderer = PIXI.autoDetectRenderer(this.w, this.h, {backgroundColor: 0x663355});
        document.body.appendChild(this.renderer.view);

        //this.container = new CircleContainer();
        //this.container.stage = new Object();
        //this.container.stage.x = this.w;
        //this.container.stage.y = this.h;

        this.stage = new PIXI.Container();
        //this.stage.addChild(this.container);

        this.renderer.render(this.stage)


    }











}

Sim.prototype.w = window.innerWidth;
Sim.prototype.h = window.innerHeight;

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sim;