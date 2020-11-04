var camera, camera1, camera2, orthographicCamera, perspectiveCamera, scene, renderer;
var scale = 1;
var near = 1;
var far = 1000 * scale;
var spotLight1, spotLight2, spotLight3;
var pink = new THREE.Color(0xb57aae);
var blue = new THREE.Color(0x55647e);
var green = new THREE.Color(0x64b1a4);
var ambar = new THREE.Color(0xcbbba1);
var brown = new THREE.Color(0x8e8270);
var white = new THREE.Color(0xffffff);
var palanque;
var directionalLight;
var light1 = false, light2 = false, light3 = false;
var obj, leftArrow = false, rightArrow = false;
var qKey = true, eKey = false;

function createCybertruck() {
    let toVectors = a => new THREE.Vector3(a[0], a[1], a[2]);
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

    var lightArray = [
        [50, 49, 38],
        [49, 17, 38],
        [51, 52, 40],
        [40, 19, 51],
    ];

    var bodyFaces = facesArray.map(toFaces);
    var glassFaces = glassArray.map(toFaces);
    var lightFaces = lightArray.map(toFaces);

    var bodyGeometry = new THREE.Geometry();
    var bodyMaterial = new THREE.MeshPhongMaterial({color: pink, wireframe: false})

    var glassGeometry = new THREE.Geometry();
    var glassMaterial = new THREE.MeshPhongMaterial({color: blue, wireframe: false})

    var lightGeometry = new THREE.Geometry();
    var lightMaterial = new THREE.MeshPhongMaterial({color: white, wireframe: false})


    bodyGeometry.vertices = bodyVertices;
    bodyGeometry.faces = bodyFaces;
    bodyGeometry.computeFaceNormals();
    glassGeometry.vertices = bodyVertices;
    glassGeometry.faces = glassFaces;
    glassGeometry.computeFaceNormals();
    lightGeometry.vertices = bodyVertices;
    lightGeometry.faces = lightFaces;
    lightGeometry.computeFaceNormals();

    var body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    var glass = new THREE.Mesh(glassGeometry, glassMaterial);
    var light = new THREE.Mesh(lightGeometry, lightMaterial);

    obj = new THREE.Object3D();
    obj.add(body);
    obj.add(glass);
    obj.add(light);

    var r = 3.4;
    var tireGeometry = new THREE.CylinderGeometry(r, r, 3, 32);
    var tireMaterial = new THREE.MeshPhongMaterial({color: green, wireframe: false})
    var tire1 = new THREE.Mesh(tireGeometry, tireMaterial);
    var tire2 = new THREE.Mesh(tireGeometry, tireMaterial);
    var tire3 = new THREE.Mesh(tireGeometry, tireMaterial);
    var tire4 = new THREE.Mesh(tireGeometry, tireMaterial);
    tire1.rotateX(Math.PI/2);
    tire2.rotateX(Math.PI/2);
    tire3.rotateX(Math.PI/2);
    tire4.rotateX(Math.PI/2);
    tire1.position.set(11, r, 4.5);
    tire2.position.set(-12, r, 4.5);
    tire3.position.set(11, r, -4.5);
    tire4.position.set(-12, r, -4.5);
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
    var material = new THREE.MeshPhongMaterial({ color: blue, wireframe: false });
    var cylinder = new THREE.CylinderGeometry(20 * scale, 20 * scale, 5 * scale, 64);
    var mesh = new THREE.Mesh(cylinder, material);
    mesh.position.set(0, -5/2 * scale, 0);
    palanque = new THREE.Object3D().add(mesh);
    return palanque;
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.background = ambar;

    spotLight1 = createSpotLight(-35 * scale, 40 * scale, 20 * scale);
    spotLight2 = createSpotLight(-10 * scale, 50 * scale, -10 * scale);
    spotLight3 = createSpotLight(20 * scale, 40 * scale, -35 * scale);
    createDirectional(50 * scale, 20 * scale, 50 * scale);  
}

function createCamera() {
    'use strict';
    var width = window.innerWidth;
    var height = window.innerHeight;
    perspectiveCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, near, far);
    perspectiveCamera.position.x = -45 * scale;
    perspectiveCamera.position.y = 50 * scale;
    perspectiveCamera.position.z = 0 * scale;
    camera = perspectiveCamera;
    orthographicCamera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, near, far);
    // orthographicCamera.position.x = 60 * scale;
    // orthographicCamera.position.y = 0 * scale;
    // orthographicCamera.position.z = 0 * scale;
    // camera = orthographicCamera;
    camera.lookAt(scene.position);
}

function createSpotLight(x, y, z) {
    var body = new THREE.Object3D();
    var materialb = new THREE.MeshPhongMaterial( {color: 0x2884a6} );
    geometry = new THREE.ConeGeometry(6 * scale, 15 * scale, 200 * scale);
    mesh = new THREE.Mesh(geometry, materialb);
    mesh.rotateX(Math.PI/2);
    mesh.position.set(0 * scale, 0 * scale, 5 * scale);
    body.add(mesh);
    body.position.set(x, y, z);
    body.lookAt(new THREE.Vector3(0, 0, 0));

    var spotLight = new THREE.SpotLight(0xffffff, 0.7, 0, 1.2);
    spotLight.position.set(x, y, z);
    spotLight.castShadow = false;
    spotLight.add(body);
    // scene.add(spotLight);
    return spotLight;
}

function createDirectional(x, y, z) {
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(x, y, z);
    scene.add(directionalLight);
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
    palanque = createPalanque();
    var cybertruck = createCybertruck();
    palanque.add(cybertruck);
    scene.add(palanque);
    var carpeteGeometry = new THREE.PlaneGeometry(60, 60);
    var carpeteMaterial = new THREE.MeshBasicMaterial( {color: green} );
    var carpete = new THREE.Mesh(carpeteGeometry, carpeteMaterial);
    carpete.position.set(0, -5 * scale, 0);
    carpete.rotateZ(Math.PI/2);
    carpete.rotateY(Math.PI/2);
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
        case 69:
            eKey = !eKey;
        case 81: // q
            qKey = !qKey;
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
        case 52: 
            camera1 = true;
            camera2 = false;
            break;
        case 53:
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
        perspectiveCamera.position.x = 30 * scale;
        perspectiveCamera.position.y = 30 * scale;
        perspectiveCamera.position.z = 30 * scale;
        camera = perspectiveCamera;
        camera.lookAt(scene.position);
    }
    else if (camera2) {
        orthographicCamera.position.x = 40 * scale;
        orthographicCamera.position.y = 40 * scale;
        orthographicCamera.position.z = 40 * scale;
        camera = orthographicCamera;
        camera.lookAt(scene.position);
    }
    if (qKey) {
        scene.remove(directionalLight);
        scene.add(directionalLight);
    }
    else if (!qKey) scene.remove(directionalLight);
    if (light1) {
        scene.remove(spotLight1);
        scene.add(spotLight1);
    }
    else if (!light1) scene.remove(spotLight1);
    if (light2) {
        scene.remove(spotLight2);
        scene.add(spotLight2);
    }
    else if (!light2) scene.remove(spotLight2);
    if (light3) {
        scene.remove(spotLight3);
        scene.add(spotLight3);
    }
    else if (!light3) scene.remove(spotLight3);
    
    if (leftArrow) {
        palanque.rotation.y -= 0.03;
    }
    if (rightArrow) {
        palanque.rotation.y += 0.03;
    }

    render();
    requestAnimationFrame(animate);
}