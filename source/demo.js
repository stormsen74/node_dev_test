/**
 * Created by STORMSEN on 24.11.2016.
 */

import Sim from './sim'

class Demo {
    constructor() {

        this.v = 0;

        this.create();
    }

    create() {
        console.log('do')

        this.sim = new Sim();
    }



}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Demo;






//class CircleContainer extends PIXI.Sprite {
//    constructor(...arg) {
//        super(...arg);
//
//        this.circles = new Array();
//    }
//    render() {
//        for(var i=0;i<400;i++){
//            this.circles.push(new Circle());
//            this.circles[i].count = this.stage.x * Math.random();
//            this.circles[i].reg = Math.random() * 10 + 1;
//            this.circles[i].friction = Math.random() * 2;
//            this.addChild(this.circles[i]);
//        }
//    }
//    update() {
//        for(var circle of this.circles){
//            circle.x = Math.sin(circle.count) * (this.stage.x / circle.reg) + (this.stage.x / 2) / circle.friction;
//            circle.y = Math.cos(circle.count) * (this.stage.y / circle.reg) + (this.stage.y / 2) / circle.friction;
//            circle.count += 0.01;
//        }
//    }
//}
//
//class Circle extends PIXI.Sprite {
//    constructor(...arg) {
//        super(...arg);
//
//        this.deg = Math.floor(Math.random() * 20 + 1);
//        this.alpha = Math.random();
//
//        this.graphics = new PIXI.Graphics();
//        this.graphics.beginFill(0xF00d0F, 1);
//        this.graphics.drawCircle(0, 0, this.deg);
//        this.addChild(this.graphics);
//    }
//}


/*
class Main {
    constructor() {
        this.renderer = PIXI.autoDetectRenderer(this.w, this.h, {backgroundColor : 0x000000});
        document.body.appendChild(this.renderer.view);

        this.container = new CircleContainer();
        this.container.stage = new Object();
        this.container.stage.x = this.w;
        this.container.stage.y = this.h;

        this.stage = new PIXI.Container();
        this.stage.addChild(this.container);
    }
    render() {
        this.container.render();
        this.renderer.render(this.stage);
        this.animate();
    }
    animate() {
        this.container.update();
        this.renderer.render(this.stage);
        window.requestAnimationFrame(this.animate.bind(this));
    }
}
Main.prototype.w = window.innerWidth;
Main.prototype.h = window.innerHeight;
*/

//var main = new Main();
//main.render();