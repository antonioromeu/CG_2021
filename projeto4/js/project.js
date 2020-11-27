
var controls, camera, camera1, camera2, orthographicCamera, perspectiveCamera, scene, renderer;
var scale = 6;
var near = 1;
var clock;
var far = 1000 * scale;

var pink = new THREE.Color(0xb57aae);
var blue = new THREE.Color(0x55647e);
var green = new THREE.Color(0x64b1a4);
var ambar = new THREE.Color(0xcbbba1);
var brown = new THREE.Color(0x8e8270);
var white = new THREE.Color(0xffffff);
var black = new THREE.Color(0x191919);
var obsidian = new THREE.Color(0x0f1c29);
var grey = new THREE.Color(0x666666);
var copper = new THREE.Color(0x592a1d);
var red = new THREE.Color(0xbf0000);

var field;
var bKey = false, iKey = false, dKey = false, pKey = false, rKey = false, sKey = false, wKey = false;
var texture, bump, material;
var directionalLight;

function createField() {
    field = new THREE.Object3D();

    var bump_loader = new THREE.TextureLoader();
    bump = bump_loader.load("bumpMap.jpg");

    var texture_loader = new THREE.TextureLoader();
    texture = texture_loader.load("textureMap.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 8);

    // material = new THREE.MeshPhongMaterial({ bumpMap: bump, map: texture });
    material = new THREE.MeshBasicMaterial({ map: texture });
    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), material);
    mesh.material.side = THREE.DoubleSide;
    mesh.rotation.z = Math.PI / 2;
    mesh.rotation.x = -Math.PI / 2;
    field.position.set(0, 0, 0);
    field.add(mesh);
    scene.add(field);
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.background = 0xffffff;
    createDirectional(0, 0, 0);
}

function createDirectional(x, y, z) {
    'use strict';
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(x, y, z);
    scene.add(directionalLight);
}

function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, near, far);
    camera.position.set(100, 100, 100);
    camera.lookAt(scene.position);
    // controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.autoRotate = true;
    // controls.target.set(0, 0, 0);
    // controls.update();
}

function onResize() {
    'use strict';
    // resizeOrto(orthographicCamera);
    // resizePers(perspectiveCamera);
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    'use strict';

    var delta = clock.getDelta();

    renderer.render(scene, camera);
}

function init() {
    'use strict';
    clock = new THREE.Clock();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    createScene();
    createField();
    createCamera();
    // controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.addEventListener('change', render);
    // controls.enableZoom = false;
    // scene.add(field);
    render();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function onKeyDown(e) {
    'use strict';
    switch (e.keyCode) {
        case 66: // b
            bKey = !bKey;
            break;
        case 68: // d
            dKey = !dKey;
            break;
        case 73: // i
            iKey = !iKey;
            break;
        case 80: // p
            pKey = !pKey;
            break;
        case 82: // r
            rKey = !rKey;
            break;
        case 83: // s
            sKey = !sKey;
            break;
        case 87: // w
            wKey = !wKey;
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
    }
}

function onKeyUp(e) {
    'use strict';
    switch (e.keyCode) {
    }
}

function animate() {
    'use strict';
    // /*------------Q/W/E Key----------*/
    // if (qKey) {
    //     scene.remove(directionalLight);
    //     scene.add(directionalLight);
    // }
    // else if (!qKey)
    //     scene.remove(directionalLight);
    
    // /*------------Lights----------*/
    // if (light1) {
    //     scene.remove(spotLight1);
    //     scene.add(spotLight1);
    // }
    // else if (!light1)
    //     scene.remove(spotLight1);
    // if (light2) {
    //     scene.remove(spotLight2);
    //     scene.add(spotLight2);
    // }
    // else if (!light2)
    //     scene.remove(spotLight2);
    // if (light3) {
    //     scene.remove(spotLight3);
    //     scene.add(spotLight3);
    // }
    // else if (!light3)
    //     scene.remove(spotLight3);
    /// else if (!light3)
    //     scene.remove(spotLight3);

    // else if (!light3)
    //     scene.remove(spotLight3);

    render();
    requestAnimationFrame(animate);
    // controls.update();
    renderer.render(scene, camera);
}