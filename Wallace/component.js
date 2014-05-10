var AComponent = (function () {
    function AComponent() {
        this.name = "AbstractComponent";
        this.enabled = true;
        this.isAwake = false;
        this.isStarted = false;
        this.messageBinds = {};
    }
    AComponent.create = function () {
        return new AComponent();
    };

    AComponent.prototype.requestAwake = function () {
        if (this.enabled && !this.isAwake) {
            this.awake();
            this.isAwake = true;
        }
    };

    AComponent.prototype.requestStart = function () {
        if (this.enabled && !this.isStarted) {
            this.start();
            this.isStarted = true;
        }
    };

    AComponent.prototype.requestUpdate = function (dt) {
        if (this.enabled) {
            this.update(dt);
        }
    };

    AComponent.prototype.requestLateUpdate = function (dt) {
        if (this.enabled) {
            this.lateUpdate(dt);
        }
    };

    AComponent.prototype.requestRender = function () {
        if (this.enabled) {
            this.render();
        }
    };

    AComponent.prototype.requestDestroy = function () {
        //request on destroy cannot be denied
        this.destroy();
    };

    AComponent.prototype.awake = function () {
    };
    AComponent.prototype.start = function () {
    };
    AComponent.prototype.update = function (dt) {
    };
    AComponent.prototype.lateUpdate = function (dt) {
    };
    AComponent.prototype.render = function () {
    };
    AComponent.prototype.destroy = function () {
    };

    AComponent.prototype.bindMessage = function (msg, func) {
        this.messageBinds[msg] = func;
    };

    AComponent.prototype.sendMessage = function (msg, param) {
        if (this.messageBinds[msg] != null) {
            this.messageBinds[msg](param);
        }
    };

    AComponent.prototype.addComponent = function (name) {
        return this.entity.addComponent(name);
    };

    AComponent.prototype.getComponent = function (name) {
        return this.entity.getComponent(name);
    };

    AComponent.prototype.removeComponent = function (name) {
        return this.entity.removeComponent(name);
    };
    return AComponent;
})();
//# sourceMappingURL=component.js.map
