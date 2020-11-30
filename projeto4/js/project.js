var clock, delta, controls, camera, perspectiveCamera, pauseCamera, scene, pauseScene, renderer;
var near = 1;
var far = 100000;
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
var skybox, field, ball, obj, pauseObj, flag, pole, planeMesh;
var fieldTexture, fieldBump, ballBump, cubeTexture, stopTexture;
var pointLight, directionalLight;
var xBall, zBall, newX, newZ, angle = 0, radius = 15;

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
cubeTexture1 = new THREE.TextureLoader().load("./img/cubemap/px.png");
cubeTexture2 = new THREE.TextureLoader().load("./img/cubemap/nx.png");
cubeTexture3 = new THREE.TextureLoader().load("./img/cubemap/py.png");
cubeTexture4 = new THREE.TextureLoader().load("./img/cubemap/ny.png");
cubeTexture5 = new THREE.TextureLoader().load("./img/cubemap/pz.png");
cubeTexture6 = new THREE.TextureLoader().load("./img/cubemap/nz.png");

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
    fieldBump.repeat.set(2, 2);

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
    var radius = 2;
    var poleHeight = 60;
    var flagHeight = 16;
    
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
    obj.position.set(40, poleHeight / 2, 40);
    scene.add(obj);
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    createDirectional(50, 50, 50);
    createPoint(-30, 50, 0);
}

function createPauseScene() {
    'use strict';
    pauseScene = new THREE.Scene();
    pauseScene.add(skybox);
    pauseScene.add(pauseCamera);
    pauseCamera.lookAt(new THREE.Vector3(0, 0, 0));
    pauseObj = new THREE.Object3D();
    var geometry = new THREE.BoxGeometry(150, 150, 150);
    var material = new THREE.MeshBasicMaterial({ map: stopTexture });
    var mesh = new THREE.Mesh(geometry, material);
    pauseObj.add(mesh);
    pauseObj.position.set(0, 0, 0);
    pauseScene.add(pauseObj);
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
    perspectiveCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, near, far);
    perspectiveCamera.position.set(250, 250, 250);
    perspectiveCamera.lookAt(scene.position);
    controls = new THREE.OrbitControls(perspectiveCamera, renderer.domElement);
    controls.enableZoom = false;
    pauseCamera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, near, far);
    pauseCamera.position.set(500, 0, 0);
    pauseCamera.lookAt(scene.position);
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

function onResize() {
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);  
    perspectiveCamera.aspect = window.innerWidth / window.innerHeight;
    perspectiveCamera.updateProjectionMatrix();
    pauseCamera.aspect = window.innerWidth / window.innerHeight;
    pauseCamera.updateProjectionMatrix();
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
    renderer.clearDepth();
    camera = perspectiveCamera;
    renderer.render(scene, camera);
    clock.start();
}

function render() {
    'use strict';

    renderer.autoClear = false;
    renderer.clear();
    renderer.render(scene, camera);

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
    if (sKey) {
        renderer.clearDepth();
        camera = perspectiveCamera;
        renderer.render(scene, camera);
        obj.rotation.y += 1.2 * delta;
    }
    else {
        renderer.clearDepth();
        camera = pauseCamera;
        renderer.render(pauseScene, camera);
        camera.lookAt(pauseScene.position);
        // pauseCamera.position.x = 0 * scale;
        // pauseCamera.position.y = 0 * scale;
        // pauseCamera.position.z = 100 * scale;
        // pauseCamera.left = camera.left;
        // pauseCamera.right = camera.right;
        // pauseCamera.top = camera.top;
        // pauseCamera.bottom = camera.bottom;
    }
    if (bKey && sKey)
        ballRotation(delta);
    
    controls.update();
}

function init() {
    'use strict';
    camera = new THREE.Camera();
    clock = new THREE.Clock();
    var cubeShader = THREE.ShaderLib.cube;
    cubeShader.uniforms.tCube.value = cubeTexture;
    cubeShader.uniforms.opacity.value = 1;
    var skyboxMaterial = new THREE.ShaderMaterial({
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        side: THREE.BackSide
    });
    skybox = new THREE.Mesh(new THREE.BoxBufferGeometry(10000, 10000, 10000), skyboxMaterial);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    createScene();
    createField();
    createCamera();
    createPauseScene();
    createBall();
    createFlag();
    render();
    scene.add(skybox);
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
        if (rKey)
            resetScene();
    }

    render();
    requestAnimationFrame(animate);
}



// var materialArray = [];
// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/dawnmountain-xpos.png' ) }));
// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/dawnmountain-xneg.png' ) }));
// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/dawnmountain-ypos.png' ) }));
// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/dawnmountain-yneg.png' ) }));
// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/dawnmountain-zpos.png' ) }));
// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/dawnmountain-zneg.png' ) }));
// for (var i = 0; i < 6; i++)
//    materialArray[i].side = THREE.BackSide;
// var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
// var skyboxGeom = new THREE.CubeGeometry( 5000, 5000, 5000, 1, 1, 1 );
// var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
// scene.add( skybox );

