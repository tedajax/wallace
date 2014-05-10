class CTransform extends AComponent {
    position: THREE.Vector2;
    rotation: number;
    scale: THREE.Vector2;
    velocity: THREE.Vector2;
    angularVelocity: number;

    constructor() {
        super();

        this.name = "TransformComponent";

        this.position = new THREE.Vector2(0, 0);
        this.rotation = 0;
        this.scale = new THREE.Vector2(1, 1);
        this.velocity = new THREE.Vector2(0, 0);
        this.angularVelocity = 0;
    }

    static create() {
        return new CTransform();
    }

    update(dt: number) {
    }

    lateUpdate(dt: number) {
        this.position.add(this.velocity.clone().multiplyScalar(dt));
        this.rotation += this.angularVelocity;
    }
}

ComponentFactory.registerComponent("transform", CTransform.create);