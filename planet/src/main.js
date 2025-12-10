import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import gsap from "gsap";
import starsTextureUrl from "../public/stars.jpg";

// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 9;

const loader = new RGBELoader();
loader.load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/golden_gate_hills_1k.hdr",
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
  }
);

// Create renderer with device pixel ratio
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const radius = 1.3;
const segments = 64;
const orbitRadius = 4.5;
const colors = [0x44aa88, 0x8844aa, 0xaa8844, 0x4488aa];
const textures = [
  "../public/csilla/color.png",
  "../public/earth/map.jpg",
  "../public/venus/map.jpg",
  "../volcanic/color.png",
];
// Correction: add Meshes to spheres Group so GSAP will animate their rotation
const spheres = new THREE.Group();

for (let i = 0; i < 4; i++) {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(textures[i]);

  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const sphere = new THREE.Mesh(geometry, material);




  const angle = (i / 4) * (Math.PI * 2);
  sphere.position.x = orbitRadius * Math.cos(angle);
  sphere.position.z = orbitRadius * Math.sin(angle);

  spheres.add(sphere); // Fix: add each sphere mesh to the group
}

// Correct group rotation, and add grouped spheres to scene
spheres.rotation.x = 0.1;
spheres.position.y = -0.8;
scene.add(spheres);

// Handle resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

// setInterval(() => {
//   gsap.to(spheres.rotation, {
//     y: spheres.rotation.y + Math.PI / 2,
//     duration: 2,
//     ease: 'expo.easeinOut',
//   });
// }, 2500);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
