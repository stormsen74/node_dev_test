/**
 * Created by STORMSEN on 06.12.2016.
 */


class mathUtils {

    constructor() {

    }

    static getRandomBetween(max = .5, min = 0) {
        return min + Math.random() * (max - min);
    }
}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default mathUtils;