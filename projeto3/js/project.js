var camera, camera1, camera2, orthographicCamera, perspectiveCamera, scene, renderer;
var scale = 6;
var near = 1;
var clock;
var far = 1000 * scale;
var spotLight1, spotLight2, spotLight3;
// var smesh1, smesh2, smesh3;
var slMeshes;

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

var palanque, body, glass, backLight, frontLight,  cylinder, carpete, tire1, tire2, tire2, tire3, tire4;
var floor;
var palanqueHeight = 5 * scale;
var directionalLight;
var light1 = false, light2 = false, light3 = false;
var obj, leftArrow = false, rightArrow = false;
var qKey = true, eKey = false, wKey = false;
var phong = true, lambert = false, basic = false;

var bodyPhong = new THREE.MeshPhongMaterial({color: grey, wireframe: false, shininess: 120, specular: grey});
var glassPhong = new THREE.MeshPhongMaterial({color: obsidian, wireframe: false, shininess: 50, specular: obsidian});
var backLightPhong = new THREE.MeshPhongMaterial({color: red, wireframe: false, shininess: 8, specular: white});
var frontLightPhong = new THREE.MeshPhongMaterial({color: white, wireframe: false, shininess: 8, specular: white});
var tirePhong = new THREE.MeshPhongMaterial({color: black, wireframe: false, shininess: 5, specular: black});
var cylinderPhong = new THREE.MeshPhongMaterial({color: copper, wireframe: false, shininess: 15, specular: copper/*[0.39, 0.24, 0.086014, 1.0]*/});

var bodyLambert = new THREE.MeshLambertMaterial({color: grey, wireframe: false});
var glassLambert = new THREE.MeshLambertMaterial({color: obsidian, wireframe: false});
var backLightLambert = new THREE.MeshLambertMaterial({color: red, wireframe: false});
var frontLightLambert = new THREE.MeshLambertMaterial({color: white, wireframe: false});
var tireLambert = new THREE.MeshLambertMaterial({color: black, wireframe: false});
var cylinderLambert = new THREE.MeshLambertMaterial({color: copper, wireframe: false});

//shing

var bodyBasic = new THREE.MeshBasicMaterial({color: grey, wireframe: false});
var glassBasic = new THREE.MeshBasicMaterial({color: obsidian, wireframe: false});
var backLightBasic = new THREE.MeshBasicMaterial({color: red, wireframe: false});
var frontLightBasic = new THREE.MeshBasicMaterial({color: white, wireframe: false});
var tireBasic = new THREE.MeshBasicMaterial({color: black, wireframe: false});
var cylinderBasic = new THREE.MeshBasicMaterial({color: copper, wireframe: false});

var bodyMaterial = [bodyPhong, bodyLambert, bodyBasic];
var glassMaterial = [glassPhong, glassLambert, glassBasic];
var frontLightMaterial = [frontLightPhong, frontLightLambert, frontLightBasic];
var backLightMaterial = [backLightPhong, backLightLambert, backLightBasic];
var tireMaterial = [tirePhong, tireLambert, tireBasic];
var cylinderMaterial = [cylinderPhong, cylinderLambert, cylinderBasic];
var spotlightMaterial = [bodyPhong, bodyLambert, bodyBasic];

function createCybertruck() {
    let toVectors = a => new THREE.Vector3(a[0] * scale, a[1] * scale, a[2] * scale);
    let toFaces = a => new THREE.Face3(a[0], a[1], a[2]);

    var verticesArray = [
        [0, 0, 0], // 0
        // right side
        [-8, 3, 6],
        [-8, 5, 6],
        [-10,7, 6],
        [-14, 7, 6],
        [-16, 5, 6], //5
        [7, 3, 6],
        [7, 5, 6],
        [9, 7, 6],
        [13, 7, 6],
        [15, 5, 6], //10

        //glass start
        [-14, 10, 6],
        [-4, 15, 6],
        [6, 13, 6],
        [6, 12, 6],
        //glass end

        [-16, 3, 6], //15
        [-18, 4, 6],
        [-18, 9, 6],
        [-4, 16, 6],
        [18, 12, 6],
        [17, 6, 6], // 20
        [15, 3, 6],

        // left side
        [-8, 3, -6],
        [-8, 5, -6],
        [-10,7, -6],
        [-14, 7, -6], //25
        [-16, 5, -6],
        [7, 3, -6],
        [7, 5, -6],
        [9, 7, -6],
        [13, 7, -6], //30
        [15, 5, -6],

        // left glass start
        [-14, 10, -6],
        [-4, 15, -6],
        [6, 13, -6],
        [6, 12, -6], // 35
        //left glass end

        [-16, 3, -6],
        [-18, 4, -6],
        [-18, 9, -6],
        [-4, 16, -6],
        [18, 12, -6], // 40
        [17, 6, -6],
        [15, 3, -6],

        // top glass
        [-15, 10.5, -5],
        [-4, 16, -5],
        [7, 14, -5], //45
        [-15, 10.5, 5],
        [-4, 16, 5],
        [7, 14, 5],

        // front
        [-18, 8, 6],
        [-18, 8, -6], //50

        //back
        [18 - 1/6, 11, 6],
        [18 - 1/6, 11, -6],

    ];

    var bodyVertices = verticesArray.map(toVectors);
    var facesArray = [
        //right side
        [5, 16, 15],
        [17, 16, 5],
        [17, 5, 4],
        [17, 4, 3],
        [19, 17, 3],
        [19, 3, 8],
        [8, 3, 2],
        [8, 2, 7],
        [7, 2, 1],
        [7, 1, 6],
        [19, 8, 9],
        [19, 9, 10],
        [20, 19, 10],
        [21, 20, 10],
        [17, 11, 18],
        [18, 11, 12],
        [17, 14, 11],
        [19, 14, 17],
        [19, 13, 14],
        [19, 12, 13],
        [18, 12, 19],

        //left side
        [26, 36, 37],
        [38, 26, 37],
        [38, 25, 26],
        [38, 24, 25],
        [40, 24, 38],
        [40, 29, 24],
        [29, 23, 24],
        [29, 28, 23],
        [28, 22, 23],
        [28, 27, 22],
        [40, 30, 29],
        [40, 31, 30],
        [41, 31, 40],
        [42, 31, 41],
        [38, 39, 32],
        [39, 33, 32],
        [38, 32, 35],
        [40, 38, 35],
        [40, 35, 34],
        [40, 34, 33],
        [39, 40, 33],


        //top front glass
        [43, 44, 46],
        [44, 46, 47],

        //top back glass
        [44, 47, 48],
        [44, 45, 48],

        //front
        [15, 36, 37],
        [37, 16, 15],
        [49, 37, 16],
        [37, 49, 50],
        [43, 38, 17],
        [46, 43, 17],
        [17, 18, 46],
        [46, 18, 47],
        [43, 39, 38],
        [39, 43, 44],

        //back
        [42, 41, 21],
        [41, 20, 21],
        [41, 51, 20],
        [41, 52, 51],
        [40, 48, 19],
        [48, 40, 45],
        [40, 39, 45],
        [45, 39, 44],
        [18, 19, 48],
        [48, 47, 18],

        //chassis
        [15, 21, 42],
        [15, 42, 36],
    ];

    var glassArray = [
        [14, 13, 11],
        [13, 12, 11],
        [35, 32, 34],
        [34, 32, 33],
        [44, 47, 48],
        [48, 45, 44],
        [46, 44, 43],
        [44, 46, 47],
    ];

    var frontLightArray = [
        [50, 49, 38],
        [49, 17, 38],
    ];

    var backLightArray = [
        [51, 52, 40],
        [40, 19, 51],
    ];

    var bodyFaces = facesArray.map(toFaces);
    var glassFaces = glassArray.map(toFaces);
    var frontLightFaces = frontLightArray.map(toFaces);
    var backLightFaces = backLightArray.map(toFaces);

    var bodyGeometry = new THREE.Geometry();
    var glassGeometry = new THREE.Geometry();
    var frontLightGeometry = new THREE.Geometry();
    var backLightGeometry = new THREE.Geometry();

    bodyGeometry.vertices = bodyVertices;
    bodyGeometry.faces = bodyFaces;
    bodyGeometry.computeFaceNormals();
    glassGeometry.vertices = bodyVertices;
    glassGeometry.faces = glassFaces;
    glassGeometry.computeFaceNormals();
    frontLightGeometry.vertices = bodyVertices;
    frontLightGeometry.faces = frontLightFaces;
    frontLightGeometry.computeFaceNormals();
    backLightGeometry.vertices = bodyVertices;
    backLightGeometry.faces = backLightFaces;
    backLightGeometry.computeFaceNormals();

    body = new THREE.Mesh(bodyGeometry, bodyMaterial[0]);
    glass = new THREE.Mesh(glassGeometry, glassMaterial[0]);
    frontLight = new THREE.Mesh(frontLightGeometry, frontLightMaterial[0]);
    backLight = new THREE.Mesh(backLightGeometry, backLightMaterial[0]);

    var obj = new THREE.Object3D();

    obj.add(body);
    obj.add(glass);
    obj.add(frontLight);
    obj.add(backLight);

    var r = 3.4 * scale;
    var tireGeometry = new THREE.CylinderGeometry(r, r, 3 * scale, 32);
    tire1 = new THREE.Mesh(tireGeometry, tireMaterial[0]);
    tire2 = new THREE.Mesh(tireGeometry, tireMaterial[0]);
    tire3 = new THREE.Mesh(tireGeometry, tireMaterial[0]);
    tire4 = new THREE.Mesh(tireGeometry, tireMaterial[0]);
    tire1.rotateX(Math.PI/2);
    tire2.rotateX(Math.PI/2);
    tire3.rotateX(Math.PI/2);
    tire4.rotateX(Math.PI/2);
    tire1.position.set(11 * scale, r, 4.5 * scale);
    tire2.position.set(-12 * scale, r, 4.5 * scale);
    tire3.position.set(11 * scale, r, -4.5 * scale);
    tire4.position.set(-12 * scale, r, -4.5 * scale);

    obj.add(tire1);
    obj.add(tire2);
    obj.add(tire3);
    obj.add(tire4);

    return obj;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function createPalanque() {
    var c = new THREE.CylinderGeometry(20 * scale, 20 * scale, palanqueHeight, 64);
    cylinder = new THREE.Mesh(c, cylinderMaterial[0]);
    cylinder.position.set(0, -palanqueHeight/2, 0);
    var obj = new THREE.Object3D().add(cylinder);
    return obj;
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.background = 0x000000;

    spotLight1 = createSpotLight(-21 * scale, 15 * scale, 14 * scale);
    spotLight2 = createSpotLight(10 * scale, 15 * scale, 10 * scale);
    spotLight3 = createSpotLight(14 * scale, 15 * scale, -21 * scale);
    createDirectional(50 * scale, 20 * scale, 50 * scale);
}

function createCamera() {
    'use strict';
    var width = window.innerWidth;
    var height = window.innerHeight;
    perspectiveCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, near, far);
    perspectiveCamera.position.x = 60 * scale;
    perspectiveCamera.position.y = 60 * scale;
    perspectiveCamera.position.z = 60 * scale;
    camera = perspectiveCamera;
    orthographicCamera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, near, far);
    camera.lookAt(scene.position);
}

function createSpotLight(x, y, z) {
    var body = new THREE.Object3D();
    var geometry = new THREE.SphereGeometry(20, 20, 20);
    var mesh = new THREE.Mesh(geometry, spotlightMaterial[0]);
    body.add(mesh);
    geometry = new THREE.ConeGeometry(24, 60, 20);
    mesh = new THREE.Mesh(geometry, spotlightMaterial[0]);
    mesh.rotateX(-Math.PI/2);
    mesh.position.set(0, 0, 5);
    body.add(mesh);
    body.position.set(x, y, z);
    body.lookAt(new THREE.Vector3(0, 0, 0));

    var spotLight = new THREE.SpotLight(blue, 1.5, 0, 1.2);
    spotLight.position.set(x, y, z);
    spotLight.castShadow = false;
    spotLight.add(body);
    return spotLight;
}

function createDirectional(x, y, z) {
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(x, y, z);
    scene.add(directionalLight);
}

function resizeOrto(camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    var m = Math.min(camera.aspect, 1/camera.aspect);
    camera.left = -window.innerWidth * camera.aspect / 2;
    camera.right = window.innerWidth * camera.aspect / 2;
    camera.top = camera.aspect*window.innerHeight / 2;
    camera.bottom = camera.aspect*-window.innerHeight / 2;
    camera.updateProjectionMatrix();
}

function resizePers(camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    // camera.left = -window.innerWidth / 2;
    // camera.right = window.innerWidth / 2;
    // camera.top = window.innerHeight / 2;
    // camera.bottom = -window.innerHeight / 2;
    camera.updateProjectionMatrix();
}

function onResize() {
    'use strict';
    resizeOrto(orthographicCamera);
    resizePers(perspectiveCamera);
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function switchMaterial(i) {
    body.material = bodyMaterial[i];
    glass.material = glassMaterial[i];
    cylinder.material = cylinderMaterial[i];
    frontLight.material = frontLightMaterial[i];
    backLight.material = backLightMaterial[i];
    tire1.material = tireMaterial[i];
    tire2.material = tireMaterial[i];
    tire3.material = tireMaterial[i];
    tire4.material = tireMaterial[i];
    carpete.material = tireMaterial[i];
    spotLight1.material = spotlightMaterial[i];
    spotLight2.material = spotlightMaterial[i];
    spotLight3.material = spotlightMaterial[i];
    // spotLight1.GetComponent<Renderer>().material = spotlightMaterial[i];
}

function render() {
    'use strict';

    var delta = clock.getDelta();

    renderer.render(scene, camera);
    if (wKey) {
        if (!basic)
            switchMaterial(2);
        else if (phong)
            switchMaterial(0);
        else if (lambert)
            switchMaterial(1);
        basic = !basic;
        wKey = !wKey;
    }
  
    if (eKey) {
        phong = !phong;
        lambert = !lambert;
        if (phong && !wKey)
            switchMaterial(0);
        else if (lambert && !wKey)
            switchMaterial(1);
        eKey = !eKey;
    }

    /*------------Arrow keys----------*/
    if (leftArrow)
        palanque.rotation.y -= 3 * delta;
    if (rightArrow)
        palanque.rotation.y += 3 * delta;
    
}

function init() {
    'use strict';
    clock = new THREE.Clock();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    createScene();
    createCamera();
    palanque = new THREE.Object3D();
    var cylinder = createPalanque();
    var cybertruck = createCybertruck();
    palanque.add(cylinder);
    palanque.add(cybertruck);
    scene.add(palanque);
    var carpeteGeometry = new THREE.BoxGeometry(60 * scale, 1, 60 * scale, 60, 0, 60);
    carpete = new THREE.Mesh(carpeteGeometry, tireMaterial[0]);
    carpete.position.set(0, -palanqueHeight, 0);
    scene.add(carpete);
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
        case 69: // e
            eKey = !eKey;
            break;
        case 81: // q
            qKey = !qKey;
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
        case 52: // camera 1
            camera1 = true;
            camera2 = false;
            break;
        case 53: // camera 2
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
    /*------------Cameras----------*/
    if (camera1) {
        perspectiveCamera.position.x = 60 * scale;
        perspectiveCamera.position.y = 60 * scale;
        perspectiveCamera.position.z = 60 * scale;
        perspectiveCamera.left = camera.left;
        perspectiveCamera.right = camera.right;
        perspectiveCamera.top = camera.top;
        perspectiveCamera.bottom = camera.bottom;
        camera = perspectiveCamera;
        camera.lookAt(scene.position);
    }
    else if (camera2) {
        orthographicCamera.position.x = 0 * scale;
        orthographicCamera.position.y = 0 * scale;
        orthographicCamera.position.z = 100 * scale;
        orthographicCamera.left = camera.left;
        orthographicCamera.right = camera.right;
        orthographicCamera.top = camera.top;
        orthographicCamera.bottom = camera.bottom;
        camera = orthographicCamera;
        camera.lookAt(scene.position);
    }

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
}