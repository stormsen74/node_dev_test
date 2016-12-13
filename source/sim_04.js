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
import {SETTINGS} from './config';

class Sim_04 extends Sim {

    constructor(_size) {
        super()

        this.size = _size;


        this.repeller = new Repeller(new Vector2(900, 250), 100);
        this.repeller.on('startDrag', this.onStartDrag.bind(this));
        this.repeller.on('stopDrag', this.onStopDrag.bind(this));

        this.attractor = new Attractor(new Vector2(_size.WIDTH * .5, _size.HEIGHT * .5), 60)
        this.attractor.on('startDrag', this.onStartDrag.bind(this));
        this.attractor.on('stopDrag', this.onStopDrag.bind(this));

        this.attractor2 = new Attractor(new Vector2(_size.WIDTH * .5 + 100, _size.HEIGHT * .5 + 100), 40)
        this.attractor2.on('startDrag', this.onStartDrag.bind(this));
        this.attractor2.on('stopDrag', this.onStopDrag.bind(this));

        let origin = new Vector2(_size.WIDTH * .5, _size.HEIGHT * .5)
        this.GRAVITY = new Vector2(0, .5)


        this.pSystem = new ParticleSystem(_size, origin);

        this.addChild(this.pSystem)
        this.addChild(this.attractor)
        this.addChild(this.attractor2)
        this.addChild(this.repeller)

        //this.init();
        this.update();

        this.gui = new dat.GUI();
        this.gui.add(SETTINGS, 'minSide').min(0).max(100).name('Min Side Length');
        this.gui.add(SETTINGS, 'minAngle').min(0.0).max(1.2).step(0.01).name('Min Angle (rad)');
        this.gui.add(SETTINGS, 'iterations').min(1).max(100).name('Iterations');
        this.gui.add(SETTINGS, 'randomness').min(0.0).max(1.0).step(0.01).name('Randomness');
        this.gui.add(SETTINGS, 'opposite').min(0.0).max(1.0).step(0.01).name('Opposite Sides');
        this.gui.add(this, 'test').name('Start / Stop');
        this.gui.close();


    }


    test() {
        console.log('call', SETTINGS.minSide)

    }


    onStartDrag() {
        this.vMouse.emit = false;
    }

    onStopDrag() {
        this.vMouse.emit = true;
    }


    addParticle() {
        this.pSystem.addParticle(mathUtils.getRandomBetween(1, 5), this.vMouse);
    }

    spread() {
        if (this.vMouse.pressed && this.vMouse.emit) {
            TweenMax.delayedCall(.05, this.spread.bind(this))
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
        this.pSystem.applyFriction(0.1);
        //this.pSystem.applyAttractor(this.attractor);
        //this.pSystem.applyRepeller(this.repeller);
        this.pSystem.flee(this.vMouse);
        //this.pSystem.seek(this.vMouse);
        // this.pSystem.separate();
        // this.pSystem.applyForce(this.GRAVITY);


        this.pSystem.update();
        //this.pSystem.drawTail();


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