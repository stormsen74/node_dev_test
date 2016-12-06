/**
 * Created by STORMSEN on 01.12.2016.
 */

import {Vector2} from './math/vector2';
import Agent from './particles/agent';
import ParticleSystem from './particles/pSystem';
import Repeller from './particles/repeller';
import Attractor from './particles/attractor';
import Sim from './sim';
import Random from './random'

import { SIM_DEFAULT } from './config';
import { INPUT_DATA } from './config';

class Sim_04 extends Sim {

    constructor(_size) {
        super()

        this.size = _size;

        this.repeller = new Repeller(new Vector2(200, 300), 30)
        this.attractor = new Attractor(new Vector2(_size.WIDTH * .5, _size.HEIGHT * .5), 40)

        let origin = new Vector2(_size.WIDTH * .5, _size.HEIGHT * .5)
        this.GRAVITY = new Vector2(0, .01)


        this.pSystem = new ParticleSystem(_size, origin);

        this.addChild(this.repeller)
        this.addChild(this.attractor)
        this.addChild(this.pSystem)

        //this.init();
        this.update();
    }

    onPointerDown(event) {
        this.vMouse.pressed = true;
        this.pSystem.addParticle(this.vMouse, .5 + Math.random() * 2);
    }

    onPointerUp(event) {
        this.vMouse.pressed = false;
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

        this.pSystem.update();
        //this.pSystem.applyForce(this.GRAVITY);
        this.pSystem.applyRepeller(this.repeller);
        this.pSystem.applyAttractor(this.attractor);
        //this.pSystem.seek(this.vMouse);


        // inherit
        if (this.vMouse.pressed) {
            //this.pSystem.addParticle(this.vMouse)
        }

    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sim_04;