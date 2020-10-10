//const THREE = require("./three");

var horizontal = true, vertical = false;
var camera, scene, renderer;
var geometry, mesh, cube;
var lowerMobile, middleMobile, upperMobile;
var scale = 5;
var stdRadius = scale / 12;
var cylinderHeight = scale * 4, cylinderRadius = scale * 2;
var cubeSide = scale * 2;
var tallCubeSideHeight = scale * 4;
var rotate_v1_r, rotate_v1_l, rotate_v2_r, rotate_v2_l, rotate_v3_r, rotate_v3_l;
var leftArrow, topArrow, rightArrow, downArrow;
var camera1, camera2, camera3;
var near = 1, far = 1500;
var i;
var material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
var h0, h1, h2, h3, h4, h5, h6, h7, h8, h9, h10;
var h11, h12, h13, h14, h15, h16, h17, h18, h19, h20;
var h21, h22, h23, h24, h25, h26, h27, h28, h29, h30;
var h31, h32, h33, h34, h35, h36, h37, h38, h39, h40;
var cu0, cu1, cu2, cu3, cu4;
var cy0, cy1, cy2, cy3, cy4, cy5;
var p0, p1, p2;
var t0;
var e0, e1;
var g0, g1, g2, g3, g4, g5, g6, g7, g8, g9, g10;
var g10, g11, g12, g13, g14, g15, g16, g17, g18, g19;
var g20, g21, g22, g23, g24, g25, g26, g27, g28, g29;
var g30, g31, g32, g33, g34, g35, g36, g37, g38, g39, g40;
var g41, g42;

var paralelipipedo = new THREE.BoxGeometry(2 * scale, 2 * scale, 4 * scale);
var cubo = new THREE.BoxGeometry(2 * scale, 2 * scale, 2 * scale);
var cilindro = new THREE.CylinderGeometry(2 * scale, 2 * scale, 4 * scale);
var tetraedro = new THREE.TetrahedronGeometry(3 * scale);
var esfera = new THREE.SphereGeometry(2 * scale, 32, 32);

function haste(height) {
    return new THREE.CylinderGeometry(1/12 * scale, 1/12 * scale, height * scale);
}

function mobile(x, y, z) {
    'use strict';

    cu4 = new THREE.Mesh(new THREE.BoxGeometry(4 * scale, 4 * scale, 4 * scale), material);
    t0 = new THREE.Mesh(tetraedro, material);
    g42 = new THREE.Object3D();
    g42.add(t0);
    g42.add(cu4);
    g42.position.set(0 * scale, -5 * scale, 0 * scale);

    h39 = new THREE.Mesh(haste(6), material);
    g40 = new THREE.Object3D();
    g40.add(h39);
    g40.add(g42);
    g40.rotateZ(-Math.PI/2);
    g40.position.set(3 * scale, -3 * scale, 0 * scale);

    cy5 = new THREE.Mesh(cilindro, material);
    e1 = new THREE.Mesh(esfera, material);
    g41 = new THREE.Object3D();
    g41.add(cy5);
    g41.add(e1);
    g41.position.set(0 * scale, -15 * scale, 0 * scale)
    
    h38 = new THREE.Mesh(haste(26), material);
    g39 = new THREE.Object3D();
    g39.add(h38);
    g39.add(g41);
    g39.rotateZ(-Math.PI/2);
    g39.position.set(-3 * scale, -13 * scale, 0 * scale);

    h37 = new THREE.Mesh(haste(6), material);
    g37 = new THREE.Object3D();
    g37.add(h37);
    g37.add(g40);
    g37.add(g39);
    g37.rotateZ(Math.PI/2);
    g37.position.set(1 * scale, -2 * scale, 0 * scale);
    
    h35 = new THREE.Mesh(haste(4), material);
    g35 = new THREE.Object3D();
    g35.add(h35);
    g35.add(g37);
    g35.rotateZ(-Math.PI/2);
    g35.position.set(-4 * scale, -2 * scale, 0 * scale);
    
    e0 = new THREE.Mesh(esfera, material);
    cy4 = new THREE.Mesh(new THREE.CylinderGeometry(3 * scale, 3 * scale, 1/12 * scale), material);
    g38 = new THREE.Object3D();
    g38.add(e0);
    g38.add(cy4);
    g38.position.set(0 * scale, -12 * scale, 0 * scale);

    h36 = new THREE.Mesh(haste(20), material);
    g36 = new THREE.Object3D();
    g36.add(h36);
    g36.add(g38);
    g36.rotateZ(-Math.PI/2);
    g36.position.set(4 * scale, -10 * scale, 0 * scale);

    h34 = new THREE.Mesh(haste(8), material);
    g34 = new THREE.Object3D();
    g34.add(h34);
    g34.add(g35);
    g34.add(g36);
    g34.rotateZ(Math.PI/2);
    g34.position.set(-2 * scale, -2 * scale, 0 * scale);
    
    p2 = new THREE.Mesh(paralelipipedo, material);
    p2.position.set(0, -4, 0);
    h32 = new THREE.Mesh(haste(6), material);
    g33 = new THREE.Object3D();
    g33.add(p2);
    g33.add(h32);
    g33.rotateZ(-Math.PI/2);
    g33.position.set(-2 * scale, -5 * scale, 0 * scale);
    
    cy3 = new THREE.Mesh(cilindro, material);
    cy3.position.set(0 * scale, -5 * scale, 0 * scale);
    h31 = new THREE.Mesh(haste(6), material);
    g32 = new THREE.Object3D();
    g32.add(h31);
    g32.add(cy3);
    g32.position.set(2 * scale, 5 * scale, 0 * scale);
    g32.rotateZ(-Math.PI/2);
    
    h30 = new THREE.Mesh(haste(10), material);
    g31 = new THREE.Object3D();
    g31.add(g33);
    g31.add(h30);
    g31.add(g32);
    g31.rotateZ(Math.PI/2);
    g31.position.set(3 * scale, -5 * scale, 0 * scale);
    
    h28 = new THREE.Mesh(haste(4), material);
    g30 = new THREE.Object3D();
    g30.add(h28);
    g30.add(g31);
    g30.rotateZ(-Math.PI/2);
    g30.position.set(-9 * scale, -2 * scale, 0 * scale);

    cu3 = new THREE.Mesh(cubo, material);
    cu3.position.set(0 * scale, -3 * scale, 0 * scale);
    h29 = new THREE.Mesh(haste(4), material);
    g29 = new THREE.Object3D();
    g29.add(h29);
    g29.add(cu3);
    g29.rotateZ(-Math.PI/2);
    g29.position.set(9 * scale, -2 * scale, 0 * scale);
    
    h27 = new THREE.Mesh(haste(18), material);
    g28 = new THREE.Object3D();
    g28.add(h27);
    g28.add(g29);
    g28.add(g30);
    g28.rotateZ(Math.PI/2);
    g28.position.set(5 * scale, -2 * scale, 0 * scale);
    
    h26 = new THREE.Mesh(haste(4), material);
    g27 = new THREE.Object3D();
    g27.add(g28);
    g27.add(h26);
    g27.rotateZ(-Math.PI/2);
    g27.position.set(8 * scale, -2 * scale, 0 * scale);

    p1 = new THREE.Mesh(paralelipipedo, material);
    p1.position.set(0 * scale, -4 * scale, 0 * scale);
    h25 = new THREE.Mesh(haste(4), material);
    g26 = new THREE.Object3D();
    g26.add(p1);
    g26.add(h25);
    g26.rotateZ(-Math.PI/2);
    g26.position.set(-8 * scale, -2 * scale, 0 * scale);
    
    h24 = new THREE.Mesh(haste(16), material);
    g25 = new THREE.Object3D();
    g25.add(h24);
    g25.add(g26);
    g25.add(g27);

    cy2 = new THREE.Mesh(cilindro, material);
    cy2.position.set(0 * scale, -5 * scale, 0 * scale);
    h22 = new THREE.Mesh(haste(6), material);
    g23 = new THREE.Object3D();
    g23.rotateZ(-Math.PI/2);
    g23.position.set(-5 * scale, -3 * scale, 0 * scale);
    
    h23 = new THREE.Mesh(haste(8), material);
    g24 = new THREE.Object3D();
    g24.add(h23);
    g24.add(g25);
    g24.rotateZ(-Math.PI/2);
    g24.position.set(5 * scale, -4 * scale, 0 * scale);

    h21 = new THREE.Mesh(haste(10), material);
    g22 = new THREE.Object3D();
    g22.add(h21);
    g22.add(g23);
    g22.add(g24);
    g22.rotateZ(Math.PI/2);
    g22.position.set(-3 * scale, -2 * scale, 0 * scale);
    
    cu2 = new THREE.Mesh(cubo, material);
    cu2.position.set(0 * scale, -2 * scale, 0 * scale);
    h19 = new THREE.Mesh(haste(2), material);
    g21 = new THREE.Object3D();
    g21.add(h19);
    g21.add(cu2);
    g21.rotateZ(-Math.PI/2);
    g21.position.set(11 * scale, -1 * scale, 0 * scale);

    h20 = new THREE.Mesh(haste(4), material);
    g20 = new THREE.Object3D();
    g20.add(h20);
    g20.add(g22);
    // g20.rotateY(v3);
    g20.rotateZ(-Math.PI/2);
    g20.position.set(-11 * scale, -2 * scale, 0 * scale);

    // ------------------------------
    // edge of lower mobile
    // ------------------------------

    h18 = new THREE.Mesh(haste(22), material);
    g19 = new THREE.Object3D();
    g19.add(h18);
    g19.add(g21);
    g19.add(g20);
    g19.rotateZ(Math.PI/2);
    g19.position.set(-7 * scale, -6 * scale, 0 * scale);    

    h17 = new THREE.Mesh(haste(12), material);
    g18 = new THREE.Object3D();
    g18.add(h17);
    g18.add(g19);
    g18.rotateZ(-Math.PI/2);
    g18.position.set(6 * scale, -6 * scale, 0 * scale);

    h16 = new THREE.Mesh(haste(2), material);
    g17 = new THREE.Object3D();
    cu1 = new THREE.Mesh(cubo, material);
    g17.add(h16);
    g17.add(cu1);
    g17.rotateZ(-Math.PI/2);
    g17.position.set(-6 * scale, -1 * scale, 0 * scale);
    
    h15 = new THREE.Mesh(haste(12), material);
    g16 = new THREE.Object3D();
    g16.add(g17);
    g16.add(g18);
    g16.rotateZ(Math.PI/2);
    g16.position.set(2 * scale, -1 * scale, 0 * scale);

    h13 = new THREE.Mesh(haste(2), material);
    g14 = new THREE.Object3D();
    g14.add(g16);
    g14.add(h13);
    g14.rotateZ(-Math.PI/2);
    g14.position.set(-7 * scale, -1 * scale, 0 * scale);
    
    cy1 = new THREE.Mesh(cilindro, material);
    cy1.position.set(0 * scale, -4 * scale, 0 * scale);
    h14 = new THREE.Mesh(haste(4), material);
    g15 = new THREE.Object3D();
    g15.add(h14);
    g15.add(cy1);

    h12 = new THREE.Mesh(haste(14), material);
    g13 = new THREE.Object3D();
    g13.add(h12);
    g13.add(g15);
    g13.add(g14);
    g13.rotateZ(Math.PI/2);
    g13.position.set(-5 * scale, -3 * scale, 0 * scale);
    
    h11 = new THREE.Mesh(haste(6), material);
    g12 = new THREE.Object3D();
    g12.add(h11);
    g12.add(g13);
    g12.rotateZ(-Math.PI/2);
    g12.position.set(6 * scale, -3 * scale, 0 * scale);

    cu0 = new THREE.Mesh(cubo, material);
    cu0.position.set(0 * scale, -2 * scale, 0 * scale);
    h10 = new THREE.Mesh(haste(2), material);
    g11 = new THREE.Object3D();
    g11.add(cu0);
    g11.add(h10);
    g11.rotateZ(-Math.PI/2);
    g11.position.set(-6 * scale, -1 * scale, 0 * scale);

    h9 = new THREE.Mesh(haste(12), material);
    g10 = new THREE.Object3D();
    g10.add(g11);
    g10.add(g12);
    g10.add(h9);
    
    h8 = new THREE.Mesh(haste(12), material);
    g9 = new THREE.Object3D();
    g9.add(h8);
    g9.add(g10);
    g9.rotateZ(-Math.PI/2);
    g9.position.set(6 * scale, -6 * scale, 0 * scale);
        
    p0 = new THREE.Mesh(paralelipipedo, material);
    p0.position.set(0 * scale, -3 * scale, 0 * scale);
    h7 = new THREE.Mesh(haste(2), material); 
    g8 = new THREE.Object3D();
    g8.add(p0);
    g8.add(h7);
    g8.rotateZ(-Math.PI/2);
    g8.position.set(-6 * scale, -1 * scale, 0 * scale);
    
    h6 = new THREE.Mesh(haste(12), material);
    g7 = new THREE.Object3D();
    g7.add(h6);
    g7.add(g9);
    g7.add(g8);
    g7.rotateZ(Math.PI/2);
    g7.position.set(-2 * scale, -1 * scale, 0 * scale);
    
    h5 = new THREE.Mesh(haste(2), material);
    g6 = new THREE.Object3D();
    g6.add(h5);
    g6.add(g7);
    g6.rotateZ(-Math.PI/2);
    g6.position.set(7 * scale, -1 * scale, 0 * scale);

    cy0 = new THREE.Mesh(cilindro, material);
    cy0.position.set(0 * scale, -7 * scale, 0 * scale);
    h4 = new THREE.Mesh(haste(10), material);
    g5 = new THREE.Object3D();
    g5.add(cy0);
    g5.add(h4);
    g5.rotateZ(-Math.PI/2);
    g5.position.set(-7 * scale, -5 * scale, 0 * scale);
    
    h3 = new THREE.Mesh(haste(14), material);
    g4 = new THREE.Object3D();
    g4.add(h3);
    g4.add(g5);
    g4.add(g6);
    g4.rotateZ(Math.PI/2);
    g4.position.set(-3 * scale, -3 * scale, 0 * scale);
    
    h33 = new THREE.Mesh(haste(4), material);
    g3 = new THREE.Object3D();
    g3.add(h33);
    g3.add(g34);
    g3.rotateZ(-Math.PI/2);
    g3.position.set(17 * scale, -2 * scale, 0 * scale);

    h2 = new THREE.Mesh(haste(6), material);
    g2 = new THREE.Object3D();
    g2.add(h2);
    g2.add(g3);
    g2.add(g4);
    g2.rotateZ(-Math.PI/2);
    g2.position.set(-17 * scale, -3 * scale, 0 * scale);
    
    h1 = new THREE.Mesh(haste(34), material);
    g1 = new THREE.Object3D();
    g1.add(h1);
    g1.add(g2);
    g1.add(g3);
    g1.rotateZ(Math.PI/2);
    g1.position.set(-7 * scale, -2 * scale, 0 * scale);

    h0 = new THREE.Mesh(haste(4), material);
    g0 = new THREE.Object3D();
    g0.add(h0);
    g0.add(g1);
    g0.position.set(0 * scale, 35 * scale, 0 * scale);

    // ------------------------------
    // edge of upper mobile
    // ------------------------------

    scene.add(g31);
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper(10));
    mobile(0, 0, 0);
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
        g0.rotation.y -= .03;
    }
    else if (rotate_v1_l) {
        g0.rotation.y += .03;
    }
    else if (rotate_v2_r) {
        g8.rotation.y -= .03;
    }
    else if (rotate_v2_l) {
        g8.rotation.y += .03;
    }
    else if (rotate_v3_r)
        g20.rotation.y -= .03;
    else if (rotate_v3_l)
        g20.rotation.y += .03;
    
    render();
    requestAnimationFrame(animate);
}