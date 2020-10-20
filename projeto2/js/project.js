var camera, scene, renderer;
var scale = 2.5;
var near = 1, far = 1500 * scale;
var camera1, camera2, camera3;
var ballRadius = 5 * scale;
var stickLength = 80 * scale;
var tableHoleRadius = 5 * scale;
var tableWidth = 100 * scale, tableDepth = 200 * scale;
var pink = new THREE.Color("rgb(170, 0, 100)");
var yellow = new THREE.Color("rgb(255, 200, 0)");
var grey = new THREE.Color("rgb(150, 150, 150)");
var ballMaterial = new THREE.MeshBasicMaterial({ color: pink, wireframe: true });
var stickMaterial = new THREE.MeshBasicMaterial({ color: yellow, wireframe: true });
var tableMaterial = new THREE.MeshBasicMaterial({ color: grey, wireframe: true});
var planeMaterial = new THREE.MeshBasicMaterial( {color: grey, side: THREE.DoubleSide, wireframe: true} );
var basePlane = new THREE.PlaneGeometry(tableWidth, tableDepth, 10);
var longWallPlane = new THREE.PlaneGeometry(tableDepth, ballRadius * 2, 10, 10);
var smallWallPlan = new THREE.PlaneGeometry(ballRadius * 2, tableWidth, 10, 10);
var planeWidth = new THREE.PlaneGeometry(20 * scale, 5 * scale, 10);
var cube = new THREE.BoxGeometry(tableWidth, ballRadius, tableDepth);

class Ball {
    constructor() {
        this.xPos = Math.randFloat(0, high);
        this.zPos = Math.randFloat(low, high);
        
        var sphere = new THREE.SphereGeometry(ballRadius, 32, 32);
        var mesh = new THREE.Mesh(sphere, ballMaterial);
        this.obj = new THREE.Object3D().add(mesh);
    }
}

class WhiteBall extends Ball {
    constructor(xPos, zPos) {
        this.xPos = xPos;
        this.zPos = zPos;
        
        var sphere = new THREE.SphereGeometry(ballRadius, 32, 32);
        var mesh = new THREE.Mesh(sphere, pinkMaterial);
        this.obj = new THREE.Object3D().add(mesh);
    }
}

class Stick {
    constructor(xPos, zPos, direction) {
        this.xPos = xPos;
        this.zPos = zPos;

        var cylinder = new THREE.CylinderGeometry(2 * scale, 4 * scale, stickLength, 16);
        var mesh = new THREE.Mesh(cylinder, stickMaterial);
        this.obj = new THREE.Object3D().add(mesh);

        switch (direction) {
            case "down":
                this.angle = 0; 
                break;
            case "up":
                this.angle = Math.PI; 
                break;
            case "right":
                this.angle = Math.PI/2;
                break;
            case "left":
                this.angle = -Math.PI/2;
                break;
        }
        this.obj.rotazeY(this.angle);
    }
}

function createMesa() {
    var base = new THREE.Mesh(basePlane, planeMaterial);
    var leftWall = new THREE.Mesh(longWallPlane, planeMaterial);
    var rightWall = new THREE.Mesh(longWallPlane, planeMaterial);
    var topWall = new THREE.Mesh(smallWallPlan, planeMaterial);
    var bottomWall = new THREE.Mesh(smallWallPlan, planeMaterial);
    var table = new THREE.Object3D();
    base.rotateX(Math.PI/2);
    base.rotateZ(Math.PI/2);
    table.add(base);
    leftWall.position.set(0, ballRadius, tableWidth/2);
    rightWall.position.set(0, ballRadius, -tableWidth/2);
    topWall.position.set(-tableDepth/2, ballRadius, 0);
    bottomWall.position.set(tableDepth/2, ballRadius, 0);
    topWall.rotateX(Math.PI/2);
    topWall.rotateY(Math.PI/2);
    bottomWall.rotateX(Math.PI/2);
    bottomWall.rotateY(Math.PI/2);
    table.add(leftWall);
    table.add(rightWall);
    table.add(topWall);
    table.add(bottomWall);
    scene.add(table);
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper(50));
    createMesa();
}

function createCamera() {
    'use strict';
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, near, far);
    camera.position.x = 0;
    camera.position.y = 0 * scale;
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
            yellowMaterial.wireframe = !yellowMaterial.wireframe;
            orangeMaterial.wireframe = !orangeMaterial.wireframe;
            greenMaterial.wireframe = !greenMaterial.wireframe;
            pinkMaterial.wireframe = !pinkMaterial.wireframe;
            blueMaterial.wireframe = !blueMaterial.wireframe;
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

function animate() {
    'use strict';
    /*
    if (leftArrow)
        g0.position.x--;
    
    if (topArrow)
        g0.position.z++;

    if (rightArrow)
        g0.position.x++;

    if (downArrow)
        g0.position.z--;
    */
    if (camera1) {
        camera.position.x = 200 * scale;
        camera.position.y = 200 * scale;
        camera.position.z = 200 * scale;
    }

    else if (camera2) {
        camera.position.x = 0;
        camera.position.y = 200 * scale;
        camera.position.z = 0;
    }

    else if (camera3) {
        camera.position.x = 200 * scale;
        camera.position.y = 0;
        camera.position.z = 0;
    }

    /*
    if (rotate_v1_r)
    g0.rotation.y -= .03;
    if (rotate_v1_l)
    g0.rotation.y += .03;
    if (rotate_v2_r)
    g2.rotation.x -= .03;
    if (rotate_v2_l)
    g2.rotation.x += .03;
    if (rotate_v3_r)
    g20.rotation.x -= .03;
    if (rotate_v3_l)
    g20.rotation.x += .03;
    */
    camera.lookAt(scene.position);
    render();
    requestAnimationFrame(animate);
}