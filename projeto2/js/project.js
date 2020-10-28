var camera, orthographicCamera, perspectiveCamera, scene, renderer;
var scale = 3;
var clock;
var near = 1, far = 1000 * scale;
var camera1, camera2, camera3;
var ballRadius = 5 * scale;
var stickLength = 80 * scale;
var stickSmallRadius = 0.9 * scale, stickBigRadius = 3 * scale;
var tableHoleRadius = 5 * scale;
var tableWidth = 100 * scale, tableDepth = 200 * scale;
var minSpeed = -10, maxSpeed = 10;
var minDistance = 1;
var holes = [];
var balls = [];
var sticks = [];
var nBalls = 16;
var newNrBalls = 16;
var nSticks = 6;
var pink = new THREE.Color(0xb57aae);
var blue = new THREE.Color(0x55647e );
var green = new THREE.Color(0x64b1a4);
var ambar = new THREE.Color(0xcbbba1);
var brown = new THREE.Color(0x8e8270);
var white = new THREE.Color(0xffffff);
var holeMaterial = new THREE.MeshBasicMaterial({ color: ambar, wireframe: false });
var whiteBallMaterial = new THREE.MeshBasicMaterial({ color: white, wireframe: false });
var ballMaterial = new THREE.MeshBasicMaterial({ color: pink, wireframe: true });
var stickMaterial = new THREE.MeshBasicMaterial({ color: blue, wireframe: false });
var highlightMaterial = new THREE.MeshBasicMaterial({ color: pink, wireframe: false });
var planeMaterial = new THREE.MeshBasicMaterial({ color: blue, wireframe: false });
var baseMaterial = new THREE.MeshBasicMaterial({ color: green, wireframe: false });
var wallMaterial = new THREE.MeshBasicMaterial({ color: brown, wireframe: false });
var sticksMat = [stickMaterial, stickMaterial, stickMaterial, stickMaterial, stickMaterial, stickMaterial];
var leftArrow = false;
var rightArrow = false;
var spaceKey = false;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

class Ball {
    constructor() {
        var z = getRandomArbitrary(-tableWidth/2 + ballRadius, tableWidth/2 - ballRadius);
        var x = getRandomArbitrary(-tableDepth/2 + ballRadius, tableDepth/2 - ballRadius);
        var y = ballRadius;
        this.speed = new THREE.Vector3(getRandomArbitrary(minSpeed, maxSpeed), 0, getRandomArbitrary(minSpeed, maxSpeed));
        var sphere = new THREE.SphereGeometry(ballRadius, 8, 8);
        var mesh = new THREE.Mesh(sphere, ballMaterial);
        var ball = new THREE.Object3D().add(mesh);
        ball.add(new THREE.AxisHelper(2 * ballRadius));
        ball.position.set(x, y, z);


        var vec = new THREE.Vector3(1, 0, 0);
        this.angle = vec.angleTo(this.speed);
        if (this.speed.getComponent(2) > 0) this.angle = -this.angle;
        ball.rotateY(this.angle);

        this.obj = ball;

        this.nextPos = new THREE.Vector3(x, y, z);
        this.nextSpeed = new THREE.Vector3();
        this.nextSpeed.copy(this.speed);
        this.falling = false;

    }

    computePosition(delta) {
        if (!this.falling) {  
            this.nextSpeed.multiplyScalar(1 - delta);
        }
        else {
            this.nextSpeed.multiplyScalar((1 + delta) * scale);
        }
        this.nextPos.add(this.nextSpeed);
    }

    intersectsTable() {
        return !(this.nextPos.getComponent(0) >= (-tableDepth/2 + ballRadius) &&
                this.nextPos.getComponent(0) <= (tableDepth/2 - ballRadius) &&
                this.nextPos.getComponent(2) >= (-tableWidth/2 + ballRadius) &&
                this.nextPos.getComponent(2) <= (tableWidth/2 - ballRadius));
    }

    computeTableRicochet() {
        var x = this.nextPos.getComponent(0);
        var z = this.nextPos.getComponent(2);
        if (x <= (-tableDepth/2 + ballRadius) || x >= (tableDepth/2 - ballRadius))
            this.nextSpeed.setComponent(0, -this.nextSpeed.getComponent(0));
        if (z <= (-tableWidth/2 + ballRadius) || z >= (tableWidth/2 - ballRadius))
            this.nextSpeed.setComponent(2, -this.nextSpeed.getComponent(2));
        if (x <= (-tableDepth/2 + ballRadius))
            this.nextPos.setComponent(0, -tableDepth/2 + ballRadius + minDistance);
        if (x >= (tableDepth/2 - ballRadius))
            this.nextPos.setComponent(0, tableDepth/2 - ballRadius - minDistance);
        if (z <= (-tableWidth/2 + ballRadius))
            this.nextPos.setComponent(2, -tableWidth/2 + ballRadius + minDistance);
        if (z >= (tableWidth/2 - ballRadius))
            this.nextPos.setComponent(2, tableWidth/2 - ballRadius - minDistance);
    }

    intersectsBall(ball) {
        if (ball.falling) return false;
        var x = this.nextPos.getComponent(0);
        var z = this.nextPos.getComponent(2);
        var distance = Math.sqrt((x - ball.nextPos.getComponent(0)) * (x - ball.nextPos.getComponent(0)) +
                                 (z - ball.nextPos.getComponent(2)) * (z - ball.nextPos.getComponent(2)));
        return distance < 2 * ballRadius;
    }

    computeBallRicochet(ball) {
        var ricochetVector = new THREE.Vector3();
        ricochetVector.set(this.obj.position.getComponent(0) - ball.obj.position.getComponent(0), 0, this.obj.position.getComponent(2) - ball.obj.position.getComponent(2));
        var overlap = (2 * ballRadius - ricochetVector.length()) / 2;
        ricochetVector.setLength(overlap + minDistance * 2);
        this.nextPos.add(ricochetVector);
        var speed = this.nextSpeed;
        this.nextSpeed = ball.nextSpeed;
        ball.nextSpeed = speed;
    }

    intersectsHole(hole) {
        var x = this.nextPos.getComponent(0);
        var z = this.nextPos.getComponent(2);
        var distance = Math.sqrt((x - hole.position.getComponent(0)) * (x - hole.position.getComponent(0)) +
                                 (z - hole.position.getComponent(2)) * (z - hole.position.getComponent(2)));
        return distance;
    }

    computeFall(hole, distance) {
        var directionVector = new THREE.Vector3();
        var x = this.nextPos.getComponent(0);
        var z = this.nextPos.getComponent(2);
        directionVector.set(hole.position.getComponent(0) - x, 0, hole.position.getComponent(2) - z);
        if (distance <= ballRadius / scale) {
            this.nextSpeed = new THREE.Vector3(0, -1, 0);
            this.falling = true;
        }
        else {
            var l = this.nextSpeed.length;
            directionVector.setLength(l);
            this.nextSpeed.add(directionVector);
        }
    }

    update(delta) {
        this.obj.rotateY(-this.angle);
        var vec = new THREE.Vector3(1, 0, 0);
        this.angle = vec.angleTo(this.nextSpeed);
        if (this.speed.getComponent(2) > 0) this.angle = -this.angle;
        this.obj.rotateY(this.angle);
        
        var dx = this.nextPos.getComponent(0) - this.obj.position.getComponent(0);
        var dz = this.nextPos.getComponent(2) - this.obj.position.getComponent(2);
        var d = Math.sqrt((dx * dx) + (dz * dz));

        // console.log(this.obj.rotation.z);
        // this.obj.rotation.z -= d / ballRadius;
        // var axis = new THREE.Vector3(0, 0, dz);
        // this.obj.rotateOnAxis(axis, d / ballRadius);
        // this.obj.rotateZ(-d / ballRadius);
 
        this.speed.copy(this.nextSpeed);
        this.obj.position.set(this.nextPos.getComponent(0), this.nextPos.getComponent(1), this.nextPos.getComponent(2));
        this.computePosition(delta);

    }

    checkCollisions(delta, index) {
        // if (!balls[index].falling) {
            if (this.intersectsTable())
                this.computeTableRicochet();
            for (var i = index + 1; i < nBalls; i++) {

                for (var j = 0; j < 6; j++) {
                    var distance = balls[i].intersectsHole(holes[j]);
                    if (distance < ballRadius + scale) {
                        balls[i].computeFall(holes[j], distance);
                    }
                }
                if (this.intersectsBall(balls[i])) {
                    this.computeBallRicochet(balls[i]);
                }
            }
        // }
    }
}

// class WhiteBall extends Ball {
//     constructor() {
//         super();
//         this.speed = new THREE.Vector3();
//         this.nextSpeed = new THREE.Vector3();
//         this.angle = 0;
//         this.nextPos = new THREE.Vector3();
//         var sphere = new THREE.SphereGeometry(ballRadius, 32, 32);
//         var mesh = new THREE.Mesh(sphere, whiteBallMaterial);
//         this.obj = new THREE.Object3D().add(mesh);
//         this.obj.position.set(0, 4 * ballRadius, 0);
//     }

//     // update(delta) { super.update(delta); }
// }

class Table {
    constructor() {
        var tableHeight = ballRadius * 3;
        var basePlane = new THREE.PlaneGeometry(tableWidth, tableDepth, 10);
        var longWallPlane = new THREE.PlaneGeometry(tableDepth, tableHeight, 10, 10);
        var smallWallPlan = new THREE.PlaneGeometry(tableWidth, tableHeight, 10, 10);
        var circle = new THREE.CircleGeometry(ballRadius + scale, 32);
        var base = new THREE.Mesh(basePlane, baseMaterial);
        var leftWall = new THREE.Mesh(longWallPlane, wallMaterial);
        var rightWall = new THREE.Mesh(longWallPlane, wallMaterial);
        var topWall = new THREE.Mesh(smallWallPlan, wallMaterial);
        var bottomWall = new THREE.Mesh(smallWallPlan, wallMaterial);
        var hole1 = new THREE.Mesh(circle, holeMaterial);
        var hole2 = new THREE.Mesh(circle, holeMaterial);
        var hole3 = new THREE.Mesh(circle, holeMaterial);
        var hole4 = new THREE.Mesh(circle, holeMaterial);
        var hole5 = new THREE.Mesh(circle, holeMaterial);
        var hole6 = new THREE.Mesh(circle, holeMaterial);
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
        hole1.position.set(-tableDepth/2 + ballRadius + scale, 0.1, -tableWidth/2 + ballRadius + scale);
        hole2.position.set(0, 0.1, -tableWidth/2 + ballRadius + scale);
        hole3.position.set(tableDepth/2 - ballRadius - scale, 0.1, -tableWidth/2 + ballRadius + scale);
        hole4.position.set(tableDepth/2 - ballRadius - scale, 0.1, tableWidth/2 - ballRadius - scale);
        hole5.position.set(0, 0.1, tableWidth/2 - ballRadius - scale);
        hole6.position.set(-tableDepth/2 + ballRadius + scale, 0.1, tableWidth/2 - ballRadius - scale);
        hole1.rotateZ(Math.PI/2);
        hole1.rotateY(Math.PI/2);
        hole2.rotateZ(Math.PI/2);
        hole2.rotateY(Math.PI/2);
        hole3.rotateZ(Math.PI/2);
        hole3.rotateY(Math.PI/2);
        hole4.rotateZ(Math.PI/2);
        hole4.rotateY(Math.PI/2);
        hole5.rotateZ(Math.PI/2);
        hole5.rotateY(Math.PI/2);
        hole6.rotateZ(Math.PI/2);
        hole6.rotateY(Math.PI/2);
        holes.push(hole1);
        holes.push(hole2);
        holes.push(hole3);
        holes.push(hole4);
        holes.push(hole5);
        holes.push(hole6);
        table.add(leftWall);
        table.add(rightWall);
        table.add(topWall);
        table.add(bottomWall);
        table.add(hole1);
        table.add(hole2);
        table.add(hole3);
        table.add(hole4);
        table.add(hole5);
        table.add(hole6);
        this.obj = table;
    }
}

class Stick {
    constructor(xPos, zPos, direction) {
        this.xPos = xPos;
        this.zPos = zPos;
        this.yPos = ballRadius;
        var stick = new THREE.CylinderGeometry(stickSmallRadius, stickBigRadius, stickLength, 6);
        this.mesh = new  THREE.Mesh(stick, new THREE.MeshBasicMaterial({ color: blue, wireframe: false }));
        var obj = new THREE.Object3D().add(this.mesh);
        obj.position.set(0, - stickLength / 2, 0);
        this.rotation = 0;

        this.whiteBall = new Ball(); 
        this.whiteBall.speed = new THREE.Vector3();
        this.whiteBall.nextSpeed = new THREE.Vector3();
        this.whiteBall.angle = 0;
        this.whiteBall.nextPos = new THREE.Vector3();
        var sphere = new THREE.SphereGeometry(ballRadius, 32, 32);
        var mesh = new THREE.Mesh(sphere, whiteBallMaterial);
        this.whiteBall.obj = new THREE.Object3D().add(mesh);
        this.whiteBall.obj.position.set(0, 4 * ballRadius, 0);

        this.obj = new THREE.Object3D().add(obj);
        this.obj.rotateZ(Math.PI/2);
        this.select = false;
        
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
        
        this.obj.add(new THREE.AxisHelper(2 * ballRadius));
        this.obj.rotateX(this.angle);
        this.obj.position.set(this.xPos, this.yPos, this.zPos);
    }

    rotateStick() {
        var rotation = 0.03;
        if (this.select && (rightArrow || leftArrow)) {
            if (leftArrow)
                rotation = -rotation;
            if ((this.rotation <= Math.PI / 3 && rightArrow) || (this.rotation >= -Math.PI / 3 && leftArrow)) {
                this.rotation += rotation;
                this.obj.rotateOnAxis(new THREE.Vector3(1,0,0), rotation);
            }
        }
    }

    processWhiteBall() {
        this.obj.add(this.whiteBall.obj);
        if (spaceKey) {
            var ball = new Ball();
            ball = Object.assign({}, this.whiteBall);
            balls.push(ball);
            nBalls += 1;
            console.log(nBalls);
            
            this.obj.remove(this.whiteBall.obj);
            console.log(balls[nBalls-1].obj.position);
        }

    }
}

function createTable() {
    var table = new Table();
    var leftStick = new Stick(-tableDepth/2 - 5 * scale, 0, "left");
    var rightStick = new Stick(tableDepth/2 + 5 * scale, 0, "right");
    var topLeftStick = new Stick(-tableDepth/4, - tableWidth/2 - 5 * scale, "up");
    var topRightStick = new Stick(tableDepth/4, - tableWidth/2 - 5 * scale, "up");
    var bottomLeftStick = new Stick(-tableDepth/4, tableWidth/2 + 5 * scale, "down");
    var bottomRightStick = new Stick(tableDepth/4, tableWidth/2 + 5 * scale, "down");
    sticks.push(leftStick);
    sticks.push(rightStick);
    sticks.push(topLeftStick);
    sticks.push(topRightStick);
    sticks.push(bottomLeftStick);
    sticks.push(bottomRightStick);
    for (var i = 0; i < nBalls; i++) {
        var ball = new Ball();
        balls.push(ball);
        scene.add(balls[i].obj);
    }
    for (var i = 0; i < sticks.length; i++) {
        scene.add(sticks[i].obj);
    }
    scene.add(table.obj);
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdfd6c6);
    createTable();
}

function createCamera() {
    'use strict';
    var width = window.innerWidth;
    var height = window.innerHeight;
    orthographicCamera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, near, far);
    orthographicCamera.position.x = 0;
    orthographicCamera.position.y = 200 * scale;
    orthographicCamera.position.z = 0;
    perspectiveCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, near, far);
    perspectiveCamera.position.x = 150 * scale;
    perspectiveCamera.position.y = 150 * scale;
    perspectiveCamera.position.z = 150* scale;
    camera = orthographicCamera;
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
    console.log(nBalls);
    renderer.render(scene, camera);
    var delta = clock.getDelta();
    for (var i = 0; i < nBalls; i++) {
        // console.log(i);
        balls[i].update(delta);
    }
    for (var i = 0; i < nBalls; i++) {
        if (!balls[i].falling)
            balls[i].checkCollisions(delta, i);
    }
    nBalls = newNrBalls;
    for (var i = 0; i < nSticks; i++) {
        if (sticks[i].select) {
            sticks[i].mesh.material.setValues(highlightMaterial);
            sticks[i].processWhiteBall();
        }
        else {
            sticks[i].mesh.material.setValues(stickMaterial);
            sticks[i].obj.remove(sticks[i].whiteBall.obj);
        }
        sticks[i].rotateStick();
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
        case 32: // space key
            spaceKey = true;
            break;
        case 37: // left arrow
            leftArrow = true;
            break;
        case 39: // right arrow
            rightArrow = true;
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
        case 52: // 4 select stick
        case 100: // 4 select stick
            sticks[0].select = !sticks[0].select;
            for (var i = 1; i < 6; i ++)
                sticks[i].select = false;
            break;
        case 53: // 5 select stick
        case 101: // 5 select stick
            sticks[1].select = !sticks[1].select;
            for (var i = 0; i < 6; i ++)
                if (i != 1)
                    sticks[i].select = false;
            break;
        case 54: // 6 select stick
        case 102: // 6 select stick
            sticks[2].select = !sticks[2].select;
            for (var i = 0; i < 6; i ++)
                if (i != 2)
                    sticks[i].select = false
            break;
        case 55: // 7 select stick
        case 103: // 7 select stick
            sticks[3].select = !sticks[3].select;
            for (var i = 0; i < 6; i ++)
                if (i != 3)
                    sticks[i].select = false
            break;
        case 56: // 8 select stick
        case 104: // 8 select stick
            sticks[4].select = !sticks[4].select;
            for (var i = 0; i < 6; i ++)
                if (i != 4)
                    sticks[i].select = false
            break;
        case 57: // 9 select stick
        case 105: // 9 select stick
            sticks[5].select = !sticks[5].select;
            for (var i = 0; i < 6; i ++)
                if (i != 5)
                    sticks[i].select = false
            break;
    }
}

function onKeyUp(e) {
    'use strict';
    switch (e.keyCode) {
        case 32: // space key
            spaceKey = false;
            break;
        case 37: // left arrow
            leftArrow = false;
            break;
        case 39: // right arrow
            rightArrow = false;
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
        orthographicCamera.position.x = 0;
        orthographicCamera.position.y = 400 * scale;
        orthographicCamera.position.z = 0;
        camera = orthographicCamera;
    }

    else if (camera2) {
        // perspectiveCamera.position.x = 0;
        // camera.position.y = 200;
        // camera.position.z = 0;
        camera = perspectiveCamera;

    }

    else if (camera3) {
        orthographicCamera.position.x = 400 * scale;
        orthographicCamera.position.y = 0;
        orthographicCamera.position.z = 0;
        camera = orthographicCamera;

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