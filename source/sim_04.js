/**
 * Created by STORMSEN on 01.12.2016.
 */

var gsap = require('gsap')

import {Vector2} from './math/vector2';
import Agent from './particles/agent';
import ParticleSystem from './particles/pSystem';
import Repeller from './particles/repeller';
import Attractor from './particles/attractor';
import mathUtils from './utils/mathUtils';
import Sim from './sim';
import Random from './random'

import {SIM_DEFAULT} from './config';
import {INPUT_DATA} from './config';

class Sim_04 extends Sim {

    constructor(_size) {
        super()

        this.size = _size;

        this.repeller = new Repeller(new Vector2(200, 300), 30)
        this.attractor = new Attractor(new Vector2(_size.WIDTH * .5, _size.HEIGHT * .5), 60)

        let origin = new Vector2(_size.WIDTH * .5, _size.HEIGHT * .5)
        this.GRAVITY = new Vector2(0, .5)


        this.pSystem = new ParticleSystem(_size, origin);

        this.addChild(this.repeller)
        this.addChild(this.attractor)
        this.addChild(this.pSystem)

        //this.init();
        this.update();


    }

    addParticle() {
        this.pSystem.addParticle(mathUtils.getRandomBetween(1, 9), this.vMouse);
    }

    spread() {
        if (this.vMouse.pressed) {
            TweenMax.delayedCall(.1, this.spread.bind(this))
            this.addParticle();
        }
    }

    onPointerDown(event) {
        this.vMouse.pressed = true;
        this.spread();
    }

    onPointerUp(event) {
        this.vMouse.pressed = false;
        TweenMax.killDelayedCallsTo(this.spread)
    }


    onPointerMove(event) {
        const {clientX: x, clientY: y} = (
            event.changedTouches ? event.changedTouches[0] : event
        );
        this.vMouse.x = x - parseInt(document.getElementById('screen').style.left);
        this.vMouse.y = y - parseInt(document.getElementById('screen').style.top);

        INPUT_DATA.POINTER_LOCATION.set(this.vMouse.x, this.vMouse.y)


        if (this.vMouse.pressed) {
        }

        //console.log(this.vMouse)
    }


    update() {

        //this.pSystem.wander(-.1, .1);
        // this.pSystem.applyRepeller(this.repeller);
        this.pSystem.applyFriction(0.05);
        this.pSystem.applyAttractor(this.attractor);
        // this.pSystem.flee(this.vMouse);
        // this.pSystem.applyForce(this.GRAVITY);


        this.pSystem.update();
        this.pSystem.drawTail();


        // inherit
        if (this.vMouse.pressed) {
            //this.pSystem.addParticle(mathUtils.getRandomBetween(1, 10), this.vMouse)
        }

    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sim_04;