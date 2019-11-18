const RADIUS = 20;

function degToRad(degrees) {
  var result = Math.PI / 180 * degrees;
  return result;
}

function init(){
    var scene = new THREE.Scene();
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
    var canvas = document.querySelector('#world');
    
    canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

    document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;

    canvas.onclick = function() {
    canvas.requestPointerLock();
    };
        
    const mouse = new THREE.Vector2();
    const target = new THREE.Vector2();
  
    var flag=1;
  
    camera.position.set( 0, 0, 0 );
    
    function animate() {
    
      requestAnimationFrame( animate );
    
        target.x = ( mouse.x ) * 0.02;
        target.y = ( mouse.y ) * 0.002;
    
        mouse.x = 0;
        mouse.y = 0;

        camera.rotation.x -= 0.05 * ( target.y);
        camera.rotation.y += 0.05 * ( target.x );

        renderer.render( scene, camera );
    }
    
  
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
  
  for(i=0; i<100; i++){
     m = new Monster(randomSudut());
    scene.add(m.mesh);
  }

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
  }
}

var tracker = document.getElementById('tracker');

function updatePosition(e) {
  mouse.x = e.movementX;
  mouse.y = e.movementY;
}

   animate();
}


function randomSudut(){
    return Math.random() * Math.PI * 2;
}
  
  init();