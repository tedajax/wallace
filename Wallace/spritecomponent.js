var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SpriteComponent = (function (_super) {
    __extends(SpriteComponent, _super);
    function SpriteComponent() {
        var _this = this;
        _super.call(this);

        this.name = "SpriteComponent";

        this.texture = null;
        this.sprite = null;

        this.bindMessage("setSprite", function (url) {
            _this.setSprite(url);
        });
        this.bindMessage("addToStage", function (stage) {
            _this.addToStage(stage);
        });
    }
    SpriteComponent.create = function () {
        return new SpriteComponent();
    };

    SpriteComponent.prototype.setSprite = function (url) {
        this.texture = PIXI.Texture.fromImage(url);
        if (this.texture) {
            this.sprite = new PIXI.Sprite(this.texture);
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
        }
    };

    SpriteComponent.prototype.addToStage = function (stage) {
        if (this.sprite) {
            stage.addChild(this.sprite);
        }
    };

    SpriteComponent.prototype.lateUpdate = function (dt) {
        if (this.sprite) {
            this.sprite.position.x = this.entity.transform.position.x;
            this.sprite.position.y = this.entity.transform.position.y;
            this.sprite.rotation = this.entity.transform.rotation;
            this.sprite.scale.x = this.entity.transform.scale.x;
            this.sprite.scale.y = this.entity.transform.scale.y;
        }
    };
    return SpriteComponent;
})(AComponent);

ComponentFactory.registerComponent("sprite", SpriteComponent.create);
//# sourceMappingURL=spritecomponent.js.map
