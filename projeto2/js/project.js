var scale = 5;
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
var cube = new THREE.BoxGeometry(tableWidth, ballRadius, tableDepth);
//var table = new THREE.ExtrudeGeometry(cube, extrudeSettings);
// var tableHoe

var extrudeSettings = {
	steps: 2,
	depth: tableDepth - 5,
	bevelEnabled: false
	// bevelEnabled: true,
	// bevelThickness: 1,
	// bevelSize: 1,
	// bevelOffset: 0,
	// bevelSegments: 1
};

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
    mesh = new THREE.Mesh(table, tableMaterial);
    table = new THREE.Object3D();
    table.add(mesh);
    scene.add(table);
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    createMesa();
}

function createCamera() {
    'use strict';
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, near, far);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 200 * scale;
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
    /*
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    */
    window.addEventListener("resize", onResize);
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

    if (camera1) {
        camera.position.x = 0;
        camera.position.y = 0;
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