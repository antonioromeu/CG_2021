var camera, scene, renderer;
var scale = 4;
var clock;
var near = 1, far = 1500 * scale;
var camera1, camera2, camera3;
var ballRadius = 5 * scale;
var stickLength = 80 * scale;
var stickSmallRadius = 0.9 * scale, stickBigRadius = 3 * scale;
var tableHoleRadius = 5 * scale;
var tableWidth = 100 * scale, tableDepth = 200 * scale;
var minSpeed = -10, maxSpeed = 10;
// var minDistance = 1;
var balls = [];
var nBalls = 16;
var pink = new THREE.Color("rgb(170, 0, 100)");
var yellow = new THREE.Color("rgb(255, 200, 0)");
var grey = new THREE.Color("rgb(150, 150, 150)");
var ballMaterial = new THREE.MeshBasicMaterial({ color: pink, wireframe: true });
var stickMaterial = new THREE.MeshBasicMaterial({ color: yellow, wireframe: true });
var planeMaterial = new THREE.MeshBasicMaterial({ color: grey, side: THREE.DoubleSide, wireframe: true });

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

class Ball {
    constructor() {
        var z = getRandomArbitrary(-tableWidth/2 + ballRadius, tableWidth/2 - ballRadius);
        var x = getRandomArbitrary(-tableDepth/2 + ballRadius, tableDepth/2 - ballRadius);
        var y = ballRadius;
        this.speed = new THREE.Vector3(getRandomArbitrary(minSpeed, maxSpeed), 0, getRandomArbitrary(minSpeed, maxSpeed));
        var sphere = new THREE.SphereGeometry(ballRadius, 32, 32);
        var mesh = new THREE.Mesh(sphere, ballMaterial);
        var ball = new THREE.Object3D().add(mesh);
        ball.position.set(x, y, z);
        this.obj = ball;
        this.nextPos = new THREE.Vector3(x, y, z);
        this.nextSpeed = new THREE.Vector3();
        this.nextSpeed = this.speed;
    }

    computePosition(delta) {
        this.nextSpeed.multiplyScalar(1 - delta);
        this.nextPos.add(this.nextSpeed);
    }
    
    intersectsTable() {
        return !(this.nextPos.getComponent(0) >= (-tableDepth/2 + ballRadius) &&
                this.nextPos.getComponent(0) <= (tableDepth/2 - ballRadius) &&
                this.nextPos.getComponent(2) >= (-tableWidth/2 + ballRadius) &&
                this.nextPos.getComponent(2) <= (tableWidth/2 - ballRadius));
    }

    computeTableRicochet() {
        var x = this.obj.position.getComponent(0);
        var z = this.obj.position.getComponent(2);
        if (x == (-tableDepth/2 + ballRadius) || x == (tableDepth/2 - ballRadius))
            this.nextSpeed.setComponent(0, -this.nextSpeed.getComponent(0));
        if (z == (-tableWidth/2 + ballRadius) || z == (tableWidth/2 - ballRadius))
            this.nextSpeed.setComponent(2, -this.nextSpeed.getComponent(2));
        if (x < (-tableDepth/2 + ballRadius))
            this.nextPos.setComponent(0, -tableDepth/2 + ballRadius);
        if (x > (tableDepth/2 - ballRadius))
            this.nextPos.setComponent(0, tableDepth/2 - ballRadius);
        if (z < (-tableWidth/2 + ballRadius))
            this.nextPos.setComponent(2, -tableWidth/2 + ballRadius);
        if (z > (tableWidth/2 - ballRadius))
            this.nextPos.setComponent(2, tableWidth/2 - ballRadius);
    }
    
    intersectsBall(ball) {
        var x = this.nextPos.getComponent(0);
        var z = this.nextPos.getComponent(2);
        var distance = Math.sqrt((x - ball.obj.position.getComponent(0)) * (x - ball.obj.position.getComponent(0)) +
                                 (z - ball.obj.position.getComponent(2)) * (z - ball.obj.position.getComponent(2)));
        //console.log(distance);
        return distance;
    }

    computeBallRicochet(ball, distance) {
        var ricochetVector = new THREE.Vector3();
        ricochetVector.set(this.obj.position.getComponent(0) - ball.obj.position.getComponent(0),
                            0, this.obj.position.getComponent(2) - ball.obj.position.getComponent(2));
        if (distance < 2 * ballRadius) {
            //console.log(distance);
            var overlap = (2 * ballRadius - ricochetVector.length()) / 2;
            ricochetVector.setLength(overlap);
            this.nextPos.add(ricochetVector);
        }
        else {
            this.nextSpeed.reflect(ricochetVector);
            var length1 = ball.speed.length();
            var length2 = this.speed.length();
            this.nextSpeed.setLength((length1 + length2) / 2);
            console.log(this.speed);
            console.log(this.nextSpeed);
            console.log("-----");
        }
    }

    update(delta, index) {
        this.speed = this.nextSpeed;
        this.obj.position.set(this.nextPos.getComponent(0), this.nextPos.getComponent(1), this.nextPos.getComponent(2));
        this.computePosition(delta);
        if (this.intersectsTable())
            this.computeTableRicochet();
        for (var i = 0; i < nBalls; i++) {
            if (index != i) {
                var distance = this.intersectsBall(balls[i]);
                if (distance <= (2 * ballRadius)) {
                    this.computeBallRicochet(balls[i], distance);
                }
            }
        }
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

class Table {
    constructor() {
        var tableHeight = ballRadius * 3;
        var basePlane = new THREE.PlaneGeometry(tableWidth, tableDepth, 10);
        var longWallPlane = new THREE.PlaneGeometry(tableDepth, tableHeight, 10, 10);
        var smallWallPlan = new THREE.PlaneGeometry(tableWidth, tableHeight, 10, 10);
        var base = new THREE.Mesh(basePlane, planeMaterial);
        var leftWall = new THREE.Mesh(longWallPlane, planeMaterial);
        var rightWall = new THREE.Mesh(longWallPlane, planeMaterial);
        var topWall = new THREE.Mesh(smallWallPlan, planeMaterial);
        var bottomWall = new THREE.Mesh(smallWallPlan, planeMaterial);
        var table = new THREE.Object3D();
        base.rotateZ(Math.PI/2);
        base.rotateY(Math.PI/2);
        table.add(base);
        leftWall.position.set(0, tableHeight/2, tableWidth/2);
        rightWall.position.set(0, tableHeight/2, -tableWidth/2);
        topWall.position.set(-tableDepth/2, tableHeight/2, 0);
        bottomWall.position.set(tableDepth/2, tableHeight/2, 0);
        topWall.rotateY(Math.PI/2);
        bottomWall.rotateY(Math.PI/2);
        table.add(leftWall);
        table.add(rightWall);
        table.add(topWall);
        table.add(bottomWall);
        this.obj = table;
    }
}

class Stick {
    constructor(xPos, zPos, direction) {
        this.xPos = xPos;
        this.zPos = zPos;
        this.yPos = ballRadius;
        let stick = new THREE.CylinderGeometry(stickSmallRadius, stickBigRadius, stickLength, 6);
        this.obj = new THREE.Object3D().add(new THREE.Mesh(stick, planeMaterial));
        this.obj.rotateZ(Math.PI/2);
        switch (direction) {
            case "down":
                this.angle = -Math.PI/2; 
                break;
            case "up":
                this.angle = Math.PI/2;
                break;
            case "right":
                this.angle = 0;
                break;
            case "left":
                this.angle = Math.PI;
                break;
        }
        this.obj.rotateX(this.angle);
        this.obj.position.set(this.xPos, this.yPos, this.zPos);
    }
}

function createTable() {
    var table = new Table();
    var leftStick = new Stick(-tableDepth/2 - stickLength/2 - 5 * scale, 0, "left");
    var rightStick = new Stick(tableDepth/2 + stickLength/2 + 5 * scale, 0, "right");
    var topLeftStick = new Stick(-tableDepth/4, - tableWidth/2 - stickLength/2 - 5 * scale, "up");
    var topRightStick = new Stick(tableDepth/4, - tableWidth/2 - stickLength/2 - 5 * scale, "up");
    var bottomLeftStick = new Stick(-tableDepth/4, tableWidth/2 + stickLength/2 + 5 * scale, "down");
    var bottomRightStick = new Stick(tableDepth/4, tableWidth/2 + stickLength/2 + 5 * scale, "down");
    for (var i = 0; i < nBalls; i++) {
        var ball = new Ball();
        balls.push(ball);
        scene.add(balls[i].obj);
    }
    scene.add(table.obj);
    scene.add(leftStick.obj);
    scene.add(rightStick.obj);
    scene.add(topLeftStick.obj);
    scene.add(topRightStick.obj);
    scene.add(bottomLeftStick.obj);
    scene.add(bottomRightStick.obj);
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper(50));
    createTable();
}

function createCamera() {
    'use strict';
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, near, far);
    camera.position.x = 0;
    camera.position.y = 200;
    camera.position.z = 0;
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
    var delta = clock.getDelta();
    for (var i = 0; i < nBalls; i++) {
        balls[i].update(delta, i);
    }
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    clock = new THREE.Clock();
    
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
        camera.position.x = 200;
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