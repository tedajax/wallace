class CWallaceController extends AComponent {
    speed: number;

    constructor() {
        super();
        this.name = "WallaceController";
        this.speed = 100;
    }

    static create(): CWallaceController {
        return new CWallaceController();
    }

    update(dt: number) {
        this.entity.transform.velocity.x = this.speed * input.getAxis("horizontal");
        this.entity.transform.velocity.y = -this.speed * input.getAxis("vertical");
    }
} 

ComponentFactory.registerComponent("wallace_controller", CWallaceController.create);