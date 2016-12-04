/**
 * Created by STORMSEN on 02.12.2016.
 */

import {Vector2} from './math/vector2';

// ——————————————————————————————————————————————————
// Config
// ——————————————————————————————————————————————————

export const DEFAULT_AGENT = {
    SEEK_MAX_SPEED: 10,
    SEEK_MAX_FORCE: .15,
    TAIL_LENGTH: 23
}

export const DEFAULT_SIZE = {
    WIDTH: 1280,
    HEIGHT: 720,
    RATIO: 1.777
}

export const SIM_DEFAULT = {
    MAX_PARTICLES: 10
}


export const INPUT_DATA = {
    POINTER_LOCATION: new Vector2(100,100)
}

//export const MOUSE_MASS_PRESSED = 150;
//export const MOUSE_MASS_NORMAL = 400;
//export const DISTRIBUTION = 2.8;
//export const TAIL_LENGTH = 12;
//export const THICKNESS = 0.8;
//export const MAX_FORCE = 8;
//export const FRICTION = 0.75;
//export const GRAVITY = 9.81;
//export const TOGGLE = 0.08;

export const COLORS = [
    0xFF4746,
    0xE8DA5E,
    0x92B55F,
    0x487D76
]

export const CLR = {
    PALETTE: []
}
