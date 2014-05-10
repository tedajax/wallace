enum EEntityAddMode {
    Immediate,
    Queued
}

class EntityManager {
    currentId: number;

    entities: { [id: number]: Entity };

    toAdd: Array<Entity>;
    toStart: Array<Entity>;
    toRemove: Array<Entity>;

    entityAddMode: EEntityAddMode;

    constructor() {
        this.currentId = 1;

        this.entities = {};

        this.toAdd = [];
        this.toStart = [];
        this.toRemove = [];

        this.entityAddMode = EEntityAddMode.Immediate;
    }

    createEntity(...components: string[]): Entity {
        var e = new Entity(this.currentId);

        //automatically add a transform to every entity
        var transform = e.addComponent("transform");
        e.transform = <CTransform>transform;

        for (var i = 0, len = components.length; i < len; ++i) {
            e.addComponent(components[i]);
        }

        ++this.currentId;

        if (this.entityAddMode == EEntityAddMode.Immediate) {
            this.addEntity(e);
        } else {
            this.toAdd.push(e);
        }

        return e;
    }

    private addEntity(entity: Entity) {
        this.entities[entity.id] = entity;

        entity.requestAwake();
        this.toStart.push(entity);
    }

    destroyEntity(id: number) {
        if (this.entities[id] != null) {
            this.toRemove.push(this.entities[id]);
        }
    }

    private removeEntity(entity: Entity) {
        entity.requestDestroy();
        this.entities[entity.id] = null;
    }

    update(dt: number) {
        //force the entityAddMode into queued while we're updating
        this.entityAddMode = EEntityAddMode.Queued;

        //call start on awoken entities
        for (var i = 0, len = this.toStart.length; i < len; ++i) {
            this.toStart[i].requestStart();            
        }
        this.toStart.length = 0;

        //we have to iterate over all the entities twice because we batch all updates
        //and lateupdates separately
        //update
        for (var key in this.entities) {
            var e = this.entities[key];
            e.requestUpdate(dt);
        }

        //lateupdate
        for (var key in this.entities) {
            var e = this.entities[key];
            e.requestLateUpdate(dt);

            if (e.shouldDestroy) {
                this.destroyEntity(e.id);
            }
        }

        //remove flagged entities
        for (var i = 0, len = this.toRemove.length; i < len; ++i) {
            this.removeEntity(this.toRemove[i]);
        }
        this.toRemove.length = 0;

        //add entities that were queued while we were updating and call awake on them
        for (var i = 0, len = this.toAdd.length; i < len; ++i) {
            this.addEntity(this.toAdd[i]);
        }
        this.toAdd.length = 0;
    }

    render() {
        //render
        for (var key in this.entities) {
            var e = this.entities[key];
            e.requestRender();
        }
    }
} 