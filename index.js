/**
 * Created by STORMSEN on 29.06.2016.
 */

/*
 This is a bare-bones, no-bullshit
 example of using browserify + npm.
 */


// http://vanruesc.github.io/postprocessing/public/tone-mapping.html
// http://vanruesc.github.io/postprocessing/docs/

// Our third-party dependency from npm
var THREE = require('three');
var EffectComposer = require('three-effectcomposer')(THREE)
var POSTPROCESSING = require('postprocessing');
var raf = require('raf')


var container, stats;
var clock;
var camera, scene, renderer;
var composer;
var glitchPass, filmPass;
var cube, plane;
var targetRotation = 0;
var targetRotationOnMouseDown = 0;
var mouseX = 0;
var mouseXOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 150;
    camera.position.z = 500;

    scene = new THREE.Scene();

    // Cube
    var geometry = new THREE.BoxGeometry(200, 200, 200);
    for (var i = 0; i < geometry.faces.length; i += 2) {
        var hex = Math.random() * 0x00ffff;
        geometry.faces[i].color.setHex(hex);
        geometry.faces[i + 1].color.setHex(hex);
    }
    var material = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors, overdraw: 0.5});
    cube = new THREE.Mesh(geometry, material);
    cube.position.y = 150;
    scene.add(cube)

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xc3c3c3, .5);
    // renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    composer = new EffectComposer(renderer);
    composer.addPass(new POSTPROCESSING.RenderPass(scene, camera))

    glitchPass = new POSTPROCESSING.GlitchPass();
    glitchPass.renderToScreen = true;
    // composer.addPass(glitchPass);

    var params = {
        grayscale: true,
        sepia: false,
        vignette: true,
        eskil: false,
        scanlines: true,
        noise: true,
        noiseIntensity: 0.5,
        scanlineIntensity: 0.5,
        scanlineDensity: 3.0,
        greyscaleIntensity: 1.0,
        sepiaIntensity: 1.0,
        vignetteOffset: 0.0,
        vignetteDarkness: 0.5
    }

    filmPass = new POSTPROCESSING.FilmPass(params);
    filmPass.greyscale = true;
    filmPass.setSize(window.innerWidth, window.innerHeight)
    filmPass.renderToScreen = true;
    composer.addPass(filmPass);

    clock = new THREE.Clock(true);


    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    //
    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}
//
function onDocumentMouseDown(event) {
    event.preventDefault();
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mouseout', onDocumentMouseOut, false);
    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
}
function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
}
function onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}
function onDocumentMouseOut(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}
function onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
        targetRotationOnMouseDown = targetRotation;
    }
}
function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
    }
}


function animate() {
    raf(animate);
    render();
}
function render() {
    cube.rotation.y += ( targetRotation - cube.rotation.y ) * 0.05;
     renderer.render(scene, camera);
    //composer.render(clock.getDelta());
}


// You can also use built-in Node modules
var url = require('url');

// e.g.
console.log(url.parse(window.location.href));
