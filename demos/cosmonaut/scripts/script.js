var $ = function(d) { return document.getElementById(d); }, 
Log = {
    elem: null,
    timer: null,

    getElem: function() {
        if (!this.elem) {
            return (this.elem = $('log-message'));
        }
        return this.elem;
    },

    write: function(text, hide) {
        if (this.timer) {
            this.timer = clearTimeout(this.timer);
        }

        var elem = this.getElem(),
            style = elem.parentNode.style;

        elem.innerHTML = text;
        style.display = '';

        if (hide) {
            this.timer = setTimeout(function() {
                style.display = 'none';
            }, 2000);
        }
    }
};

if (!Detector.webgl)
    Detector.addGetWebGLMessage();

var FLOOR = 0;
var container;
var camera, scene;
var webglRenderer;
var zmesh, geometry;
var mouseX = 0, mouseY = 0;
var windowHalfX;
var windowHalfY;

function init() {
    Log.write('Loading...');

    container = document.getElementById("container");

    // camera
    //camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.z = 75;

    //scene
    scene = new THREE.Scene();

    // renderer
    webglRenderer = new THREE.WebGLRenderer();
    //webglRenderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    webglRenderer.setSize(window.innerWidth, window.innerHeight);
    webglRenderer.domElement.style.position = "relative";
    container.appendChild(webglRenderer.domElement);

    // loader
    var loader = new THREE.JSONLoader(),
        callbackModel = function(geometry) { createScene(geometry,  90, FLOOR, -50, 105) };
    loader.load({ model: "scripts/cosmonaut.js", callback: callbackModel });
}

function createScene(geometry, x, y, z, b) {
    zmesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial());
    zmesh.position.set(-9.5, 1.7, 0);
    zmesh.scale.set(.4, .4, .4);
    scene.add(zmesh);

    Log.write('Done.', true);
}

function onDocumentMouseMove(event) {
    if (event.preventDefault) event.preventDefault();
    if (event.stopPropagation) event.stopPropagation();

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchMove(event) {
    if (event.preventDefault) event.preventDefault();
    if (event.stopPropagation) event.stopPropagation();

    onDocumentMouseMove(event.touches[0]);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    zmesh.rotation.set(mouseY/250 + 2, -mouseX/200, 0);
    webglRenderer.render(scene, camera);
}

function handleOrientation(event) {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    webglRenderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    webglRenderer.render(scene, camera);
}

document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('touchmove', onDocumentTouchMove, false);
window.addEventListener("deviceorientation", handleOrientation, true);

window.addEventListener("load", function () {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    init();
    animate();
}, false);

