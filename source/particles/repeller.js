/**
 * Created by STORMSEN on 04.12.2016.
 */

var PIXI = require('pixi.js');
import {Vector2} from './../math/vector2';

class Repeller extends PIXI.Container {
    constructor(_location, _radius) {
        super()

        this.location = _location;
        this.radius = _radius;
        this.strength = 750;

        this.gfx = new PIXI.Graphics();
        this.gfx.interactive = true;
        //this.dragShape.buttonMode = true;

        this.addChild(this.gfx)
        this.gfx.lineStyle(1, 0xff3300, .5);
        this.gfx.beginFill(0xff3300, .02);
        this.gfx.drawCircle(0, 0, this.radius * 2);
        this.gfx.endFill();

        this.gfx.x = this.location.x;
        this.gfx.y = this.location.y;


        this.dragData = {
            startX: 0,
            offsetX: 0,
            isDragging: false,
            normalizedDrag: 0
        };


        this.initDrag();


    }

    initDrag() {

        this.gfx.on('mouseover', this.onMouseOver.bind(this));
        this.gfx.on('mouseout', this.onMouseOut.bind(this));
        this.gfx.on('mousedown', this.onDragStart.bind(this));
        this.gfx.on('mousemove', this.onDragMove.bind(this));
        this.gfx.on('mouseup', this.onDragEnd.bind(this));

        //.on('touchstart', this.onDragStart)
        //.on('mousemove', onDragMove).on('touchmove', onDragMove)
        //.on('mouseup', onDragEnd).on('mouseupoutside', onDragEnd)
        //.on('touchend', onDragEnd).on('touchendoutside', onDragEnd);


    }

    onMouseOver() {
        //this.icon.alpha = 1;
    }

    onMouseOut() {
        //this.icon.alpha = 0;
    }


    onDragStart(event) {

        this.dragData.startX = event.data.global.x - this.location.x;
        this.dragData.startY = event.data.global.y - this.location.y;

        this.dragData.isDragging = true;

        this.emit('startDrag');

    }

    onDragMove(event) {
        if (this.dragData.isDragging) {

            this.location.set(event.data.global.x - this.dragData.startX, event.data.global.y - this.dragData.startY);

            this.updatePosition();
        }
    }

    updatePosition() {
        this.gfx.x = this.location.x;
        this.gfx.y = this.location.y;
    }

    onDragEnd(event) {

        this.dragData.isDragging = false;

        this.emit('stopDrag');
    }

    constrain(value, min, max) {
        return Math.min(Math.max(value, min), max)
    }

    repel(p) {
        let dir = Vector2.subtract(this.location, p.location);
        let d = dir.length();
        let force = -1 * this.strength / (d * d);
        dir.normalize().multiplyScalar(force);
        return dir;
    }
}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Repeller;