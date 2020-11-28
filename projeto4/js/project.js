var clock, delta, controls, camera, scene, renderer;
var scale = 6;
var near = 1;
var far = 1000 * scale;
var phong = true, basic = false;

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

var bKey = false, iKey = true, dKey = false, pKey = false, rKey = false, sKey = true, wKey = false;
var field, ball, obj, flag, pole, planeMesh;
var fieldTexture, fieldBump, ballBump, cubeTexture, stopTexture;
var pointLight, directionalLight;
var xBall, zBall, newX, newZ, angle = 0, radius = 2;

ballBump = new THREE.TextureLoader().load("./img/ballBumpMap.jpg");
fieldBump = new THREE.TextureLoader().load("./img/bumpMap.jpg");
fieldTexture = new THREE.TextureLoader().load("./img/textureMap.jpg");
cubeTexture = new THREE.CubeTextureLoader().load([
    "./img/cubemap/px.png",
    "./img/cubemap/nx.png",
    "./img/cubemap/py.png",
    "./img/cubemap/ny.png",
    "./img/cubemap/pz.png",
    "./img/cubemap/nz.png",
])
stopTexture = new THREE.TextureLoader().load("./img/stop.jpg");

var ballPhong = new THREE.MeshPhongMaterial({ color: white, specular: white, wireframe: false, bumpMap: ballBump });
var flagPhong = new THREE.MeshPhongMaterial({ color: red, specular: red, wireframe: false, side: THREE.DoubleSide });
var polePhong = new THREE.MeshPhongMaterial({ color: grey, specular: grey, wireframe: false });
var fieldPhong = new THREE.MeshPhongMaterial({ bumpMap: fieldBump, wireframe: false, map: fieldTexture, side: THREE.DoubleSide });

var ballBasic = new THREE.MeshBasicMaterial({ color: white, wireframe: false });
var flagBasic = new THREE.MeshBasicMaterial({ color: red, wireframe: false, side: THREE.DoubleSide });
var poleBasic = new THREE.MeshBasicMaterial({ color: grey, wireframe: false });
var fieldBasic = new THREE.MeshBasicMaterial({ map: fieldTexture, wireframe: false, side: THREE.DoubleSide });

var ballMaterial = [ballPhong, ballBasic];
var flagMaterial = [flagPhong, flagBasic];
var poleMaterial = [polePhong, poleBasic];
var fieldMaterial = [fieldPhong, fieldBasic];  

function createField() {
    'use strict';
    fieldBump.wrapS = THREE.RepeatWrapping;
    fieldBump.wrapT = THREE.RepeatWrapping;
    fieldBump.repeat.set(6, 6);

    fieldTexture.wrapS = THREE.RepeatWrapping;
    fieldTexture.wrapT = THREE.RepeatWrapping;
    fieldTexture.repeat.set(6, 6);

    var fieldMaterial = new THREE.MeshPhongMaterial({ bumpMap: fieldBump, map: fieldTexture, side: THREE.DoubleSide });
    field = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), fieldMaterial);
    field.rotation.z = Math.PI / 2;
    field.rotation.x = -Math.PI / 2;
    field.position.set(0, 0, 0);
    scene.add(field);
}

function createBall() {
    'use strict';
    var ballMaterial = new THREE.MeshPhongMaterial({ color: white, specular: white, bumpMap: ballBump });
    ball = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 16), ballMaterial);
    ball.position.set(0, radius, 0);
    scene.add(ball);
}

function createFlag() {
    'use strict';
    obj = new THREE.Object3D();
    var radius = 0.7;
    var poleHeight = 20;
    var flagHeight = 8;
    
    var poleMaterial = new THREE.MeshPhongMaterial({ color: grey, specular: grey });
    pole = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, poleHeight, 16), poleMaterial);    
    obj.add(pole);

    var flagMaterial = new THREE.MeshPhongMaterial({ color: red, specular: red, side: THREE.DoubleSide })
    var flagGeometry = new THREE.Geometry();
    flagGeometry.vertices= [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, flagHeight, 0), new THREE.Vector3(flagHeight, flagHeight/2, flagHeight)];
    flagGeometry.faces = [new THREE.Face3(1, 0, 2)];
    flagGeometry.computeFaceNormals();
    flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.position.set(0, (poleHeight / 2) - flagHeight, 0);
    obj.add(flag);
    obj.position.set(20, poleHeight / 2, 20);
    scene.add(obj);
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.background = cubeTexture;
    createDirectional(50, 50, 50);
    createPoint(-30, 50, 0);
}

function createDirectional(x, y, z) {
    'use strict';
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(x, y, z);
    scene.add(directionalLight);
}

function createPoint(x, y, z) {
    'use strict';
    pointLight = new THREE.PointLight(0xffffff, 1, 0);
    pointLight.position.set(x, y, z);
    scene.add(pointLight);
}

function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, near, far);
    camera.position.set(250, 250, 250);
    camera.lookAt(scene.position);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.target.set(0, 0, 0);
    controls.update();
}

function ballRotation(delta) {
    'use strict';
    angle += 0.6 * delta;
    
    xBall = ball.position.x;
    zBall = ball.position.z;
    
    newX = 40 * Math.cos(angle) - 40;
    newZ = 30 * Math.sin(angle);

    ball.position.x = newX;
    ball.position.z = newZ;
}

function switchMaterial(i) {
    'use strict';
    ball.material = ballMaterial[i];
    pole.material = poleMaterial[i];
    flag.material = flagMaterial[i];
    field.material = fieldMaterial[i];
}

function showWarning() {
    'use strict';
    scene.remove(planeMesh);
    var camVector = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
    camVector.normalize();

    var planeGeometry = new THREE.PlaneGeometry(40, 40);
    var planeMaterial = new THREE.MeshBasicMaterial({ map: stopTexture });
    planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.lookAt(camVector);
    var dist = new THREE.Vector3();
    dist = camVector.multiplyScalar(220);
    planeMesh.position.set(dist.getComponent(0), dist.getComponent(1), dist.getComponent(2));
    scene.add(planeMesh);
}

function onResize() {
    'use strict';
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function resetScene() {
    'use strict';
    ball.position.set(0, radius, 0);
    obj.rotation.y = 0;
    angle = 0;
    scene.remove(planeMesh);
    scene.remove(directionalLight);
    scene.remove(pointLight);
    switchMaterial(0);
    ball.material.wireframe = false;
    pole.material.wireframe = false;
    flag.material.wireframe = false;
    field.material.wireframe = false;
    phong = true;
    basic = false;
    sKey = true;
    rKey = false;
    bKey = false;
    dKey = false;
    iKey = false;
    pKey = false;
    wKey = false;
    clock.start();
}

function render() {
    'use strict';
    if (iKey) {
        if (phong)
            switchMaterial(0);
        else if (basic)
            switchMaterial(1);
        phong = !phong;
        basic = !basic;
        iKey = !iKey;
    }
    var delta = clock.getDelta();
    if (sKey)
        obj.rotation.y += 1.2 * delta;
    if (bKey && sKey)
        ballRotation(delta);
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
    createBall();
    createFlag();
    render();
    window.addEventListener("keydown", onKeyDown);
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
            ball.material.wireframe = !ball.material.wireframe;
            pole.material.wireframe = !pole.material.wireframe;
            flag.material.wireframe = !flag.material.wireframe;
            field.material.wireframe = !field.material.wireframe;
            break;
    }
}

function animate() {
    'use strict';
    if (dKey) {
        scene.remove(directionalLight);
        scene.add(directionalLight);
    }
    else if (!dKey)
        scene.remove(directionalLight);
    
    if (pKey) {
        scene.remove(pointLight);
        scene.add(pointLight);
    }
    else if (!pKey)
        scene.remove(pointLight);
    
    if (sKey) {
        scene.remove(planeMesh);
        if (!clock.running)
            clock.start();
    }
    else if (!sKey && clock.running) {
        clock.stop();
        showWarning();
        if (rKey)
            resetScene();
    }

    render();
    requestAnimationFrame(animate);
    // controls.update();
    renderer.render(scene, camera);
}