var PhysicsManager = (function () {
    function PhysicsManager(gravX, gravY) {
        if (typeof gravX === "undefined") { gravX = 0; }
        if (typeof gravY === "undefined") { gravY = 0; }
        this.gravity = new Box2D.Common.Math.b2Vec2(gravX, gravY);
        this.world = new Box2D.Dynamics.b2World(this.gravity, true);
        this.pIterations = 10;
        this.vIterations = 10;
        this.tickRate = 1000 / game.FPS;
    }
    PhysicsManager.prototype.update = function () {
        this.world.Step(this.tickRate, this.pIterations, this.vIterations);
        this.world.ClearForces();
    };
    return PhysicsManager;
})();
//# sourceMappingURL=physics.js.map
