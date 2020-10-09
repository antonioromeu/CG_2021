var horizontal = true, vertical = false;
var camera, scene, renderer;
var geometry, mesh, cube;
var lowerMobile, middleMobile, upperMobile;
var scale = 5;
var stdRadius = scale / 12;
var cylinderHeight = scale * 1, cylinderRadius = scale / 4;
var rotate_v1_r, rotate_v1_l, rotate_v2_r, rotate_v2_l, rotate_v3_r, rotate_v3_l;
var xs_l, ys_l, radius_l, heights_l, orientations_l;
var xs_m, ys_m, radius_m, heights_m, orientations_m;
var xs_u, ys_u, radius_u, heights_u, orientations_u;
var leftArrow, topArrow, rightArrow, downArrow;
var camera1, camera2, camera3;
var near = 1, far = 1500;
var i;
var material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });

function addCylinder(obj, x, y, z, r1, r2, height, horizontal) {
    'use strict';
    geometry = new THREE.CylinderGeometry(scale *  r1, scale * r2, scale * height, 16);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(scale * x, scale * y, scale * z);
    if (horizontal)
        mesh.rotateZ(Math.PI/2);
    obj.add(mesh);
}

function addCube(obj, x, y, z, a, diagonal) {
    'use strict';
    geometry = new THREE.BoxGeometry(a * scale, a * scale, a * scale);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(scale * x, scale * y, scale * z);
    if (diagonal)
        mesh.rotateZ(Math.PI/4);
    obj.add(mesh);
}

function addPlanet(obj, x, y, z, a) {
    'use strict';
    geometry = new THREE.SphereGeometry(a * scale, a * scale, a * scale);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(scale * x, scale * y, scale * z);
    obj.add(mesh);
}

function createLowerMobile(x, y, z) {
    'use strict';
    lowerMobile = new THREE.Object3D();
    //3a 3b 3c 3d 7 3e 3f 3g 3h 3i 3j 3k 3l 3m 9 8 10 11
    xs_l = [0, -3, 2, -8, -8, 6, -2, 14, 19, 10, 28, 9, 4, 14, 4, -2, 28, 14];
    ys_l = [-2, -4, -8, -6, -10, -12, -14, -14, -16, -18, -18, -20, -23, -22, -28, -17, -21, -25];
    radius_l = [stdRadius, stdRadius, stdRadius, stdRadius, cylinderRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, cylinderRadius];
    heights_l = [4, 10, 8, 4, cylinderHeight, 16, 4, 4, 18, 4, 4, 10, 6, 4, cylinderHeight];
    orientations_l = [vertical, horizontal, vertical, vertical, vertical, horizontal, vertical, vertical, horizontal, vertical, vertical, horizontal, vertical, vertical, vertical];
    
    for (i = 0; i < 15; i++) {
        addCylinder(lowerMobile, xs_l[i], ys_l[i], 0, radius_l[i], radius_l[i], heights_l[i], orientations_l[i]);
    }
    for (; i < 18; i++) {
        addCube(lowerMobile, xs_l[i], ys_l[i], 0, 2, false);
    }

    lowerMobile.position.x = x;
    lowerMobile.position.y = y;
    lowerMobile.position.z = z;

    return lowerMobile;
}

function createMiddleMobile(x, y, z) {
    'use strict';
    middleMobile = new THREE.Object3D();
    createLowerMobile(scale * (-6), scale * (-40), scale * 0);
    middleMobile.add(lowerMobile);
    
    xs_m = [0, -3, 4, -10, -10, 2, -4, 8, 10, 4, 16, 11, 4, 18, 18, 6, 0, 12, 5, 16, -4, 4, 16, 0];
    ys_m = [-3, -6, -7, -10, -12, -8, -9, -14, -20, -21, -23, -26, -27, -28, -32, -28, -29, -34, -40, -41, -11, -23, -43, -31];
    radius_m = [stdRadius, stdRadius, stdRadius, stdRadius, cylinderRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, cylinderRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius];
    heights_m = [6, 14, 2, 8, 4, 12, 2, 12, 12, 2, 6, 14, 2, 4, 4, 12, 2, 12, 22, 2];
    orientations_m = [vertical, horizontal, vertical, vertical, vertical, horizontal, vertical, vertical, horizontal, vertical, vertical, horizontal, vertical, vertical, vertical, horizontal, vertical, vertical, horizontal, vertical];

    for (i = 0; i < 20; i++) {
        addCylinder(middleMobile, xs_m[i], ys_m[i], 0, radius_m[i], radius_m[i], heights_m[i], orientations_m[i]);
    }
    for (; i < 24; i++) {
        addCube(middleMobile, xs_m[i], ys_m[i], 0, 2, false);
    }

    middleMobile.position.x = x;
    middleMobile.position.y = y;
    middleMobile.position.z = z;

    return middleMobile;
}

function createUpperMobile(x, y, z) {
    'use strict';
    upperMobile = new THREE.Object3D();
    createMiddleMobile(scale * (-24), scale * (-4), scale * 0);
    upperMobile.add(middleMobile);
    
    xs_u = [0, -7, 10, 8, 4, 12, 5, 2, 8];
    ys_u = [-2, -4, -6, -8, -10, -18, -12, -25, -15];
    radius_u = [stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius];
    heights_u = [4, 34, 4, 8, 4, 20, 6, 26, 6];
    orientations_u = [vertical, horizontal, vertical, horizontal, vertical, vertical, horizontal, vertical, vertical];

    for (i = 0; i < 9; i++) {
        addCylinder(upperMobile, xs_u[i], ys_u[i], 0, radius_u[i], radius_u[i], heights_u[i], orientations_u[i]);
    }

    //estrela
    addCube(upperMobile, 8, -19, 0, 2, false);
    addCube(upperMobile, 8, -19, 0, 2, true);

    //planeta
    addPlanet(upperMobile, 12, -30, 0, 3);

    upperMobile.position.x = x;
    upperMobile.position.y = y;
    upperMobile.position.z = z;
    
    scene.add(upperMobile);
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper(10));
    createUpperMobile(0, 100, 0);
}

function createCamera() {
    'use strict';
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, near, far);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 200;
    camera.lookAt(scene.position);
}

function onResize() {
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}

function onKeyDown(e) {
    'use strict';
    switch (e.keyCode) {
        case 37: // left arrow
            leftArrow = true;
            break;
        case 38: // top arrow
            topArrow = true;
            break;
        case 39: // right arrow
            rightArrow = true;
            break;
        case 40: // down arrow
            downArrow = true;
            break;
        case 49: // 1 frontal view
        case 97: // 1 frontal view
            camera1 = true;
            break;
        case 50: // 2 top view
        case 98: // 2 top view
            camera2 = true;
            break;
        case 51: // 3 side view
        case 99: // 3 side view
            camera3 = true;
            break;
        case 52: // 4 alternate mesh
        case 100: // 4 alternate mesh
            material.wireframe = !material.wireframe;
            break;
        case 81: // Q/q --- rodar para a esquerda angulo v1
            rotate_v1_l = true;
            break;
        case 87: // W/w -- rodar para a direita angulo v1
            rotate_v1_r = true;
            break;
        case 65: // A/a --- rodar para a esquerda angulo v2
            rotate_v2_l = true;
            break;
        case 67: // C/c --- rodar para a direita angulo v2
            rotate_v2_r = true;
            break;
        case 68: // D/d --- rodar para a esquerda angulo v3
            rotate_v3_l = true;
            break;
        case 90: // Z/z --- rodar para a direita angulo v3
            rotate_v3_r = true;
            break;
        case 69:  // E
        case 101: // e
            scene.traverse(function (node) {
                if (node instanceof THREE.AxisHelper) {
                    node.visible = !node.visible;
                }
            });
            break;
    }
}

function onKeyUp(e) {
    'use strict';
    switch (e.keyCode) {
        case 37: // left arrow
            leftArrow = false;
            break;
        case 38: // top arrow
            topArrow = false;
            break;
        case 39: // right arrow
            rightArrow = false;
            break;
        case 40: // down arrow
            downArrow = false;
            break;
        case 49: // 1 frontal view
        case 97: // 1 frontal view
            camera1 = false;
            break;
        case 50: // 2 top view
        case 98: // 2 top view
            camera2 = false;
            break;
        case 51: // 3 side view
        case 99: // 3 side view
            camera3 = false;
            break;
        case 81: // Q/q --- rodar para a esquerda angulo v1
            rotate_v1_l = false;
            break;
        case 87: // W/w --- rodar para a direita angulo v1
            rotate_v1_r = false;
            break;
        case 65: // A/a --- rodar para a esquerda angulo v2
            rotate_v2_l = false;
            break;
        case 67: // C/c --- rodar para a direita angulo v2
            rotate_v2_r = false;
            break;
        case 68: // D/d --- rodar para a esquerda angulo v3
            rotate_v3_l = false;
            break;
        case 90: // Z/z --- rodar para a direita angulo v3
            rotate_v3_r = false;
            break;
    }
}

function render() {
    'use strict';
    renderer.render(scene, camera);
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

function animate() {
    'use strict';

    /*
    if (leftArrow)
        middleMobile.position.x--;
    
    if (topArrow)
        middleMobile.position.z++;

    if (rightArrow)
        middleMobile.position.x++;

    if (downArrow)
        middleMobile.position.z--;
    */
    
    if (camera1) {
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 200;
    }

    else if (camera2) {
        camera.position.x = 0;
        camera.position.y = 200;
        camera.position.z = 0;
    }

    else if (camera3) {
        camera.position.x = 2000;
        camera.position.y = 0;
        camera.position.z = 0;
    }

    camera.lookAt(scene.position);

    if (rotate_v1_r) {
        upperMobile.rotation.y -= .03;
    }
    else if (rotate_v1_l) {
        upperMobile.rotation.y += .03;
    }
    else if (rotate_v2_r) {
        middleMobile.rotation.y -= .03;
    }
    else if (rotate_v2_l) {
        middleMobile.rotation.y += .03;
    }
    else if (rotate_v3_r)
        lowerMobile.rotation.y -= .03;
    else if (rotate_v3_l)
        lowerMobile.rotation.y += .03;
    
    render();
    requestAnimationFrame(animate);
}