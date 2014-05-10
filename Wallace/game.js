var Game = (function () {
    function Game() {
        this.width = 960;
        this.height = 540;
        this.FPS = FPS;

        this.stage = new PIXI.Stage(0x000000);
        this.renderer = PIXI.autoDetectRenderer(this.width, this.height);
        this.canvas = this.renderer.view;
        this.disableCanvasRMB(this.canvas);
        document.getElementById("container").appendChild(this.canvas);

        this.entities = new EntityManager();

        var entity = this.entities.createEntity("sprite", "wallace_controller");
        entity.sendMessage("setSprite", "assets/wallace.png");
        entity.sendMessage("addToStage", this.stage);

        this.physics = new PhysicsManager(0.0, -9.8);

        var groundDef = new Box2D.Dynamics.b2BodyDef();
        groundDef.position.Set(0.0, -10.0);
        this.physGroundBody = this.physWorld.CreateBody(groundDef);

        var groundBox = new Box2D.Collision.Shapes.b2PolygonShape();
        groundBox.SetAsBox(50.0, 10.0);
        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.2;
        fixtureDef.shape = groundBox;

        this.physGroundBody.CreateFixture(fixtureDef);
    }
    Game.prototype.disableCanvasRMB = function (canvas) {
        canvas.addEventListener("contextmenu", function (e) {
            if (e.button == 2) {
                e.preventDefault();
                return false;
            }
        }, false);
    };

    Game.prototype.initialize = function () {
    };

    Game.prototype.update = function (dt) {
        this.entities.update(dt);
        this.physics.update();
    };

    Game.prototype.render = function () {
        this.renderer.render(this.stage);
        this.entities.render();
    };

    Game.prototype.onResize = function () {
    };
    return Game;
})();
//# sourceMappingURL=game.js.map
