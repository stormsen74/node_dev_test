/**
 * Created by STORMSEN on 29.06.2016.
 */



var raf = require('raf')

import Random from './random';
import Demo from './demo';

// http://www.2ality.com/


console.log('!>', Random.sign())

const init = () => {
    const demo = new Demo();
    const update = () => {
        raf(update);
        demo.update();
        demo.render();
    };
    const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        demo.resize(width, height)
    };
    window.addEventListener('resize', resize);
    resize();
    update();
};




if (document.readyState === 'complete') init()
else window.addEventListener('load', init);




//uglifyjs --compress --mangle --output dev.min.js --
//bundle.js





