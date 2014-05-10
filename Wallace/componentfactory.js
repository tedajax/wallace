var ComponentFactory = (function () {
    function ComponentFactory() {
    }
    ComponentFactory.initialize = function () {
        ComponentFactory.createMethods = {};
    };

    ComponentFactory.registerComponent = function (name, create) {
        if (ComponentFactory.createMethods[name] != null) {
            throw "Error: Factory for " + name + " already exists";
            return;
        }
        ComponentFactory.createMethods[name] = create;
    };

    ComponentFactory.create = function (name) {
        if (ComponentFactory.createMethods[name] != null) {
            return ComponentFactory.createMethods[name]();
        }
    };
    return ComponentFactory;
})();

ComponentFactory.initialize();
//# sourceMappingURL=componentfactory.js.map
