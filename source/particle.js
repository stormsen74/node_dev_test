/**
 * Created by STORMSEN on 24.11.2016.
 */


class Particle {
    constructor(x = 0, y = 0, mass = 1) {
        this._position = {
            x: x,
            y: y
        }

        this.mass = mass;
    }

    set x(v) {
        this._position.x = v;
    }

    get position() {
        return this._position;
    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Particle;