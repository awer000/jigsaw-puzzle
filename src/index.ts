import * as THREE from 'three';


const mouse = new THREE.Vector2();
const canvas = document.getElementById('jigsaw');

const fov = 90;
const aspect = 1;  // the canvas default
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 10;

const scene = new THREE.Scene();

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
const material = new THREE.MeshBasicMaterial({ color: 'pink' });  // greenish blue

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.render(scene, camera);

const raycaster = new THREE.Raycaster();
let selected

function onMouseMove(event) {
    event.preventDefault();

    const offset = document.getElementById('jigsaw').getBoundingClientRect();
    const pos = {
        x: event.pageX - offset.left,
        y: event.pageY - offset.top
    };

    mouse.x = (pos.x / 1024) * 2 - 1;
    mouse.y = -(pos.y / 1024) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);


    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object) {
            selected = intersects[i].object
            selected.material.color.set('blue')
        }
    }

    if (!intersects.length && selected) {
        selected.material.color.set('pink')
    }
}

const draw = () => {
    requestAnimationFrame(draw);
    renderer.render(scene, camera);
}

window.addEventListener('mousemove', onMouseMove, false);
window.requestAnimationFrame(draw);



