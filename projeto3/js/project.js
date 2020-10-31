var camera, orthographicCamera, perspectiveCamera, scene, renderer;
var scale = 4;
var pink = new THREE.Color(0xb57aae);
var blue = new THREE.Color(0x55647e);
var green = new THREE.Color(0x64b1a4);
var ambar = new THREE.Color(0xcbbba1);
var brown = new THREE.Color(0x8e8270);
var white = new THREE.Color(0xffffff);
var near = 1;
var far = 1000 * scale;
var camera1;
var camera2;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function createPalanque() {
    var material = new THREE.MeshBasicMaterial({ color: blue, wireframe: false });
    var material = new THREE.MeshLambertMaterial({ color: blue, wireframe: false });
    var material = new THREE.MeshPhongMaterial({ color: blue, wireframe: false });
    var cylinder = new THREE.CylinderGeometry(40 * scale, 40 * scale, 20 * scale, 32);
    var mesh = new THREE.Mesh(cylinder, material);
    var palanque = new THREE.Object3D().add(mesh);
    scene.add(palanque);

    // scene.add(table.obj);
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.background = ambar;
    createPalanque();
}

function createCamera() {
    'use strict';
    var width = window.innerWidth;
    var height = window.innerHeight;
    perspectiveCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, near, far);
    perspectiveCamera.position.x = 400 * scale;
    perspectiveCamera.position.y = 400 * scale;
    perspectiveCamera.position.z = 400 * scale;
    camera = perspectiveCamera;
    orthographicCamera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, near, far);
    camera.lookAt(scene.position);
}

function onResize() {
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        window.resizeTo(window.innerWidth, window.innerHeight);
        camera.updateProjectionMatrix();
    }
}

function render() {
    'use strict';
    renderer.render(scene, camera);
    // var delta = clock.getDelta(); 
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();
    render();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function onKeyDown(e) {
    'use strict';
    switch (e.keyCode) {
        case 37: // left arrow
            leftArrow = true;
            break;
        case 39: // right arrow
            rightArrow = true;
            break;
        case 69:
            eKEy = true;
        case 81: // q
            qKey = true;
            break;
        case 49: // light 1
            light1 = !light1;
            break;
        case 50: // light 2
            light2 = !light2;
            break;
        case 51: // light 3
            light3 = !light3;
            break;
        case 52: // light 3
            camera1 = true;
            camera2 = false;
            break;
        case 53: // light 3
            camera2 = true;
            camera1 = false;
            break;
    }
}

function onKeyUp(e) {
    'use strict';
    switch (e.keyCode) {
        case 37: // left arrow
            leftArrow = false;
            break;
        case 39: // right arrow
            rightArrow = false;
            break;
    }
}

function animate() {
    'use strict';
    if (camera1) {
        perspectiveCamera.position.x = 400 * scale;
        perspectiveCamera.position.y = 400 * scale;
        perspectiveCamera.position.z = 400 * scale;
        camera = perspectiveCamera;
        camera.lookAt(scene.position);
    }

    else if (camera2) {
        orthographicCamera.position.x = 400 * scale;
        orthographicCamera.position.y = 400 * scale;
        orthographicCamera.position.z = 400 * scale;
        camera = orthographicCamera;
        camera.lookAt(scene.position);
    }

    render();
    requestAnimationFrame(animate);
}