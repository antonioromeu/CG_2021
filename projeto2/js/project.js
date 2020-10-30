var camera, orthographicCamera, perspectiveCamera2, perspectiveCamera3, scene, renderer;
var scale = 3;
var clock;
var near = 1, far = 10000 * scale;
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
var initialBalls = 16;
var nBalls = initialBalls;
var nSticks = 6;
var pink = new THREE.Color(0xb57aae);
var blue = new THREE.Color(0x55647e);
var green = new THREE.Color(0x64b1a4);
var ambar = new THREE.Color(0xcbbba1);
var brown = new THREE.Color(0x8e8270);
var white = new THREE.Color(0xffffff);
var holeMaterial = new THREE.MeshBasicMaterial({ color: ambar, wireframe: false });
var whiteBallMaterial = new THREE.MeshBasicMaterial({ color: white, wireframe: false });
var ballMaterial = new THREE.MeshBasicMaterial({ color: pink, wireframe: false });
var stickMaterial = new THREE.MeshBasicMaterial({ color: blue, wireframe: false });
var highlightMaterial = new THREE.MeshBasicMaterial({ color: pink, wireframe: false });
var planeMaterial = new THREE.MeshBasicMaterial({ color: blue, wireframe: false });
var baseMaterial = new THREE.MeshBasicMaterial({ color: green, wireframe: false });
var wallMaterial = new THREE.MeshBasicMaterial({ color: brown, wireframe: false });
var sticksMat = [stickMaterial, stickMaterial, stickMaterial, stickMaterial, stickMaterial, stickMaterial];
var leftArrow = false;
var rightArrow = false;
var spaceKey = false;
var ballDistance = ballRadius * 4;
var camPos = new THREE.Vector3(0, 0, 0);
var wallThickness = ballRadius / 2;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

class Ball {
    constructor(x, y, z, material) {
        this.speed = new THREE.Vector3(getRandomArbitrary(minSpeed, maxSpeed), 0, getRandomArbitrary(minSpeed, maxSpeed));
        var sphere = new THREE.SphereGeometry(ballRadius, 16, 16);
        var mesh = new THREE.Mesh(sphere, material);
        var ball = new THREE.Object3D().add(mesh);
        ball.add(new THREE.AxisHelper(2 * ballRadius));
        ball.position.set(x, y, z);
        var vec = new THREE.Vector3(1, 0, 0);
        this.angle = vec.angleTo(this.speed);
        if (this.speed.getComponent(2) > 0)
            this.angle = -this.angle;
        ball.rotateY(this.angle);

        this.obj = ball;

        this.nextPos = new THREE.Vector3(x, y, z);
        this.nextSpeed = new THREE.Vector3();
        this.nextSpeed.copy(this.speed);
        this.falling = false;

        this.d = 0;

    }

    computePosition(delta) {
        if (!this.falling)
            this.nextSpeed.multiplyScalar(1 - delta);
        else
            this.nextSpeed.multiplyScalar((1 + delta) * scale);
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
        if (ball.falling)
            return false;
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
        this.obj.rotateZ(-this.d * 1.5);
        
        this.obj.rotateY(-this.angle);
        var vec = new THREE.Vector3(1, 0, 0);
        this.angle = vec.angleTo(this.nextSpeed);
        if (this.speed.getComponent(2) > 0) this.angle = -this.angle;
        this.obj.rotateY(this.angle);
        
        var dx = this.nextPos.getComponent(0) - this.obj.position.getComponent(0);
        var dz = this.nextPos.getComponent(2) - this.obj.position.getComponent(2);
        this.d = Math.sqrt((dx * dx) + (dz * dz));

        this.obj.rotateZ(this.d * 1.5);
 
        this.speed.copy(this.nextSpeed);
        this.obj.position.set(this.nextPos.getComponent(0), this.nextPos.getComponent(1), this.nextPos.getComponent(2));
        this.computePosition(delta);
    }

    checkCollisions(index) {
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
    }
}

class Table {
    constructor() {
        var tableHeight = ballRadius * 3;
        var basePlane = new THREE.PlaneGeometry(tableWidth, tableDepth, 10);
        var longWallPlane = new THREE.BoxGeometry(tableDepth + (2 * wallThickness), tableHeight, wallThickness);
        var smallWallPlan = new THREE.BoxGeometry(tableWidth + (2 * wallThickness), tableHeight, wallThickness);
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
        leftWall.position.set(0, tableHeight/2, tableWidth/2 + (wallThickness / 2));
        rightWall.position.set(0, tableHeight/2, -tableWidth/2 - (wallThickness / 2));
        topWall.position.set(-tableDepth/2 - (wallThickness / 2), tableHeight/2, 0);
        bottomWall.position.set(tableDepth/2 + (wallThickness / 2), tableHeight/2, 0);
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
        obj.position.set(0, - stickLength / 2 - (2 * ballRadius), 0);
        this.rotation = 0;

        this.whiteBall = new Ball(); 
        this.whiteBall.speed.set(0, 0, 0);
        this.whiteBall.nextSpeed.set(0, 0, 0);
        this.whiteBall.angle = 0;
        this.whiteBall.nextPos.set(0, 0, 0);
        this.whiteBall.obj.position.set(0, 0, 0);

        var sphere = new THREE.SphereGeometry(ballRadius, 32, 32);
        var mesh = new THREE.Mesh(sphere, whiteBallMaterial);
        this.whiteBall.obj = new THREE.Object3D().add(mesh);
        this.whiteBall.obj.position.set(0, 0, 0);
        this.obj = new THREE.Object3D().add(obj);
        this.obj.rotateZ(Math.PI/2);
        this.select = false;

        this.ballPos = new THREE.Vector3(this.xPos, this.yPos, this.zPos);
        this.ballSpeed = new THREE.Vector3();
        
        switch (direction) {
            case "down":
                this.angle = -Math.PI/2;
                this.ballPos.setComponent(2, this.zPos);
                this.ballSpeed.set(0, 0, -maxSpeed);
                break;
            case "up":
                this.angle = Math.PI/2;
                this.ballPos.setComponent(2, this.zPos);
                this.ballSpeed.set(0, 0, maxSpeed);
                break;
            case "right":
                this.angle = 0;
                this.ballPos.setComponent(0, this.xPos);
                this.ballSpeed.set(-maxSpeed, 0, 0);
                break;
            case "left":
                this.angle = Math.PI;
                this.ballPos.setComponent(0, this.xPos);
                this.ballSpeed.set(maxSpeed, 0, 0); 
                break;
        }
        
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
                this.obj.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotation);
                console.log(rotation);
            }
        }
    }
}

function createTable() {
    var table = new Table();
    var leftStick = new Stick(-tableDepth/2 + ballRadius, 0, "left");
    var rightStick = new Stick(tableDepth/2 - ballRadius, 0, "right");
    var topLeftStick = new Stick(-tableDepth/4, - tableWidth/2 + ballRadius, "up");
    var topRightStick = new Stick(tableDepth/4, - tableWidth/2 + ballRadius, "up");
    var bottomLeftStick = new Stick(-tableDepth/4, tableWidth/2 - ballRadius, "down");
    var bottomRightStick = new Stick(tableDepth/4, tableWidth/2 - ballRadius, "down");
    sticks.push(leftStick);
    sticks.push(rightStick);
    sticks.push(topLeftStick);
    sticks.push(topRightStick);
    sticks.push(bottomLeftStick);
    sticks.push(bottomRightStick);
    for (var i = 0; i < nBalls; i++) {
        var z = getRandomArbitrary(-tableWidth/2 + ballRadius, tableWidth/2 - ballRadius);
        var x = getRandomArbitrary(-tableDepth/2 + ballRadius, tableDepth/2 - ballRadius);
        var y = ballRadius;
        var ball = new Ball(x, y, z, ballMaterial);
        balls.push(ball);
        scene.add(balls[i].obj);
    }
    for (var i = 0; i < sticks.length; i++)
        scene.add(sticks[i].obj);
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
    perspectiveCamera2 = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, near, far);
    perspectiveCamera3 = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, near, far);
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
    renderer.render(scene, camera);
    var delta = clock.getDelta();
    for (var i = 0; i < nBalls; i++)
        balls[i].update(delta);
    
    for (var i = 0; i < nBalls; i++)
        if (!balls[i].falling)
            balls[i].checkCollisions(i);
    
    for (var i = 0; i < nSticks; i++) {
        if (sticks[i].select) {
            sticks[i].mesh.material.setValues(highlightMaterial);
            sticks[i].obj.add(sticks[i].whiteBall.obj);
            if (spaceKey) {
                var ball = new Ball(sticks[i].ballPos.getComponent(0), sticks[i].ballPos.getComponent(1), sticks[i].ballPos.getComponent(2), whiteBallMaterial);
                var speed = new THREE.Vector3(0, 0, 0);
                speed.copy(sticks[i].ballSpeed);
                speed.applyAxisAngle(new THREE.Vector3(0, 1, 0), sticks[i].rotation);
                ball.speed.set(speed.getComponent(0), speed.getComponent(1), speed.getComponent(2));
                ball.nextSpeed.set(speed.getComponent(0), speed.getComponent(1), speed.getComponent(2));
                balls.push(ball);
                nBalls += 1;
                scene.add(ball.obj);

                sticks[i].obj.remove(sticks[i].whiteBall.obj);
                sticks[i].select = false;

                camPos.set(-speed.getComponent(0), (4 * ballRadius), - speed.getComponent(2));
                camPos.setLength(scale * 80);
            }
        }
        else {
            sticks[i].mesh.material.setValues(stickMaterial);
            sticks[i].obj.remove(sticks[i].whiteBall.obj);
        }
        sticks[i].rotateStick();
    }

    if (camera3 && initialBalls < nBalls) {
        var b = balls[nBalls - 1];
        perspectiveCamera3.position.x = b.obj.position.getComponent(0) + camPos.getComponent(0);
        perspectiveCamera3.position.y = b.obj.position.getComponent(1) + camPos.getComponent(1);
        perspectiveCamera3.position.z = b.obj.position.getComponent(2) + camPos.getComponent(2);
        camera = perspectiveCamera3;
        camera.lookAt(b.obj.position);
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
            camera2 = false;
            camera3 = false;
            break;
        case 50: // 2 top view
        case 98: // 2 top view
            camera2 = true;
            camera1 = false;
            camera3 = false;
            break;
        case 51: // 3 side view
        case 99: // 3 side view
            camera3 = true;
            camera1 = false;
            camera2 = false;
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
    }
}

function animate() {
    'use strict';
    if (camera1) {
        orthographicCamera.position.x = 0;
        orthographicCamera.position.y = 400 * scale;
        orthographicCamera.position.z = 0;
        camera = orthographicCamera;
        camera.lookAt(scene.position);
    }

    else if (camera2) {
        perspectiveCamera2.position.x = 150 * scale;
        perspectiveCamera2.position.y = 150 * scale;
        perspectiveCamera2.position.z = 150 * scale;
        camera = perspectiveCamera2;
        camera.lookAt(scene.position);
    }
    else if (camera3) {
        if (initialBalls < nBalls) {
            var b = balls[nBalls - 1];
            perspectiveCamera3.position.x = b.obj.position.getComponent(0) + camPos.getComponent(0);
            perspectiveCamera3.position.y = b.obj.position.getComponent(1) + camPos.getComponent(1);
            perspectiveCamera3.position.z = b.obj.position.getComponent(2) + camPos.getComponent(2);
            camera = perspectiveCamera3;
            camera.lookAt(b.obj.position);
        }
    }


    render();
    requestAnimationFrame(animate);
}