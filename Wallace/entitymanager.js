var EEntityAddMode;
(function (EEntityAddMode) {
    EEntityAddMode[EEntityAddMode["Immediate"] = 0] = "Immediate";
    EEntityAddMode[EEntityAddMode["Queued"] = 1] = "Queued";
})(EEntityAddMode || (EEntityAddMode = {}));

var EntityManager = (function () {
    function EntityManager() {
        this.currentId = 1;

        this.entities = {};

        this.toAdd = [];
        this.toStart = [];
        this.toRemove = [];

        this.entityAddMode = 0 /* Immediate */;
    }
    EntityManager.prototype.createEntity = function () {
        var components = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            components[_i] = arguments[_i + 0];
        }
        var e = new Entity(this.currentId);

        //automatically add a transform to every entity
        var transform = e.addComponent("transform");
        e.transform = transform;

        for (var i = 0, len = components.length; i < len; ++i) {
            e.addComponent(components[i]);
        }

        ++this.currentId;

        if (this.entityAddMode == 0 /* Immediate */) {
            this.addEntity(e);
        } else {
            this.toAdd.push(e);
        }

        return e;
    };

    EntityManager.prototype.addEntity = function (entity) {
        this.entities[entity.id] = entity;

        entity.requestAwake();
        this.toStart.push(entity);
    };

    EntityManager.prototype.destroyEntity = function (id) {
        if (this.entities[id] != null) {
            this.toRemove.push(this.entities[id]);
        }
    };

    EntityManager.prototype.removeEntity = function (entity) {
        entity.requestDestroy();
        this.entities[entity.id] = null;
    };

    EntityManager.prototype.update = function (dt) {
        //force the entityAddMode into queued while we're updating
        this.entityAddMode = 1 /* Queued */;

        for (var i = 0, len = this.toStart.length; i < len; ++i) {
            this.toStart[i].requestStart();
        }
        this.toStart.length = 0;

        for (var key in this.entities) {
            var e = this.entities[key];
            e.requestUpdate(dt);
        }

        for (var key in this.entities) {
            var e = this.entities[key];
            e.requestLateUpdate(dt);

            if (e.shouldDestroy) {
                this.destroyEntity(e.id);
            }
        }

        for (var i = 0, len = this.toRemove.length; i < len; ++i) {
            this.removeEntity(this.toRemove[i]);
        }
        this.toRemove.length = 0;

        for (var i = 0, len = this.toAdd.length; i < len; ++i) {
            this.addEntity(this.toAdd[i]);
        }
        this.toAdd.length = 0;
    };

    EntityManager.prototype.render = function () {
        for (var key in this.entities) {
            var e = this.entities[key];
            e.requestRender();
        }
    };
    return EntityManager;
})();
//# sourceMappingURL=entitymanager.js.map
