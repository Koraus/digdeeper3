import { RenderCallback } from "@react-three/fiber";
import { InstancedMeshHost } from "../../../utils/InstancedMeshHost";
import { Matrix4 } from "three";
import { Dropzone } from "../../../model/terms";


export type ParentState = {
    rootMatrixWorld: Matrix4,
    prevState: {
        t: number,
        x: number,
        isVisited: boolean,
        isCollected: boolean,
        dropzone: Dropzone,
    } | undefined,
    state: {
        t: number,
        x: number,
        isVisited: boolean,
        isCollected: boolean,
        dropzone: Dropzone,
    }
}

export type LayoutContext = ParentState & {
    abuseRandom: () => number;
    abuseBox: () => ReturnType<InstancedMeshHost["getFreeClientOrThrow"]>;
    abuseFrame: (callback: (
        parentState: ParentState,
        ...rest: Parameters<RenderCallback>
    ) => void) => void;
};
