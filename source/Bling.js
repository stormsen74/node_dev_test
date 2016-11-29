/**
 * Created by STORMSEN on 29.11.2016.
 */

var PIXI = require('pixi.js');

class Bling extends PIXI.Sprite {
    constructor(ID) {
        super();

        this._id = ID;


        console.log(this)
    }

    get id() {
        return this._id;
    }
}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Bling;