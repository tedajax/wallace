class SpriteComponent extends AComponent {
    texture: PIXI.Texture;
    sprite: PIXI.Sprite;

    constructor() {
        super();

        this.name = "SpriteComponent";

        this.texture = null;
        this.sprite = null;

        this.bindMessage("setSprite", (url: string) => {
            this.setSprite(url);
        });
        this.bindMessage("addToStage", (stage: PIXI.Stage) => {
            this.addToStage(stage);
        });
    }

    static create(): SpriteComponent {
        return new SpriteComponent();
    }

    setSprite(url: string) {
        this.texture = PIXI.Texture.fromImage(url);
        if (this.texture) {
            this.sprite = new PIXI.Sprite(this.texture);
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
        }
    }

    addToStage(stage: PIXI.Stage) {
        if (this.sprite) {
            stage.addChild(this.sprite);
        }
    }

    lateUpdate(dt: number) {
        if (this.sprite) {
            this.sprite.position.x = this.entity.transform.position.x;
            this.sprite.position.y = this.entity.transform.position.y;
            this.sprite.rotation = this.entity.transform.rotation;
            this.sprite.scale.x = this.entity.transform.scale.x;
            this.sprite.scale.y = this.entity.transform.scale.y;
        }
    }
}

ComponentFactory.registerComponent("sprite", SpriteComponent.create);