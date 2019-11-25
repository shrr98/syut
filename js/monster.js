class Monster extends THREE.Mesh{
    constructor(angle){
        super(THREE.Mesh);
        this.angle = angle;
        this.radius = 700;
        this.step = 1;
        this.geometry = new THREE.BoxBufferGeometry(50,50,50);
        this.material = new THREE.MeshPhongMaterial({color:0xff0000});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.calculatePosition();
    }

    calculatePosition(){
        this.x = Math.cos(this.angle) * this.radius;
        this.z = Math.sin(this.angle) * this.radius;
        // this.x=0;
        // this.z=-100;

        this.dir_x = (this.x>1) ? -1 : 1;
        this.dir_z = (this.z>1) ? -1 : 1;
        this.mesh.position.set(this.x, 0, this.z);
    }

    approach(){
        this.radius -= this.step;
        // this.step += 1;
        this.calculatePosition();
    }

    verbose(){
        console.log(this.angle, this.x, this.z, this.dir_x, this.dir_z);
    }
}