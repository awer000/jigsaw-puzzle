

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(0, 10, 0);
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;

scene.add(new THREE.GridHelper(10, 10));

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var plane = new THREE.Plane();
var pNormal = new THREE.Vector3(0, 1, 0); // plane's normal
var planeIntersect = new THREE.Vector3(); // point of intersection with the plane
var pIntersect = new THREE.Vector3(); // point of intersection with an object (plane's point)
var shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
var isDragging = false;
var dragObject;

// cube
const geometry = new THREE.BoxGeometry(1, 0.001, 1);
const material = new THREE.MeshBasicMaterial({ color: 'pink' });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(-0.5, 0, -0.5)

const geometry2 = new THREE.BoxGeometry(1, 0.001, 1);
const material2 = new THREE.MeshBasicMaterial({ color: 'yellow' });
const cube2 = new THREE.Mesh(geometry2, material2);
cube2.position.set(0.5, 0, -0.5)

scene.add(cube, cube2);

// events
document.addEventListener("mousemove", event => {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    if (isDragging) {
        raycaster.ray.intersectPlane(plane, planeIntersect);
        dragObject.position.addVectors(planeIntersect, shift);
    }
});

document.addEventListener("mousedown", () => {
    var intersects = raycaster.intersectObjects([cube, cube2]);
    
    if (intersects.length > 0) {
        pIntersect.copy(intersects[0].point);
        plane.setFromNormalAndCoplanarPoint(pNormal, pIntersect);
        shift.subVectors(intersects[0].object.position, intersects[0].point);
        isDragging = true;
        dragObject = intersects[0].object;

    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    dragObject = null;
});


renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
})

