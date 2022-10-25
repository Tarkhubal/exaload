let renderWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
renderHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
scene,camera,renderer,innerDome,
light1,light2,
clock = new THREE.Clock(),
elapsedTime,
controls;

init();
animate();

function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(50, renderWidth / renderHeight, 1, 50);

  controls = new OrbitControls(camera);

  // const gridHelper = new THREE.GridHelper(10, 10);
  // scene.add( gridHelper );

  // lights
  let sphere = new THREE.SphereGeometry(0.1, 16, 8);

  light1 = new THREE.PointLight(0x139AFF, 5, 100, 1);
  //light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x139AFF } ) ) );
  light1.position.set(1.5, 0, 0);
  scene.add(light1);

  light2 = new THREE.PointLight(0xFF7D33, 5, 100, 1);
  //light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xFF7D33 } ) ) );
  light2.position.set(-1.5, 0, 0);
  scene.add(light2);

  // shape object
  let innerDomeGeometry = new THREE.IcosahedronGeometry(1, 2);
  let innerDomeMaterial = new THREE.MeshPhongMaterial({
    shading: THREE.FlatShading });

  innerDome = new THREE.Mesh(innerDomeGeometry, innerDomeMaterial);
  scene.add(innerDome);

  camera.position.set(1, -0.5, 5);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(renderWidth, renderHeight);

  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

  renderWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  renderHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  camera.aspect = renderWidth / renderHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(renderWidth, renderHeight);
}


function animate() {

  requestAnimationFrame(animate);

  render();
}

function render() {

  time = Date.now() * 0.0005;
  elapsedTime = clock.getElapsedTime() * 4;

  light1.position.x = -1.5 * Math.cos(-elapsedTime);
  light1.position.y = -1.5 * Math.sin(-elapsedTime);

  light2.position.x = 1.5 * Math.cos(-elapsedTime);
  light2.position.y = 1.5 * Math.sin(-elapsedTime);

  renderer.render(scene, camera);

}