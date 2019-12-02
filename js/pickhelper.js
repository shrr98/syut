class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
  }
  pick(normalizedPosition, scene, camera) {
    // if (this.pickedObject){
    //   this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
    //   this.pickedObject = undefined;
    // }

    this.raycaster.setFromCamera(normalizedPosition, camera);
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length>0) {
      console.log('ono');
      this.pickedObject = intersectedObjects[0].object;
    }
    else {
      this.pickedObject = null;
    }
  }
}