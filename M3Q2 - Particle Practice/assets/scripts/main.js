// Stephanie Pearl F. Virtudazo - A223
// Computer Graphics Computing Module 3 Quiz 2

import * as THREE from './three.module.js';
import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(1, 7, 30);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let textMesh = new THREE.Mesh();
let stars, starGeo;

lighting();
text();
particles();

// Create particles
function particles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(Math.random() * 600 - 300, Math.random() * 600 - 300, Math.random() * 600 - 300);
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("./assets/images/star.png");
  let starMaterial = new THREE.PointsMaterial({ size: 0.7, map: sprite }); 

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);

  setInterval(changeColor, 3000);
}

// Function to animate particles
function animateParticles() {
  const positions = starGeo.attributes.position;

  for (let i = 0; i < positions.count; i++) {
    positions.setY(i, positions.getY(i) - 0.9);

    if (positions.getY(i) < -300) {
      positions.setY(i, 300);
    }
  }

  positions.needsUpdate = true;
}

// Function to change color of particles
function changeColor() {
  const r = Math.random();
  const g = Math.random();
  const b = Math.random();

  stars.material.color.setRGB(r, g, b);
}

// Function to create text
function text() {
  const texture = new THREE.TextureLoader().load("./assets/textures/wooden.jpg");

  const loader = new FontLoader();
  loader.load('./assets/fonts/Super Easy_Regular.json', function (font) {
    const textGeometry = new TextGeometry('STEPHIE', { font: font, size: 10, height: 1 })

    textGeometry.center();
    const textMaterial = new THREE.MeshBasicMaterial({ map: texture });
    textMesh = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(textMesh);

  });

  textMesh.position.z = 0;
  camera.position.x = 0;
}

// Set up lighting
function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

// Animate scene
function animate() {
  requestAnimationFrame(animate);

  animateParticles();

  textMesh.rotation.x += 0.008;
  textMesh.rotation.y += 0.008;
  renderer.render(scene, camera);
}

animate();
