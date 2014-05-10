class ComponentFactory {
    private static createMethods: { [name: string]: () => AComponent };

    static initialize() {
        ComponentFactory.createMethods = {};
    }

    static registerComponent(name: string, create: () => AComponent) {
        if (ComponentFactory.createMethods[name] != null) {
            throw "Error: Factory for " + name + " already exists";
            return;
        }
        ComponentFactory.createMethods[name] = create;
    }

    static create(name: string): AComponent {
        if (ComponentFactory.createMethods[name] != null) {
            return ComponentFactory.createMethods[name]();
        }
    }
}

ComponentFactory.initialize();