/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var geometry, geometry2, material, mesh, mesh2;

var ball;

function addTableLeg(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(2, 6, 2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - 3, z);
    obj.add(mesh);
}

function addTableTop(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(60, 2, 20);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createBall(x, y, z) {
    'use strict';

    ball = new THREE.Object3D();
    ball.userData = { jumping: true, step: 0 };

    // material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });

    geometry = new THREE.SphereGeometry(4, 10, 10);

    geometry2 = new THREE.CircleGeometry( 8, 32 );
    
    // geometry = new THREE.TorusGeometry(10, 3);
    // geometry = new THREE.TorusKnotGeometry(10, 2);
    // data.radius,
    // data.tube,
    // data.tubularSegments,
    // data.radialSegments,
    // data.p,
    // data.q
    mesh = new THREE.Mesh(geometry, material);

    mesh2 = new THREE.Mesh(geometry2, material);

    ball.add(mesh);

    ball.add(mesh2);

    ball.position.set(x, y, z);
    ball.rotateX(Math.PI/2);
    // ball.position.applyEuler(new THREE.Euler( Math.PI/2, 0, 0, 'XYZ' ));
    // var a = new THREE.Euler( 0, 1, 1.57, 'XYZ' );
    // var b = new THREE.Vector3( 1, 0, 1 );
    // ball.position.applyEuler(a);
    
    scene.add(ball);
}


function createTable(x, y, z) {
    'use strict';

    var table = new THREE.Object3D();

    // material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
    // material = new THREE.MeshBasicMaterial({ color: '#B76480', wireframe: true });

    addTableTop(table, 0, 0, 0);
    addTableLeg(table, -25, -1, -8);
    addTableLeg(table, -25, -1, 8);
    addTableLeg(table, 25, -1, 8);
    addTableLeg(table, 25, -1, -8);

    scene.add(table);

    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();


    scene.add(new THREE.AxisHelper(10));

    createTable(0, 8, 0);
    createBall(0, 0, 15);
}

function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
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
    case 65: //A
    case 97: //a
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.material.wireframe = !node.material.wireframe;
            }
        });
        break;
    // case 83:  //S
    // case 115: //s
    case 32: //space
        ball.userData.jumping = !ball.userData.jumping;
        break;
    case 69:  //E
    case 101: //e
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
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
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

    if (ball.userData.jumping) {
        ball.userData.step += 0.04;
        ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
        ball.position.z = 15 * (Math.cos(ball.userData.step));
    }
    render();

    requestAnimationFrame(animate);
}
