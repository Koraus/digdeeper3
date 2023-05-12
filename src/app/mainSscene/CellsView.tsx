import { ThreeElements, useFrame } from "@react-three/fiber";
import { v2 } from "../../utils/v";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { Dropzone, Trek, sightAt } from "../../model/terms";
import { trekDropzone } from "../../model/terms";
import { caForDropzone } from "../../model/terms";
import { useEffect, useMemo } from "react";
import { BoxGeometry, Color, Euler, Group, Matrix4, MeshPhongMaterial, Quaternion, Vector3 } from "three";
import { LehmerPrng } from "../../utils/LehmerPrng";
import { InstancedMeshHost, zeroScaleMatrix } from "../../utils/InstancedMeshHost";


const createCellView = (() => {
    const getReducedNeighborhoodState = (
        dropzone: Dropzone,
        t: number,
        x: number,
    ) => {
        const stateCount = dropzone.world.ca.stateCount;

        const sc = stateCount
            + 1; // for out of bounds
        let s1 = 0;
        for (let dt = -4; dt <= 0; dt++) {
            for (let dx = -4; dx <= 0; dx++) {
                s1 *= sc;
                s1 += caForDropzone(dropzone).at(t + dt, x + dx)
                    ?? (stateCount + 0);
            }
        }

        let s2 = 0;
        for (let dt = 1; dt <= 4; dt++) {
            for (let dx = 1; dx <= 4; dx++) {
                s2 *= sc;
                s2 += caForDropzone(dropzone).at(t + dt, x + dx)
                    ?? (stateCount + 0);
            }
        }
        return s1 ^ s2;
    };

    const _m4s = Array.from({ length: 10 }, () => new Matrix4());
    const _v3s = Array.from({ length: 10 }, () => new Vector3());
    const _qs = Array.from({ length: 10 }, () => new Quaternion());
    const _es = Array.from({ length: 10 }, () => new Euler());

    const floorColors = (["#576c6e", "#d8dd76", "#ffc57a"] as const)
        .map(x => new Color(x));

    const grassColor = new Color("#90ea67");
    const pickableColor = new Color("#b635d3");
    const rockColor = new Color("#2e444f");
    const brickColor = new Color("#ff8968");

    type LayoutContext = {
        rootMatrixWorld: Matrix4,
        random: () => number,
        getBox: () => ReturnType<InstancedMeshHost["getFreeClientOrThrow"]>,
    };
    function layoutGrass({ rootMatrixWorld, random, getBox }: LayoutContext) {
        const grass1 = getBox();
        grass1.setColor(grassColor);
        grass1.setMatrix(_m4s[1].compose(
            _v3s[0].set(0, 0.1, 0),
            _qs[0].identity(),
            _v3s[1].set(1.05, 0.2, 1.05),
        ).premultiply(rootMatrixWorld));

        if (random() < 0.8) {
            const grass2 = getBox();
            grass2.setColor(grassColor);
            grass2.setMatrix(_m4s[1].compose(
                _v3s[0].set(
                    0 + random() - 0.5,
                    0.25,
                    0 + random() - 0.5),
                _qs[0].identity(),
                _v3s[1].set(0.1, 0.5, 0.1),
            ).premultiply(rootMatrixWorld));
        }

        if (random() < 0.8) {
            const grass3 = getBox();
            grass3.setColor(grassColor);
            grass3.setMatrix(_m4s[1].compose(
                _v3s[0].set(
                    0 + random() - 0.5,
                    0.35,
                    0 + random() - 0.5),
                _qs[0].identity(),
                _v3s[1].set(0.1, 0.7, 0.1),
            ).premultiply(rootMatrixWorld));
        }
    }

    function layoutRock({ rootMatrixWorld, random, getBox }: LayoutContext) {
        const rock1 = getBox();
        rock1.setColor(rockColor);
        rock1.setMatrix(_m4s[1].compose(
            _v3s[0].set(0, 0.4, 0),
            _qs[0].identity(),
            _v3s[1].set(1, 0.8, 1),
        ).premultiply(rootMatrixWorld));

        if (random() < 0.5) {
            const rock2 = getBox();
            rock2.setColor(rockColor);
            rock2.setMatrix(_m4s[1].compose(
                _v3s[0].set(
                    0.5 * (random() - 0.5),
                    0.8 * random(),
                    0.5 * (random() - 0.5)),
                _qs[0].identity(),
                _v3s[1].set(
                    0.4 + 0.8 * random(),
                    0.4 + 0.8 * random(),
                    0.4 + 0.8 * random()),
            ).premultiply(rootMatrixWorld));
        }
    }

    function layoutBricks({ rootMatrixWorld, random, getBox }: LayoutContext) {
        const brick1 = getBox();
        brick1.setColor(brickColor);
        brick1.setMatrix(_m4s[1].compose(
            _v3s[0].set(
                0.3 * (random() - 0.5),
                0.01,
                0.3 * (random() - 0.5)),
            _qs[0].identity(),
            _v3s[1].set(0.6, 0.05, 0.6),
        ).premultiply(rootMatrixWorld));

        if (random() < 0.5) {
            const brick2 = getBox();
            brick2.setColor(brickColor);
            brick2.setMatrix(_m4s[1].compose(
                _v3s[0].set(
                    1 * (random() - 0.5),
                    0.01,
                    1 * (random() - 0.5)),
                _qs[0].identity(),
                _v3s[1].set(0.4, 0.05, 0.3),
            ).premultiply(rootMatrixWorld));
        }
        if (random() < 0.5) {
            const brick3 = getBox();
            brick3.setColor(brickColor);
            brick3.setMatrix(_m4s[1].compose(
                _v3s[0].set(
                    1 * (random() - 0.5),
                    0.01,
                    1 * (random() - 0.5)),
                _qs[0].identity(),
                _v3s[1].set(0.3, 0.05, 0.4),
            ).premultiply(rootMatrixWorld));
        }
    }


    return ({
        tc, xc, sx, st,
        parent,
        boxHost: boxHost,
    }: {
        tc: number, xc: number, sx: number, st: number,
        parent: Group,
        boxHost: InstancedMeshHost,
    }) => {
        const boxPool = Array.from(
            { length: 5 },
            () => boxHost.getFreeClientOrThrow());
        let boxIndex = 0;
        const getBox = () => boxPool[boxIndex++];

        let prevState = undefined as {
            t: number,
            x: number,
            isVisited: boolean,
        } | undefined;

        let _pickable = undefined as typeof boxPool[number] | undefined;

        return {
            layout(
                trek: Trek,
            ) {
                const sight = sightAt(trek);
                const dropzone = trekDropzone(trek);
                const emptyState = dropzone.world.emptyState;

                const pos = sight.playerPosition;
                const [px, pt] = pos;

                const t1 = Math.round(pt / tc) * tc + st;
                const t = t1 + (pt > (t1 - tc / 2) ? 0 : -tc);

                const x1 = Math.round(px / xc) * xc + sx;
                const x = x1 + (px > (x1 - xc / 2) ? 0 : -xc);

                const isInBounds = t >= 0 && x >= 0 && x < dropzone.width;
                if (isInBounds) {
                    const isVisited = sight.visitedCells
                        .some(p => v2.eqStrict(p, [x, t]));

                    const stateChanged =
                        !prevState
                        || prevState.t !== t
                        || prevState.x !== x
                        || prevState.isVisited !== isVisited;

                    if (stateChanged) {
                        boxIndex = 0;
                        _pickable = undefined;

                        prevState = { t, x, isVisited };

                        const caState = caForDropzone(dropzone)._at(t, x);
                        parent.updateMatrixWorld(true);
                        const rootMatrixWorld = _m4s[0].compose(
                            _v3s[0].set(t, 0, x),
                            _qs[0].identity(),
                            _v3s[1].set(1, 1, 1),
                        ).multiply(parent.matrixWorld);

                        const rand = new LehmerPrng(
                            1 + getReducedNeighborhoodState(dropzone, t, x));

                        const layoutContext = {
                            rootMatrixWorld,
                            random: rand.nextFloat.bind(rand),
                            getBox,
                        };

                        const floor = getBox();
                        floor.setColor(floorColors[caState]);
                        floor.setMatrix(_m4s[1].compose(
                            _v3s[0].set(0, -1, 0),
                            _qs[0].identity(),
                            _v3s[1].set(1, 2, 1),
                        ).premultiply(rootMatrixWorld));

                        if (!isVisited) {
                            if (caState === emptyState) {
                                layoutGrass(layoutContext);
                            }
                            if (caState === 2) {
                                const pickable = getBox();
                                pickable.setColor(pickableColor);
                                _pickable = pickable;
                            }
                            if (caState === 0) {
                                layoutRock(layoutContext);
                            }
                        } else {
                            layoutBricks(layoutContext);
                        }
                    }
                } else {
                    prevState = undefined;
                }

                for (let i = boxIndex; i < boxPool.length; i++) {
                    boxPool[i].setMatrix(zeroScaleMatrix);
                }
            },
            frame(...args: Parameters<Parameters<typeof useFrame>[0]>) {
                if (!prevState) { return; }

                if (_pickable) {
                    const { x, t } = prevState;

                    parent.updateMatrixWorld(true);
                    const rootMatrixWorld = _m4s[0].compose(
                        _v3s[0].set(t, 0, x),
                        _qs[0].identity(),
                        _v3s[1].set(1, 1, 1),
                    ).multiply(parent.matrixWorld);

                    const { clock } = args[0];
                    const timeSec = clock.elapsedTime;

                    _pickable.setMatrix(_m4s[1].compose(
                        _v3s[0].set(
                            0,
                            0.5 + 0.2 * Math.sin(timeSec + (t ?? 0)),
                            0),
                        _qs[0].setFromEuler(
                            _es[0].set(
                                0.3 * timeSec,
                                0.2 * Math.sin(timeSec),
                                0.3 * timeSec,
                                "XYZ"),
                            true),
                        _v3s[1].set(0.5, 0.5, 0.5),
                    ).premultiply(rootMatrixWorld));
                }
            },
            dispose() {
                for (const box of boxPool) { box.deuse(); }
            },
        };
    };
})();

export function CellsView({
    tCellsPerScreen: tc, xCellsPerScreen: xc, ...props
}: {
    tCellsPerScreen: number;
    xCellsPerScreen: number;
} & ThreeElements["group"]) {
    const trek = useRecoilValue(trekRecoil);

    const { parent, cells } = useMemo(() => {
        const parent = new Group();
        const boxHost = new InstancedMeshHost(
            new BoxGeometry(),
            new MeshPhongMaterial(),
            tc * xc * 5,
        );
        parent.add(boxHost);
        return {
            parent: parent,
            cells: Array.from({ length: tc * xc }, (_, i) => createCellView({
                tc,
                xc,
                sx: i % xc,
                st: Math.floor(i / xc),
                parent,
                boxHost,
            })),
        };
    }, [tc, xc]);
    useEffect(() => {
        for (const cell of cells) { cell.layout(trek); }
    }, [cells, trek, parent]);
    useFrame((...args) => {
        for (const cell of cells) { cell.frame(...args); }
    });
    return <primitive object={parent} {...props} />;
}
