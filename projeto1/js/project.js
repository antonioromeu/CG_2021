var horizontal = true, vertical = false;
var camera, scene, renderer;
var geometry, material, mesh, cube;
var lowerMobile, middleMobile, upperMobile, mobile;
var scale = 4;
var stdRadius = scale / 12;
var cylinderHeight = 4, cylinderRadius = 1;
var rotate_v1_r, rotate_v1_l, rotate_v2_r, rotate_v2_l, rotate_v3_r, rotate_v3_l;
var xs, ys, radius, heights, orientations;
var leftArrow, topArrow, rightArrow, downArrow;

function addCylinder(obj, x, y, z, r1, r2, height, horizontal) {
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
    geometry = new THREE.CylinderGeometry(scale *  r1, scale * r2, scale * height, 16);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(scale * x, scale * y, scale * z);
    if (horizontal)
        mesh.rotateZ(Math.PI/2);
    obj.add(mesh);
}

function addCube(obj, x, y, z, a, diagonal) {
    'use strict';
    material = new  THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
    geometry = new THREE.BoxGeometry(a * scale, a * scale, a * scale);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(scale * x, scale * y, scale * z);
    if (diagonal)
        mesh.rotateZ(Math.PI/4);
    obj.add(mesh);
}

function createLowerMobile(x, y, z) {
    'use strict';
    lowerMobile = new THREE.Object3D();
    /*
    lowerMobile.userData = { 
        rotateX: 0, 
        rotateY: 0,
        rotateZ: 0,
        step: 0.05
    };
    */
    material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
    xs = [0, -3, 2, -8, -8, 6, -2, 14, 19, 10, 28, 9, 4, 14, 4, -2, 28, 14];
    ys = [-2, -4, -8, -6, -10, -12, -14, -14, -16, -18, -18, -20, -23, -22, -28, -17, -21, -25];
    radius = [stdRadius, stdRadius, stdRadius, stdRadius, cylinderRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, stdRadius, cylinderRadius];
    heights = [4, 10, 8, 4, cylinderHeight, 16, 4, 4, 18, 4, 4, 10, 6, 4, cylinderHeight];
    orientations = [vertical, horizontal, vertical, vertical, vertical, horizontal, vertical, vertical, horizontal, vertical, vertical, horizontal, vertical, vertical, vertical];
    var i = 0;
    
    for (; i < 15; i++) {
        addCylinder(lowerMobile, xs[i], ys[i], 0, radius[i], radius[i], heights[i], orientations[i]);
    }
    for (; i < 18; i++) {
        addCube(lowerMobile, xs[i], ys[i], 0, 2, false);
    }

    /*
    addCylinder(lowerMobile, 0, -2, 0, stdRadius, stdRadius, 4, vertical); // 3a
    addCylinder(lowerMobile, -3, -4, 0, stdRadius, stdRadius, 10, horizontal); // 3b
    addCylinder(lowerMobile, 2, -8, 0, stdRadius, stdRadius, 8, vertical); // 3c
    addCylinder(lowerMobile, -8, -6, 0, stdRadius, stdRadius, 4, vertical); // 3d
    addCylinder(lowerMobile, -8, -10, 0, cylinderRadius, cylinderRadius, cylinderHeight, vertical); // 7
    addCylinder(lowerMobile, 6, -12, 0, stdRadius, stdRadius, 16, horizontal); // 3e
    addCylinder(lowerMobile, -2, -14, 0, stdRadius, stdRadius, 4, vertical); // 3f
    addCylinder(lowerMobile, 14, -14, 0, stdRadius, stdRadius, 4, vertical); // 3g
    addCylinder(lowerMobile, 19, -16, 0, stdRadius, stdRadius, 18, horizontal); // 3h
    addCylinder(lowerMobile, 10, -18, 0, stdRadius, stdRadius, 4, vertical); // 3i
    addCylinder(lowerMobile, 28, -18, 0, stdRadius, stdRadius, 4, vertical); // 3j
    addCylinder(lowerMobile, 9, -20, 0, stdRadius, stdRadius, 10, horizontal); // 3k
    addCylinder(lowerMobile, 4, -23, 0, stdRadius, stdRadius, 6, vertical); // 3l
    addCylinder(lowerMobile, 14, -22, 0, stdRadius, stdRadius, 4, vertical); // 3m
    addCylinder(lowerMobile, 4, -28, 0, cylinderRadius, cylinderRadius, cylinderHeight, vertical); // 9
    addCube(lowerMobile, -2, -17, 0, 2, false); // 8
    addCube(lowerMobile, 28, -21, 0, 2, false); // 10
    addCube(lowerMobile, 14, -25, 0, 2, false); // 11
    */
    
    // scene.add(lowerMobile);

    lowerMobile.position.x = x;
    lowerMobile.position.y = y;
    lowerMobile.position.z = z;

    return lowerMobile;
}

function createMiddleMobile(x, y, z) {
    'use strict';
    middleMobile = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
    createLowerMobile(scale * (-6), scale * (-40), scale * 0);
    middleMobile.add(lowerMobile);
    addCylinder(middleMobile, 0, -3, 0, stdRadius, stdRadius, 6, vertical); // 2a
    addCylinder(middleMobile, -3, -6, 0, stdRadius, stdRadius, 14, horizontal); // 2b
    addCylinder(middleMobile, 4, -7, 0, stdRadius, stdRadius, 2, vertical); //
    addCylinder(middleMobile, -10, -10, 0, stdRadius, stdRadius, 8, vertical); //
    addCylinder(middleMobile, -10, -12, 0, cylinderRadius, cylinderRadius, 4, vertical); // CILINDRO
    addCylinder(middleMobile, 2, -8, 0, stdRadius, stdRadius, 12, horizontal); //
    addCylinder(middleMobile, -4, -9, 0, stdRadius, stdRadius, 2, vertical); //
    addCube(middleMobile, -4, -11, 0, 2, false); // CUBO
    addCylinder(middleMobile, 8, -14, 0, stdRadius, stdRadius, 12, vertical); //
    addCylinder(middleMobile, 10, -20, 0, stdRadius, stdRadius, 12, horizontal); //
    addCylinder(middleMobile, 4, -21, 0, stdRadius, stdRadius, 2, vertical); //
    addCube(middleMobile, 4, -23, 0, 2, false); // CUBE
    addCylinder(middleMobile, 16, -23, 0, stdRadius, stdRadius, 6, vertical); //
    addCylinder(middleMobile, 11, -26, 0, stdRadius, stdRadius, 14, horizontal); //
    addCylinder(middleMobile, 4, -27, 0, stdRadius, stdRadius, 2, vertical); //
    addCylinder(middleMobile, 18, -28, 0, stdRadius, stdRadius, 4, vertical); //
    addCylinder(middleMobile, 18, -32, 0, cylinderRadius, cylinderRadius, 4, vertical); // CILINDRO
    addCylinder(middleMobile, 6, -28, 0, stdRadius, stdRadius, 12, horizontal); //
    addCylinder(middleMobile, 0, -29, 0, stdRadius, stdRadius, 2, vertical); //
    addCube(middleMobile, 0, -31, 0, 2, false); // CUBE
    addCylinder(middleMobile, 12, -34, 0, stdRadius, stdRadius, 12, vertical); //
    addCylinder(middleMobile, 5, -40, 0, stdRadius, stdRadius, 22, horizontal); //
    addCylinder(middleMobile, 16, -41, 0, stdRadius, stdRadius, 2, vertical); //
    addCube(middleMobile, 16, -43, 0, 2, false); // CUBO

    // middleMobile.add(createLowerMobile(-6, -36, 0));

    scene.add(middleMobile);

    middleMobile.position.x = x;
    middleMobile.position.y = y;
    middleMobile.position.z = z;
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper(10));
    createMiddleMobile(0, 0, 0);
}

function createCamera() {
    'use strict';
    //camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000); 
    // camera.position.x = 0;
    // camera.position.y = 0;
    // camera.position.z = 0;
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
        case 49: // 1 top
        case 97: // 1 side
            // camara frontal
            break;
        case 50: // 2 top
        case 98: // 2 side
            // camara topo
            break;
        case 51: // 3 top
        case 99: // 3 side
            // camara lateral
            break;
        case 52: // 4 top
        case 100: // 4 side
            scene.traverse(function(node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
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
        case 81: // Q/q --- rodar para a esquerda angulo v1
            //rotate_v1_l = false;
            break;
        case 87: // W/w --- rodar para a direita angulo v1
            //rotate_v1_r = false;
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

    if (leftArrow)
        middleMobile.position.x--;
    
    if (topArrow)
        middleMobile.position.z++;

    if (rightArrow)
        middleMobile.position.x++;

    if (downArrow)
        middleMobile.position.z--;

    if (rotate_v1_r) {
        upperMobile.rotation.y -= .03;
        middleMobile.rotation.y -= .03;
        lowerMobile.rotation.y -= .03;
    }
    else if (rotate_v1_l) {
        upperMobile.rotation.y += .03;
        middleMobile.rotation.y += .03;
        lowerMobile.rotation.y += .03;
    }
    else if (rotate_v2_r) {
        middleMobile.rotation.y -= .03;
        //lowerMobile.rotation.y -= .03;
    }
    else if (rotate_v2_l) {
        middleMobile.rotation.y += .03;
        //lowerMobile.rotation.y += .03;
    }
    else if (rotate_v3_r)
        lowerMobile.rotation.y -= .03;
    else if (rotate_v3_l)
        lowerMobile.rotation.y += .03;
    
    render();
    requestAnimationFrame(animate);
}