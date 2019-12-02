const radius = 50;
var scene;
var camera;
var monsters;
var shoot;
var canvas;
var renderer;
var id_animate;
var mouse;
var target;
var centerScreen;
var pickHelper;
var pickPosition;
var VIEW_LIMIT;

let CAM_RANGEMAX;


function degToRad(degrees) {
  var result = Math.PI / 180 * degrees;
  return result;
}

function radToDeg(rad) {
  var result = 180 / Math.PI * rad;
  return result;
}

document.getElementById('play').onclick = function() {
  document.getElementById('play').disabled = true; 
  console.log('play!');
  play();
}


// function init(){
  console.log('init');
    scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
    HEIGHT = window.innerHeight * .9;
    WIDTH = window.innerWidth * .9;
    centerScreen = {x: WIDTH/2, y: HEIGHT/2};
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 1000; 
    camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );
    CAM_RANGEMAX = farPlane;
    VIEW_LIMIT = degToRad(fieldOfView);
  
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio); 
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
   
    mouse = new THREE.Vector2();
    target = new THREE.Vector2();
  
    var flag=1;
  
    camera.position.set( 0, 0, 0 );

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);
  
  {
    var spotLight = new THREE.SpotLight( color=0xffaaaa, intensity=1, distance=1000, angle=.7, penumbra=0.5, decay=2.0);
    spotLight.position.set( 0, 0, 0 );
    scene.add(spotLight);
  }
  

  {
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('assets/syut.mtl',  (materials) =>{
      console.log('MTL');
        const objLoader = new THREE.OBJLoader();
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load('assets/syut.obj', (root) => {
            root.rotation.x = Math.PI / 2.0;
            root.position.z = -radius;
            root.name = 'shoot';
            scene.add(root);
        });
    });
}
renderer.render( scene, camera );

function play(){
  canvas = document.querySelector('#world');    
  canvas.requestPointerLock = canvas.requestPointerLock ||
                          canvas.mozRequestPointerLock;
  document.exitPointerLock = document.exitPointerLock ||
                          document.mozExitPointerLock;
  canvas.requestPointerLock();
  shoot = scene.getObjectByName('shoot');

  pickHelper = new PickHelper();
  pickPosition = {x:0, y:0};

  function animate() {
  
    id_animate = requestAnimationFrame( animate );

    monstersApproaching();
  
    clearMiniWorld();
    drawViewRange();
    drawCircle(0, 0, 'green');
    plotMonsters(monsters);

    target.x = ( mouse.x ) * 0.04;
    target.y = ( mouse.y) * 0.001;

    mouse.x = 0;
    mouse.y = 0;

    camera.rotation.x -= 0.05 * ( target.y );
    camera.rotation.y -= 0.05 * ( target.x );
      updateShoot();

    renderer.render( scene, camera );
  }
  
  setInterval(createMonster, 3000);

  // Hook pointer lock state change events for different browsers
  document.addEventListener('pointerlockchange', lockChangeAlert, false);
  document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
  
  canvas.addEventListener('click', setSelected);

  function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) {
      console.log('The pointer lock status is now locked');
      document.addEventListener("mousemove", updatePosition, false);
    } else {
      console.log('The pointer lock status is now unlocked');  
      document.removeEventListener("mousemove", updatePosition, false);
      document.getElementById('play').disabled = false; 
      cancelAnimationFrame(id_animate);
      
    }
  }

function updateShoot(){
  if(shoot===undefined){
    shoot = scene.getObjectByName('shoot');
  }
  shoot.position.x = -Math.sin(camera.rotation.y) * radius;
  shoot.position.z = -Math.cos(camera.rotation.y) * radius;
  
  shoot.position.y = Math.sin(camera.rotation.x) * radius;

  shoot.rotation.z = -camera.rotation.y;
  spotLight.target.position.x = shoot.position.x;
  spotLight.target.position.y = shoot.position.y;
  spotLight.target.position.z = shoot.position.z;
  scene.add(spotLight.target);
}

function monstersApproaching(){
  for (i=0; i<monsters.length; i++){
    monsters[i].approach();
    if(monsters[i].radius < 100){
      scene.remove(monsters[i].mesh);
      monsters.splice(monsters[i], 1);
    }
  }
}

function updatePosition(e) {
  mouse.x = e.movementX;
  mouse.y = e.movementY;
}

monsters = [];
function createMonster(){
  var m = new Monster(randomSudut());
  monsters.push(m);
  scene.add(m.mesh);
}

function getCanvasRelativePosition() {
  const rect = canvas.getBoundingClientRect();
  return {
    // x:  centerScreen.x - rect.left,
    // y:  centerScreen.y - rect.top,
    x: canvas.clientWidth / 2.0,
    y : canvas.clientHeight / 2.0,
  };
}

function setPickPosition() {
  const pos = getCanvasRelativePosition();
  pickPosition.x = (pos.x / canvas.clientWidth ) *  2 - 1;
  pickPosition.y = (pos.y / canvas.clientHeight) * -2 + 1;  // note we flip Y
}

function clearPickPosition() {
  // unlike the mouse which always has a position
  // if the user stops touching the screen we want
  // to stop picking. For now we just pick a value
  // unlikely to pick something
  pickPosition.x = -100000;
  pickPosition.y = -100000;
}


function setSelected(event) {
  console.log('clicked');
  setPickPosition();
  pickHelper.pick(pickPosition, scene, camera);
  if(pickHelper.pickedObject===null) {
    return;
  }
  else {
    scene.remove(pickHelper.pickedObject);
  }
  clearPickPosition();
}

  createMiniWorld();

  animate();
}

function randomSudut(){
    return Math.random() * Math.PI * 2;
}

let SCALE;
var context;
var canvas_mini;

function createMiniWorld(){
  canvas_mini = document.getElementById('miniworld');
  SCALE = canvas_mini.width / CAM_RANGEMAX.toFixed(2);
  context = canvas_mini.getContext('2d');
    
  drawCircle(0, 0, 'green');
}

function clearMiniWorld(){
  context.clearRect(0, 0, canvas_mini.width, canvas_mini.height);
}

function plotMonsters(monsters){
    monsters.forEach(function(m) {
    centerX = m.mesh.position.x;
    centerY = m.mesh.position.z;

    color = 'red';
    drawCircle(centerX, centerY, color);
  });
}

function drawCircle(x, y, color){
  var radius = 3;

  x = (x+CAM_RANGEMAX) * SCALE * .5; 
  y = (y+CAM_RANGEMAX) * SCALE * .5; 

  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = color;
  context.fill();
}

function drawViewRange(){
  lookat = -camera.rotation.y;
  angleLeft = lookat - VIEW_LIMIT * .5;
  angleRight = lookat + VIEW_LIMIT * .5;

  // console.log(radToDeg(angleLeft), radToDeg(lookat), radToDeg(angleRight));

  left  = [Math.sin(angleLeft) * canvas_mini.width, Math.cos(angleRight) * canvas_mini.width];
  right = [Math.sin(angleRight) * canvas_mini.width, Math.cos(angleRight) * canvas_mini.width];
  center = [canvas_mini.width/2, canvas_mini.height/2]
  context.beginPath(); 
  context.fillStyle = "#555555";
  context.moveTo(center[0] + left[0], center[1] - left[1]);
  context.lineTo(center[0], center[1]);
  context.lineTo(center[0] + right[0], center[1] - right[1]);
  context.fill(); 
}

// function createMiniWorld(){
//   scale = 0.1;
//   scene_mini = new THREE.Scene();
//   scene_mini.background = new THREE.Color('red');
//   HEIGHT = window.innerHeight * scale;
//   WIDTH = window.innerWidth * scale;
//   center_mini = {x: WIDTH/2, y: HEIGHT/2};
//   aspectRatio = WIDTH / HEIGHT;
//   fieldOfView = 60;
//   nearPlane = 1;
//   farPlane = 1000;
//     camera_mini = new THREE.PerspectiveCamera(
//       fieldOfView,
//       aspectRatio,
//       nearPlane,
//       farPlane);
  
//     renderer_mini = new THREE.WebGLRenderer({alpha: true, antialias: true });
//     renderer_mini.setPixelRatio(aspectRatio);
//     renderer_mini.setSize(WIDTH, HEIGHT);
//     renderer_mini.shadowMap.enabled = true;
  
//     var flag=1;
  
//     camera_mini.position.set( 0, 0, 0 );

//     container = document.getElementById('miniworld');
//     container.appendChild(renderer.domElement);
  
//   {
//     var light = new THREE.AmbientLight( color=0xffaaaa, intensity=1);
//     scene_mini.add(light);
//   }
  
//   renderer_mini.render( scene, camera );
// }