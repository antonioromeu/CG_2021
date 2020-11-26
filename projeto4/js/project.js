var camera, camera1, camera2, orthographicCamera, perspectiveCamera, scene, renderer;
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
// var palanque, body, glass, backLight, frontLight,  cylinder, carpete, tire1, tire2, tire2, tire3, tire4;
// var floor;
// var palanqueHeight = 5 * scale;
// var directionalLight; 
// var light1 = false, light2 = false, light3 = false;
// var obj, leftArrow = false, rightArrow = false;
// var qKey = true, eKey = false, wKey = false;
// var phong = true, lambert = false, basic = false;
var bKey = false, iKey = false, dKey = false, pKey = false, rKey = false, sKey = false, wKey = false;

function createField() {
    var texture, bump, material, plane;

    bump = THREE.ImageUtils.loadTexture("../img/bumpMap.jpg");

    // assuming you want the texture to repeat in both directions:
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    // how many times to repeat in each direction; the default is (1,1),
    //   which is probably why your example wasn't working
    // texture.repeat.set(4, 4); 

    material = new THREE.MeshPhongMaterial();
    material.bumpMap = bump;
    texture = THREE.ImageUtils.loadTexture("../img/textureMap.jpg");
    material.map = texture;
    plane = new THREE.Mesh(new THREE.PlaneGeometry(400, 3500), material);
    plane.material.side = THREE.DoubleSide;
    // plane.position.x = 100;

    // rotation.z is rotation around the z-axis, measured in radians (rather than degrees)
    // Math.PI = 180 degrees, Math.PI / 2 = 90 degrees, etc.
    plane.rotation.z = Math.PI / 2;

    scene.add(plane);
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.background = 0x000000;
}

function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, near, far);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    camera.position.set(0, 20, 100);
    // controls.update();
}

function onResize() {
    'use strict';
    resizeOrto(orthographicCamera);
    resizePers(perspectiveCamera);
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    'use strict';

    var delta = clock.getDelta();

    renderer.render(scene, camera);
    // if (wKey) {
    //     if (!basic)
    //         switchMaterial(2);
    //     else if (phong)
    //         switchMaterial(0);
    //     else if (lambert)
    //         switchMaterial(1);
    //     basic = !basic;
    //     wKey = !wKey;
    // }
  
    // if (eKey) {
    //     phong = !phong;
    //     lambert = !lambert;
    //     if (phong && !wKey)
    //         switchMaterial(0);
    //     else if (lambert && !wKey)
    //         switchMaterial(1);
    //     eKey = !eKey;
    // }
}

function init() {
    'use strict';
    clock = new THREE.Clock();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    createScene();
    createCamera();
    field = new THREE.Object3D();
    field.add(createField()); 
    // AMANHA RESOLVEMOS ISTO TA AQUI O ERRO O ROMEU DESCOBRIIU ++XP MT INTELIGENTE
    scene.add(flied);
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
    /*------------Q/W/E Key----------*/
    if (qKey) {
        scene.remove(directionalLight);
        scene.add(directionalLight);
    }
    else if (!qKey)
        scene.remove(directionalLight);
    
    /*------------Lights----------*/
    if (light1) {
        scene.remove(spotLight1);
        scene.add(spotLight1);
    }
    else if (!light1)
        scene.remove(spotLight1);
    if (light2) {
        scene.remove(spotLight2);
        scene.add(spotLight2);
    }
    else if (!light2)
        scene.remove(spotLight2);
    if (light3) {
        scene.remove(spotLight3);
        scene.add(spotLight3);
    }
    else if (!light3)
        scene.remove(spotLight3);

    render();
    requestAnimationFrame(animate);
    controls.update();
    renderer.render( scene, camera );
}