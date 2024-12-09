import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import gsap from 'gsap';
import GUI from 'lil-gui';

// Debug UI
const gui = new GUI();
const debugObject = {};

// Base

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
debugObject.color = '#3a6ea6';

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: debugObject.color });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

gui.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('x axis');
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('y axis');
gui.add(mesh.position, 'z').min(-3).max(1).step(0.01).name('z axis');
gui.add(mesh, 'visible');
gui.add(material, 'wireframe');
gui.addColor(debugObject, 'color').onChange(() => material.color.set(debugObject.color));

// Sizes
const sizes = {
	width: innerWidth,
	height: innerHeight,
};

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = innerWidth;
	sizes.height = innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
});

// Toggle fullscreen
window.addEventListener('dblclick', () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Spin animation
	mesh.rotation.y = (Math.PI / 4) * elapsedTime;

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	requestAnimationFrame(tick);
};

tick();
