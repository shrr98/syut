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



function degToRad(degrees) {
  var result = Math.PI / 180 * degrees;
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
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 1000; 
    camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane);
  
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
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1,2,4);
      scene.add(light);
  }
  
  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(1,-2,-4);
    scene.add(light);
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
            console.log(root);
        });
    });
}
renderer.render( scene, camera );
// }

function play(){

   canvas = document.querySelector('#world');

    
    canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

    document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;

    canvas.requestPointerLock();
        
    
    shoot = scene.getObjectByName('shoot');
    function animate() {
    
      id_animate = requestAnimationFrame( animate );

      monstersApproaching();
    
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
    console.log(shoot);
    shoot = scene.getObjectByName('shoot');
  }
  shoot.position.x = -Math.sin(camera.rotation.y) * radius;
  shoot.position.z = -Math.cos(camera.rotation.y) * radius;
  
  shoot.position.y = Math.sin(camera.rotation.x) * radius;
  // shoot.lookAt(camera);
}

function monstersApproaching(){
  for (i=0; i<monsters.length; i++){
    monsters[i].approach();
    if(monsters[i].radius < 100){
      scene.remove(monsters[i].mesh);
      monsters.splice(monsters[i], 1);
    }
  }
  console.log(monsters.length)
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

   animate();
}


function randomSudut(){
    return Math.random() * Math.PI * 2;
}