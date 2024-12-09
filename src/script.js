import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import gsap from 'gsap';
import GUI from 'lil-gui';

// Debug UI
const gui = new GUI({
	width: 300,
	title: 'Debug UI',
	closeFolders: false,
});

// gui.close();
// gui.hide();

window.addEventListener('keydown', (event) => {
	if (event.key === 'g') {
		gui.show(gui._hidden);
	}
});

// Object
const debugObject = {
	color: '#db0f0f',
	subdivision: 2,
	spin: () => {
		gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 });
	},
};

// Base

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// GUI Folders
const axesTweaks = gui.addFolder('Axes');
const utilityTweaks = gui.addFolder('Utilities');
const otherTweaks = gui.addFolder('Other');
// otherTweaks.close();

axesTweaks.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('x axis');
axesTweaks.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('y axis');
axesTweaks.add(mesh.position, 'z').min(-3).max(1).step(0.01).name('z axis');
utilityTweaks.add(mesh, 'visible');
utilityTweaks.add(material, 'wireframe');
otherTweaks.addColor(debugObject, 'color').onChange(() => material.color.set(debugObject.color));
otherTweaks.add(debugObject, 'spin').name('spin');
otherTweaks
	.add(debugObject, 'subdivision')
	.min(1)
	.max(10)
	.step(1)
	.onFinishChange(() => {
		mesh.geometry.dispose();
		mesh.geometry = new THREE.BoxGeometry(
			1,
			1,
			1,
			debugObject.subdivision,
			debugObject.subdivision,
			debugObject.subdivision
		);
	});

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
