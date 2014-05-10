var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CWallaceController = (function (_super) {
    __extends(CWallaceController, _super);
    function CWallaceController() {
        _super.call(this);
        this.name = "WallaceController";
        this.speed = 100;
    }
    CWallaceController.create = function () {
        return new CWallaceController();
    };

    CWallaceController.prototype.update = function (dt) {
        this.entity.transform.velocity.x = this.speed * input.getAxis("horizontal");
        this.entity.transform.velocity.y = -this.speed * input.getAxis("vertical");
    };
    return CWallaceController;
})(AComponent);

ComponentFactory.registerComponent("wallace_controller", CWallaceController.create);
//# sourceMappingURL=wallacecontroller.js.map
