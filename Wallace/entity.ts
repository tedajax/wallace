class Entity implements IMessageable {
    id: number;
    enabled: boolean;

    private components: { [name: string]: AComponent };
    private compToAdd: Array<AComponent>;
    private compToRemove: Array<AComponent>;

    isAwake: boolean;
    isStarted: boolean;
    shouldDestroy; boolean;
    componentLock: boolean;

    transform: CTransform;

    messageBinds: { [msg: string]: Function };

    constructor(id: number) {
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

    requestAwake() {
        if (this.enabled && !this.isAwake) {
            this.awake();
        }
    }

    requestStart() {
        if (this.enabled && !this.isStarted) {
            this.start();
        }
    }

    requestUpdate(dt: number) {
        if (this.enabled) {
            this.update(dt);
        }
    }

    requestLateUpdate(dt: number) {
        if (this.enabled) {
            this.lateUpdate(dt);
        }
    }

    requestRender() {
        if (this.enabled) {
            this.render();
        }
    }

    requestDestroy() {
        //request on destroy cannot be denied
        this.destroy();
    }

    awake(): void {
        this.lockComponents();

        for (var key in this.components) {
            var c = this.components[key];
            if (c.enabled && !c.isAwake) {
                c.requestAwake();
            }
        }

        this.unlockComponents();

        this.isAwake = true;
    }

    start(): void {
        this.lockComponents();

        for (var key in this.components) {
            var c = this.components[key];
            if (c.enabled && !c.isStarted) {
                c.requestStart();
            }
        }

        this.unlockComponents();

        this.isStarted = true;
    }

    update(dt: number): void {
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
    }

    lateUpdate(dt: number): void {
        this.lockComponents();

        for (var key in this.components) {
            var c = this.components[key];
            if (c.enabled) {
                c.requestLateUpdate(dt);
            }
        }

        this.unlockComponents();
    }

    render(): void {
        this.lockComponents();

        for (var key in this.components) {
            var c = this.components[key];
            if (c.enabled) {
                c.requestRender();
            }
        }

        this.unlockComponents();
    }

    destroy() {
        this.lockComponents();

        for (var key in this.components) {
            var c = this.components[key];
            c.requestDestroy();
        }

        this.unlockComponents();
    }

    die() {
        this.shouldDestroy = true;
    }

    lockComponents() {
        this.componentLock = true;
    }

    unlockComponents() {
        this.componentLock = false;

        this.checkAddComponents();
        this.checkRemoveComponents();
    }

    checkAddComponents() {
        for (var i = 0, len = this.compToAdd.length; i < len; ++i) {
            var c = this.compToAdd[i];
            c.entity = this;
            this.components[c.name] = c;
            if (!c.isAwake) {
                c.requestAwake();
            }
        }
        this.compToAdd.length = 0;
    }

    checkRemoveComponents() {
        for (var i = 0, len = this.compToRemove.length; i < len; ++i) {
            var c = this.compToRemove[i];
            this.components[c.name] = c;
        }
        this.compToRemove.length = 0;
    }

    addComponent(name: string): AComponent {
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
    }

    getComponent(name: string): AComponent {
        if (this.components[name] == null) {
            throw "Entity with id: " + this.id + " does not have a component named " + name;
            return;
        }

        return this.components[name];
    }

    removeComponent(name: string): AComponent {
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
    }

    bindMessage(msg: string, func: Function) {
        this.messageBinds[msg] = func;
    }

    sendMessage(msg: string, param: any) {
        if (this.messageBinds[msg] != null) {
            this.messageBinds[msg](param);
        }

        for (var key in this.components) {
            var c = this.components[key];
            if (c.enabled) {
                c.sendMessage(msg, param);
            }
        }
    }
}