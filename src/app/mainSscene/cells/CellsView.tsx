import { RenderCallback, ThreeElements, useFrame } from "@react-three/fiber";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "../../trekRecoil";
import { TrekChain } from "../../../model/trekChain";
import { sightAt, startForTrek } from "../../../model/sightChain";
import { caForDropzone } from "../../../model/sight";
import { useMemo } from "react";
import { BoxGeometry, Euler, Group, Matrix4, MeshPhongMaterial, Quaternion, Vector3 } from "three";
import { LehmerPrng } from "../../../utils/LehmerPrng";
import { InstancedMeshHost, zeroScaleMatrix } from "../../../utils/InstancedMeshHost";
import { ParentState } from "./LayoutContext";
import { Cell } from "./Cell";
import { Dropzone } from "../../../model/terms/Dropzone";
import memoize from "memoizee";
import { getComposition } from "../../../ca/calculateComposition";


export const _m4s = Array.from({ length: 10 }, () => new Matrix4());
export const _v3s = Array.from({ length: 10 }, () => new Vector3());
export const _qs = Array.from({ length: 10 }, () => new Quaternion());
export const _es = Array.from({ length: 10 }, () => new Euler());


const getReducedNeighborhoodState = (
    dropzone: Dropzone,
    t: number,
    x: number,
) => {
    const stateCount = dropzone.world.ca.stateCount;

    const sc = stateCount
        + 1; // for out of bounds
    let s1 = 0;
    for (let dt = -2; dt <= 2; dt++) {
        for (let dx = -2; dx <= 2; dx++) {
            s1 *= sc;
            s1 += caForDropzone(dropzone).at(t + dt, x + dx)
                ?? (stateCount + 0);
        }
    }

    return (t * dropzone.width + x) ^ s1;
};

export const epxandedSight = memoize((trek: TrekChain) => {
    const sight = sightAt(trek);
    const drop = startForTrek(trek);
    const visitedCells = {} as Record<number, Record<number, true>>;
    for (const [x, t] of sight.visitedCells) {
        (visitedCells[t] ??= {})[x] = true;
    }
    const collectedCells = {} as Record<number, Record<number, true>>;
    for (const [x, t] of sight.collectedCells) {
        (collectedCells[t] ??= {})[x] = true;
    }
    const composition = getComposition(drop.zone.world.ca);

    const [rock, grass, energy] = composition
        .map((p, i) => [p, i])
        .sort(([a], [b]) => b - a)
        .map(([_, i]) => i);

    return {
        sight,
        drop,
        visitedCells,
        collectedCells,
        composition,
        visualStateMap: { rock, grass, energy },
    };
});


const createCellView = ({
    tc, xc, sx, st,
    parent,
    boxHost: boxHost,
    onTrek,
    onFrame,
}: {
    tc: number, xc: number, sx: number, st: number,
    parent: Group,
    boxHost: InstancedMeshHost,
    onTrek: (callback: (trek: TrekChain) => void) => void,
    onFrame: (callback: RenderCallback) => void,
}) => {
    const boxPool = Array.from(
        { length: 10 },
        () => boxHost.getFreeClientOrThrow());
    let boxIndex = 0;
    const abuseBox = () => boxPool[boxIndex++];

    const onFrameCallbacks = [] as Array<(
        parentState: ParentState,
        ...rest: Parameters<RenderCallback>
    ) => void>;
    const abuseFrame = onFrameCallbacks.push.bind(onFrameCallbacks);

    const rootMatrixWorld = new Matrix4();
    let parentState = undefined as ParentState | undefined;

    onTrek(trek => {
        const expSight = epxandedSight(trek);
        const sight = expSight.sight;
        const dropzone = expSight.drop.zone;

        const pos = sight.playerPosition;
        const [px, pt] = pos;
        const cx = px - Math.floor(xc * 0.10);
        const ct = pt + Math.floor(tc * 0.30);

        const t1 = Math.round(ct / tc) * tc + st;
        const t = t1 + (ct > (t1 - tc / 2) ? 0 : -tc);

        const x1 = Math.round(cx / xc) * xc + sx;
        const x = x1 + (cx > (x1 - xc / 2) ? 0 : -xc);

        const isInBounds = t >= 0 && x >= 0 && x < dropzone.width;
        if (isInBounds) {
            const isVisited = expSight.visitedCells[t]?.[x] ?? false;
            const isCollected = expSight.collectedCells[t]?.[x] ?? false;

            const stateChanged =
                !parentState
                || parentState.state.dropzone !== dropzone
                || parentState.state.t !== t
                || parentState.state.x !== x
                || parentState.state.isVisited !== isVisited
                || parentState.state.isCollected !== isCollected;

            if (stateChanged) {
                boxIndex = 0;
                onFrameCallbacks.splice(0);

                if (!parentState) {
                    parentState = {
                        rootMatrixWorld,
                        prevState: undefined,
                        state: { trek, t, x, isVisited, isCollected, dropzone },
                    };
                } else {
                    parentState.prevState =
                        dropzone !== parentState.state.dropzone
                            ? undefined
                            : parentState.state;
                    parentState.state = {
                        trek, t, x, isVisited, isCollected, dropzone,
                    };
                }

                parent.updateMatrixWorld(true);
                rootMatrixWorld.compose(
                    _v3s[0].set(t, 0, x),
                    _qs[0].identity(),
                    _v3s[1].set(1, 1, 1),
                ).multiply(parent.matrixWorld);

                const rand = new LehmerPrng(
                    1 + getReducedNeighborhoodState(dropzone, t, x));

                Cell({
                    ...parentState,
                    abuseRandom: rand.nextFloat.bind(rand),
                    abuseBox,
                    abuseFrame,
                });
            }
        } else {
            parentState = undefined;
            boxIndex = 0;
            onFrameCallbacks.splice(0);
        }

        for (let i = boxIndex; i < boxPool.length; i++) {
            boxPool[i].setMatrix(zeroScaleMatrix);
        }
    });

    onFrame((...args) => {
        if (onFrameCallbacks.length === 0) { return; }

        if (!parentState) { return; }
        const { x, t } = parentState.state;

        parent.updateMatrixWorld();
        rootMatrixWorld.compose(
            _v3s[0].set(t, 0, x),
            _qs[0].identity(),
            _v3s[1].set(1, 1, 1),
        ).multiply(parent.matrixWorld);

        for (const callback of onFrameCallbacks) {
            callback(parentState, ...args);
        }
    });

    return () => {
        for (const box of boxPool) { box.deuse(); }
    };
};

export function CellsView({
    tCellsPerScreen: tc, xCellsPerScreen: xc, ...props
}: {
    tCellsPerScreen: number;
    xCellsPerScreen: number;
} & ThreeElements["group"]) {
    const trek = useRecoilValue(trekRecoil);

    const { parent, frameSignal, trekSignal } = useMemo(() => {
        const parent = new Group();
        const boxHost = new InstancedMeshHost(
            new BoxGeometry(),
            new MeshPhongMaterial(),
            tc * xc * 10,
        );
        boxHost.receiveShadow = true;
        boxHost.castShadow = true;
        boxHost.frustumCulled = false;
        parent.add(boxHost);
        const frameSignal = [] as RenderCallback[];
        const trekSignal = [] as ((trek: TrekChain) => void)[];
        const disposeBag = Array.from({ length: tc * xc }, (_, i) =>
            createCellView({
                tc,
                xc,
                sx: i % xc,
                st: Math.floor(i / xc),
                parent,
                boxHost,
                onFrame: (callback: RenderCallback) =>
                    frameSignal.push(callback),
                onTrek: (callback: (trek: TrekChain) => void) =>
                    trekSignal.push(callback),
            }));
        return {
            parent: parent,
            trekSignal,
            frameSignal,
            dispose() { for (const x of disposeBag) { x(); } },
        };
    }, [tc, xc]);
    useMemo(() => {
        for (const x of trekSignal) { x(trek); }
    }, [trekSignal, trek]);
    useFrame((...args) => {
        for (const x of frameSignal) { x(...args); }
    });
    return <primitive object={parent} {...props} />;
}
