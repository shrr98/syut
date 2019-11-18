class Monster extends THREE.Mesh{
    constructor(angle){
        super(THREE.Mesh);
        this.angle = angle;
        this.radius = 700;
        this.calculatePosition();
        this.geometry = new THREE.BoxBufferGeometry(50,50,50);
        this.material = new THREE.MeshPhongMaterial({color:0x00ff00});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(this.x, 0, this.z);
    }

    calculatePosition(){
        this.x = Math.cos(this.angle) * this.radius;
        this.z = Math.sin(this.angle) * this.radius;

        this.dir_x = (this.x>1) ? -1 : 1;
        this.dir_z = (this.z>1) ? -1 : 1;
    }

    verbose(){
        console.log(this.angle, this.x, this.z, this.dir_x, this.dir_z);
    }
}