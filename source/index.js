/**
 * Created by STORMSEN on 29.06.2016.
 */



var raf = require('raf')
import Random from './random';
import Demo from './demo';


console.log('!>',Random.sign())

const init = () => {
    const demo = new Demo();
    //const renderer = new Renderer();
    const update = () => {
        raf(update);
        demo.update();
        demo.render();
        //renderer.render(simulation);
    };
    const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        demo.resize(width, height)
        //renderer.resize(width, height);
    };
    //document.body.appendChild(renderer.canvas);
    window.addEventListener('resize', resize);
    resize();
    update();
};



if (document.readyState === 'complete') init()
else window.addEventListener('load', init);





