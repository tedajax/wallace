/// <reference path="Scripts/typings/pixi/pixi.d.ts" />

class Game {
    width: number;
    height: number;

    stage: PIXI.Stage;
    renderer: PIXI.IPixiRenderer;

    texture: PIXI.Texture;
    wallace: PIXI.Sprite;

    constructor() {
        this.width = 960;
        this.height = 540;

        this.stage = new PIXI.Stage(0x000000);
        this.renderer = PIXI.autoDetectRenderer(this.width, this.height);
        document.getElementById("container").appendChild(this.renderer.view);

        this.texture = PIXI.Texture.fromImage("assets/wallace.png");
        this.wallace = new PIXI.Sprite(this.texture);

        this.wallace.anchor.x = 0.5;
        this.wallace.anchor.y = 0.5;
        this.wallace.position.x = 200;
        this.wallace.position.y = 150;

        this.stage.addChild(this.wallace);
    }

    initialize() {
    }

    update(dt: number) {
        this.wallace.rotation += Math.PI * dt;
    }

    render() {
        this.renderer.render(this.stage);
    }

    onResize() {
    }
}