class PhysicsManager {
    world: Box2D.Dynamics.b2World;
    gravity: Box2D.Common.Math.b2Vec2;
    pIterations: number;
    vIterations: number;
    tickRate: number;

    constructor(gravX: number = 0, gravY: number = 0) {
        this.gravity = new Box2D.Common.Math.b2Vec2(gravX, gravY);
        this.world = new Box2D.Dynamics.b2World(this.gravity, true);
        this.pIterations = 10;
        this.vIterations = 10;
        this.tickRate = 1000 / game.FPS;
    }

    update() {
        this.world.Step(this.tickRate, this.pIterations, this.vIterations);
        this.world.ClearForces();
    }
}