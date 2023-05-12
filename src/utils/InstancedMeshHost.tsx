import { Color, InstancedMesh, Matrix4, Object3D } from "three";
import { _throw } from "./_throw";

const zeroScaleMatrix = new Matrix4().set(
    0, 0, 0, 0, /**/ 0, 0, 0, 0, /**/ 0, 0, 0, 0, /**/ 0, 0, 0, 1);

export class InstancedMeshClient extends Object3D {

    isInUse = false;
    color?: Color;

    constructor(
        public host: InstancedMeshHost,
        public index: number,
    ) {
        super();
        this.host = host;
        this.index = index;
        this.deuse();
    }

    upload() {
        if (!this.visible) {
            this.host.setMatrixAt(this.index, zeroScaleMatrix);
            this.host.instanceMatrix.needsUpdate = true;
            return;
        }

        // todo divide by host matrixWorld 
        // or at least check if it's identity
        this.host.setMatrixAt(this.index, this.matrixWorld);
        this.host.instanceMatrix.needsUpdate = true;

        if (this.color) {
            this.host.setColorAt(this.index, this.color);

            // the above setColorAt initializes instanceColor
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.host.instanceColor!.needsUpdate = true;
        }
    }

    updateMatrixWorld(force?: boolean | undefined): void {
        super.updateMatrixWorld(force);
        if (this.isInUse) { this.upload(); }
    }

    use() { this.isInUse = true; }

    deuse() {
        this.isInUse = false;
        this.host.setMatrixAt(this.index, zeroScaleMatrix);
        this.host.instanceMatrix.needsUpdate = true;
    }
}


export class InstancedMeshHost extends InstancedMesh {
    clients: InstancedMeshClient[];

    constructor(
        ...args: ConstructorParameters<typeof InstancedMesh>
    ) {
        super(...args);

        this.clients = Array.from(
            { length: this.count },
            (_, i) => new InstancedMeshClient(this, i));
    }

    lastServedIndex = 0;
    getFreeClient() {
        // try to find a free client starting from the last served one
        // due to belief they have similar use duration
        for (let _i = 0; _i < this.clients.length; _i++) {
            const i = (this.lastServedIndex + _i) % this.clients.length;
            const client = this.clients[i];
            if (!client.isInUse) {
                client.use();
                this.lastServedIndex = i;
                return client;
            }
        }
    }
    getFreeClientOrThrow() {
        return this.getFreeClient() ?? _throw("no free client");
    }
}
