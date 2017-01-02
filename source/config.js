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
    TAIL_LENGTH: 40
}

export const DEFAULT_SIZE = {
    WIDTH: 1280,
    HEIGHT: 720
}

export const SIM_DEFAULT = {
    MAX_PARTICLES: 10
}


export const INPUT_DATA = {
    POINTER_LOCATION: new Vector2(100, 100)
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

export const PALETTE = [
    0xFF4746,
    0xE8DA5E,
    0x92B55F,
    0x487D76
]

export const COLORS = {
    DEFAULT: [
        0xFF4746,
        0xE8DA5E,
        0x92B55F,
        0x487D76
    ],
    VENUS: [
        0x632416,
        0xcc3a00,
        0xff9e43,
        0xffdc79,
        0xffebad
    ],
    SHINYPHAN: [
        0x222222,
        0x0f2637,
        0x5d4d48,
        0xcce1e6,
        0xe9e0c9
    ]
}

export const SETTINGS = {
    iterations: 50,
    randomness: 0.25,
    opposite: 0.1,
    minAngle: 0.4,
    minSide: 2,
    system: {
        a1: 1,
        b1:-3,
        a2: 2,
        b2: -2
    }
}


