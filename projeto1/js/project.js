var horizontal = true, vertical = false;
var camera, scene, renderer;
var geometry, material, mesh, cube;
var lowerMobile, middleMobile, upperMobile, mobile;
var scale = 5, stdRadius = 2;

function addCylinder(obj, x, y, z, r1, r2, height, horizontal) {
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
    geometry = new THREE.CylinderGeometry(r1, r2, scale * height, 5);
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
    lowerMobile.userData = { 
        rotateX: 0, 
        rotateY: 0,
        rotateZ: 0,
        step: 0.05
    };

    material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });

    addCylinder(lowerMobile, 0, -2, 0, stdRadius, stdRadius, 4, vertical);
    addCylinder(lowerMobile, -3, -4, 0, stdRadius, stdRadius, 10, horizontal);
    addCylinder(lowerMobile, 2, -6, 0, stdRadius, stdRadius, 4, vertical);
    addCylinder(lowerMobile, -8, -5, 0, stdRadius, stdRadius, 2, vertical);
    addCylinder(lowerMobile, -8, -8, 0, scale * stdRadius, scale * stdRadius, 4, vertical);
    addCylinder(lowerMobile, 6, -8, 0, stdRadius, stdRadius, 16, horizontal);
    addCylinder(lowerMobile, -2, -9, 0, stdRadius, stdRadius, 2, vertical);
    addCube(lowerMobile, -2, -11, 0, 2, false);
    addCylinder(lowerMobile, 14, -9, 0, stdRadius, stdRadius, 2, vertical);
    addCylinder(lowerMobile, 19, -10, 0, stdRadius, stdRadius, 18, horizontal);
    addCylinder(lowerMobile, 10, -11, 0, stdRadius, stdRadius, 2, vertical);
    addCylinder(lowerMobile, 28, -11, 0, stdRadius, stdRadius, 2, vertical);
    addCube(lowerMobile, 28, -13, 0, 2, false);
    addCylinder(lowerMobile, 9, -12, 0, stdRadius, stdRadius, 10, horizontal);
    addCylinder(lowerMobile, 4, -13, 0, stdRadius, stdRadius, 2, vertical);
    addCylinder(lowerMobile, 4, -16, 0, scale * stdRadius, scale * stdRadius, 4, vertical);
    addCylinder(lowerMobile, 14, -13, 0, stdRadius, stdRadius, 2, vertical);
    addCube(lowerMobile, 14, -15, 0, 2, false);
    scene.add(lowerMobile);

    lowerMobile.position.x = x;
    lowerMobile.position.y = y;
    lowerMobile.position.z = z;
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper(10));
    createLowerMobile(0, 0, 0);
    // createTable(0, 8, 0);
    // createBall(0, 0, 15);
    // createCylinder(0, 0, 0, 2, 2, 80, true); // (Xcoordinate, Ycoordinate, Zcoordinate, cylinderHeight);
    // createCube(0, 0, 0, true);
    // createBall(0, 0, 0); // (Xcoordinate, Ycoordinate, Zcoordinate, cylinderHeight);
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
        case 81: // Q/q
            // rodar para a esquerda angulo v1
            // cylinder.rotation.y += 0.05;
            lowerMobile.userData.rotateY += lowerMobile.userData.step;
            break;
        case 87: // W/w
            // rodar para a direita angulo v1
            lowerMobile.rotation.y -= 0.05;
            break;
        case 65: // A/a
            // rodar para a esquerda angulo v2
            lowerMobile.rotation.z += 0.05;
            break;
        case 67: // C/c
            // rodar para a direita angulo v2
            lowerMobile.rotation.z -= 0.05;
            break;
        case 68: // D/d
            // rodar para a esquerda angulo v3
        case 90: // Z/z
            // rodar para a direita angulo v3
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
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';
    // if (ball.userData.jumping) {
    //     ball.userData.step += 0.04;
    //     ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
    //     ball.position.z = 15 * (Math.cos(ball.userData.step));
    // }
    // if (lowerMobile.userData.)
    render();
    requestAnimationFrame(animate);
}