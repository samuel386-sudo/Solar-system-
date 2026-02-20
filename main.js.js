// Scene Setup
const canvas = document.getElementById('scene-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000010);

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 10000);
camera.position.set(0, 200, 400);

// Renderer
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 2, 0);
scene.add(sunLight);

// Planets data
const planetsData = [
  {name: "Sun", color: 0xffff00, size: 50, distance: 0, speed: 0},
  {name: "Earth", color: 0x2266ff, size: 10, distance: 150, speed: 0.01},
  {name: "Moon", color: 0x888888, size: 3, distance: 20, speed: 0.05, parent: "Earth"},
  {name: "Mars", color: 0xff3300, size: 8, distance: 228, speed: 0.008}
];

const planetObjects = {};

// Create Planets
planetsData.forEach(p => {
  const geometry = new THREE.SphereGeometry(p.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({color: p.color});
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = p.name;
  scene.add(mesh);
  planetObjects[p.name] = mesh;
});

// Animation
function animate(time) {
  requestAnimationFrame(animate);
  planetsData.forEach(p => {
    if(p.parent){
      const parent = planetObjects[p.parent];
      const angle = time * 0.001 * p.speed * 2*Math.PI;
      p.angle = angle;
      planetObjects[p.name].position.set(
        parent.position.x + Math.cos(angle)*p.distance,
        0,
        parent.position.z + Math.sin(angle)*p.distance
      );
    } else {
      if(p.distance !== 0){
        const angle = time * 0.001 * p.speed * 2*Math.PI;
        p.angle = angle;
        planetObjects[p.name].position.set(
          Math.cos(angle)*p.distance,
          0,
          Math.sin(angle)*p.distance
        );
      } else {
        planetObjects[p.name].position.set(0,0,0); // Sun
      }
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

animate(0);

// Planet Click
window.addEventListener('mousedown', event => {
  const mouse = new THREE.Vector2(
    (event.clientX/window.innerWidth)*2 - 1,
    -(event.clientY/window.innerHeight)*2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(Object.values(planetObjects));
  if(intersects.length > 0){
    const p = intersects[0].object;
    alert(`You clicked on: ${p.name}`);
  }
});

// Responsive
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Mode Switch
document.querySelectorAll('.mode-btn').forEach(btn=>{
  btn.addEventListener('click', ()=> alert(`Mode ${btn.dataset.mode} activated!`));
});