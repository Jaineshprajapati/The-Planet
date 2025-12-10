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
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/moonlit_golf_1k.hdr",
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
  }
);

const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const radius = 1.3;
const segments = 64;
const orbitRadius = 4.5;
const textures = [
  "../public/csilla/color.png",
  "../public/earth/map.jpg",
  "../public/venus/map.jpg",
  "../volcanic/color.png",
];
// Correction: add Meshes to spheres Group so GSAP will animate their rotation
const spheres = new THREE.Group();

// Create a large sphere to serve as the background with stars texture
const starsGeometry = new THREE.SphereGeometry(50, 64, 64);
const starsTexture = new THREE.TextureLoader().load(starsTextureUrl);
starsTexture.colorSpace = THREE.SRGBColorSpace;

const starsMaterial = new THREE.MeshStandardMaterial({
  map: starsTexture,
  side: THREE.BackSide
});
const starsSphere = new THREE.Mesh(starsGeometry, starsMaterial);
scene.add(starsSphere);

const sphereMesh = [];

for (let i = 0; i < 4; i++) {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(textures[i]);
  texture.colorSpace = THREE.SRGBColorSpace;
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const sphere = new THREE.Mesh(geometry, material);

sphereMesh.push(sphere);


  const angle = (i / 4) * (Math.PI * 2);
  sphere.position.x = orbitRadius * Math.cos(angle);
  sphere.position.z = orbitRadius * Math.sin(angle);

  spheres.add(sphere); // Fix: add each sphere mesh to the group
}

// Correct group rotation, and add grouped spheres to scene
spheres.rotation.x = 0.1;
spheres.position.y = -0.8;
scene.add(spheres);

let lastWheelTime = 0;
const throttleDelay = 2000;
let scrollCount = 0;

window.addEventListener("wheel", (event) => {

  const now = Date.now();
  if (now - lastWheelTime >= throttleDelay) {
    lastWheelTime = now;
    const direction =  event.deltaY > 0 ? "down" : "up";

    scrollCount = (scrollCount + 1) % 4;
    console.log(scrollCount);
   
    const headings = document.querySelectorAll(".heading");
    gsap.to(headings, {
      duration: 1,
      y: `-=${100}%`,
      ease:"power2.inOut"
    });

    gsap.to(spheres.rotation, {
          y: `-=${Math.PI / 2}%`,
          duration: 1,
          ease: 'power2.inOut',
        });

    if(scrollCount === 0){
      gsap.to(headings, {
        duration: 1,
        y: `0`, 
        ease:"power2.inOut"
      });
    }
  }
});


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
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta(); // Get time difference since last frame
  for (let i = 0; i < sphereMesh.length; i++) {
    const sphere = sphereMesh[i];
    sphere.rotation.y += delta * 0.1; // Use delta, smaller speed factor
  }
  renderer.render(scene, camera);
}
animate();
