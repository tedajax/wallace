class AComponent implements IMessageable {
    enabled: boolean;

    isAwake: boolean;
    isStarted: boolean;

    entity: Entity;
    name: string;

    messageBinds: { [msg: string]: Function };

    constructor() {
        this.name = "AbstractComponent";
        this.enabled = true;
        this.isAwake = false;
        this.isStarted = false;
        this.messageBinds = {};
    }

    static create(): AComponent {
        return new AComponent();
    }

    requestAwake() {
        if (this.enabled && !this.isAwake) {
            this.awake();
            this.isAwake = true;
        }
    }

    requestStart() {
        if (this.enabled && !this.isStarted) {
            this.start();
            this.isStarted = true;
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

    awake(): void { }
    start(): void { }
    update(dt: number): void { }
    lateUpdate(dt: number): void { }
    render(): void { }
    destroy(): void { }

    bindMessage(msg: string, func: Function) {
        this.messageBinds[msg] = func;
    }

    sendMessage(msg: string, param: any) {
        if (this.messageBinds[msg] != null) {
            this.messageBinds[msg](param);
        }
    }

    addComponent(name: string): AComponent {
        return this.entity.addComponent(name);
    }

    getComponent(name: string): AComponent {
        return this.entity.getComponent(name);
    }

    removeComponent(name: string): AComponent {
        return this.entity.removeComponent(name);
    }
}
