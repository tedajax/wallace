/// <reference path="Scripts/typings/pixi/pixi.d.ts" />
var Game = (function () {
    function Game() {
        this.width = 960;
        this.height = 540;

        this.stage = new PIXI.Stage(0x000000);
        this.renderer = PIXI.autoDetectRenderer(this.width, this.height);
        this.canvas = this.renderer.view;
        document.getElementById("container").appendChild(this.canvas);

        this.texture = PIXI.Texture.fromImage("assets/wallace.png");
        this.wallace = new PIXI.Sprite(this.texture);

        this.wallace.anchor.x = 0.5;
        this.wallace.anchor.y = 0.5;
        this.wallace.position.x = 200;
        this.wallace.position.y = 150;

        this.stage.addChild(this.wallace);
    }
    Game.prototype.initialize = function () {
    };

    Game.prototype.update = function (dt) {
        if (input.getKey(Keys.RIGHT)) {
            this.wallace.rotation += Math.PI * dt;
        }

        if (input.getKey(Keys.LEFT)) {
            this.wallace.rotation -= Math.PI * dt;
        }
    };

    Game.prototype.render = function () {
        this.renderer.render(this.stage);
    };

    Game.prototype.onResize = function () {
    };
    return Game;
})();
//# sourceMappingURL=game.js.map
