var Entity = (function () {
    function Entity(id) {
        this.id = id;
        this.enabled = true;
        this.isAwake = false;
        this.isStarted = false;
        this.shouldDestroy = false;

        this.messageBinds = {};

        this.components = {};
        this.compToAdd = [];
        this.compToRemove = [];

        this.componentLock = false;
    }
    Entity.prototype.requestAwake = function () {
        if (this.enabled && !this.isAwake) {
            this.awake();
        }
    };

    Entity.prototype.requestStart = function () {
        if (this.enabled && !this.isStarted) {
            this.start();
        }
    };

    Entity.prototype.requestUpdate = function (dt) {
        if (this.enabled) {
            this.update(dt);
        }
    };

    Entity.prototype.requestLateUpdate = function (dt) {
        if (this.enabled) {
            this.lateUpdate(dt);
        }
    };

    Entity.prototype.requestRender = function () {
        if (this.enabled) {
            this.render();
        }
    };

    Entity.prototype.requestDestroy = function () {
        //request on destroy cannot be denied
        this.destroy();
    };

    Entity.prototype.awake = function () {
        this.lockComponents();

        for (var key in this.components) {
            var c = this.components[key];
            if (c.enabled && !c.isAwake) {
                c.requestAwake();
            }
        }

        this.unlockComponents();

        this.isAwake = true;
    };

    Entity.prototype.start = function () {
        this.lockComponents();

        for (var key in this.components) {
            var c = this.components[key];
            if (c.enabled && !c.isStarted) {
                c.requestStart();
            }
        }

        this.unlockComponents();

        this.isStarted = true;
    };

    Entity.prototype.update = function (dt) {
        this.lockComponents();

        for (var key in this.components) {
            var c = this.components[key];

            if (!c.isAwake) {
                c.requestAwake();
                continue;
            }

            if (!c.isStarted) {
                c.requestStart();
                continue;
            }

            if (c.enabled) {
                c.requestUpdate(dt);
            }
        }

        this.unlockComponents();
    };

    Entity.prototype.lateUpdate = function (dt) {
        this.lockComponents();

        for (var key in this.components) {
            var c = this.components[key];
            if (c.enabled) {
                c.requestLateUpdate(dt);
            }
        }

        this.unlockComponents();
    };

    Entity.prototype.render = function () {
        this.lockComponents();

        for (var key in this.components) {
            var c = this.components[key];
            if (c.enabled) {
                c.requestRender();
            }
        }

        this.unlockComponents();
    };

    Entity.prototype.destroy = function () {
        this.lockComponents();

        for (var key in this.components) {
            var c = this.components[key];
            c.requestDestroy();
        }

        this.unlockComponents();
    };

    Entity.prototype.die = function () {
        this.shouldDestroy = true;
    };

    Entity.prototype.lockComponents = function () {
        this.componentLock = true;
    };

    Entity.prototype.unlockComponents = function () {
        this.componentLock = false;

        this.checkAddComponents();
        this.checkRemoveComponents();
    };

    Entity.prototype.checkAddComponents = function () {
        for (var i = 0, len = this.compToAdd.length; i < len; ++i) {
            var c = this.compToAdd[i];
            c.entity = this;
            this.components[c.name] = c;
            if (!c.isAwake) {
                c.requestAwake();
            }
        }
        this.compToAdd.length = 0;
    };

    Entity.prototype.checkRemoveComponents = function () {
        for (var i = 0, len = this.compToRemove.length; i < len; ++i) {
            var c = this.compToRemove[i];
            this.components[c.name] = c;
        }
        this.compToRemove.length = 0;
    };

    Entity.prototype.addComponent = function (name) {
        if (this.components[name] != null) {
            throw "Entity with id: " + this.id + " already has a " + name + " component";
            return;
        }

        var component = ComponentFactory.create(name);

        if (this.componentLock) {
            this.compToAdd.push(component);
        } else {
            component.entity = this;
            this.components[component.name] = component;
        }

        return component;
    };

    Entity.prototype.getComponent = function (name) {
        if (this.components[name] == null) {
            throw "Entity with id: " + this.id + " does not have a component named " + name;
            return;
        }

        return this.components[name];
    };

    Entity.prototype.removeComponent = function (name) {
        if (this.components[name] == null) {
            throw "Entity with id: " + this.id + " does not have a component named " + name;
            return;
        }

        var comp = this.components[name];

        if (this.componentLock) {
            this.compToRemove.push(comp);
        } else {
            this.components[comp.name] = null;
        }

        return comp;
    };

    Entity.prototype.bindMessage = function (msg, func) {
        this.messageBinds[msg] = func;
    };

    Entity.prototype.sendMessage = function (msg, param) {
        if (this.messageBinds[msg] != null) {
            this.messageBinds[msg](param);
        }

        for (var key in this.components) {
            var c = this.components[key];
            if (c.enabled) {
                c.sendMessage(msg, param);
            }
        }
    };
    return Entity;
})();
//# sourceMappingURL=entity.js.map
