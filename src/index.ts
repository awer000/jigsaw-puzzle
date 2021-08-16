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

// cube 만들기

const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
const material = new THREE.MeshBasicMaterial({ color: 'pink' });
const cube = new THREE.Mesh(geometry, material);

const geometry2 = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
const material2 = new THREE.MeshBasicMaterial({ color: 'yellow' });
const cube2 = new THREE.Mesh(geometry2, material2);
cube2.position.set(0, 1, 0)

const geometry3 = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
const material3 = new THREE.MeshBasicMaterial({ color: 'gray' });
const cube3 = new THREE.Mesh(geometry3, material3);
cube3.position.set(-1, 0, 0)


// 만든 큐브 추가
scene.add(cube, cube2, cube3);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.render(scene, camera);

const raycaster = new THREE.Raycaster();
let selected, beforeColor

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
            if (!selected) {
                selected = intersects[i].object
                if (!beforeColor) {
                    beforeColor = { ...selected.material.color }
                }
                selected.material.color.set('blue')
            } else {
                if (selected === intersects[i].object) {
                    if (!beforeColor) {
                        beforeColor = { ...selected.material.color }
                    }
                    selected.material.color.set('blue')
                } else {
                    // 바로 전 선택 색깔 되돌리기

                    if (beforeColor) {
                        const { r, g, b } = beforeColor
                        selected.material.color.set(new THREE.Color(r, g, b))
                        beforeColor = null
                    }


                    // 지금 선택한 것을 selected로 선택하고 beforeColor 설정하기
                    selected = intersects[i].object
                    if (!beforeColor) {
                        beforeColor = { ...selected.material.color }
                    }
                    selected.material.color.set('blue')

                }
            }
        }
    }

    if (!intersects.length && selected && beforeColor) {
        const { r, g, b } = beforeColor
        selected.material.color.set(new THREE.Color(r, g, b))
        beforeColor = null
    }
}

const draw = () => {
    requestAnimationFrame(draw);
    renderer.render(scene, camera);
}

window.addEventListener('mousemove', onMouseMove, false);
window.requestAnimationFrame(draw);



