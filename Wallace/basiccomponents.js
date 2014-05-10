var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CTransform = (function (_super) {
    __extends(CTransform, _super);
    function CTransform() {
        _super.call(this);

        this.name = "TransformComponent";

        this.position = new THREE.Vector2(0, 0);
        this.rotation = 0;
        this.scale = new THREE.Vector2(1, 1);
        this.velocity = new THREE.Vector2(0, 0);
        this.angularVelocity = 0;
    }
    CTransform.create = function () {
        return new CTransform();
    };

    CTransform.prototype.update = function (dt) {
    };

    CTransform.prototype.lateUpdate = function (dt) {
        this.position.add(this.velocity.clone().multiplyScalar(dt));
        this.rotation += this.angularVelocity;
    };
    return CTransform;
})(AComponent);

ComponentFactory.registerComponent("transform", CTransform.create);
//# sourceMappingURL=basiccomponents.js.map
