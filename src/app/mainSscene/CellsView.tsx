import { ThreeElements, useFrame } from "@react-three/fiber";
import { v2 } from "../../utils/v";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { Dropzone, Trek, sightAt } from "../../model/terms";
import { trekDropzone } from "../../model/terms";
import { caForDropzone } from "../../model/terms";
import { useEffect, useMemo } from "react";
import { BoxGeometry, Color, Group, MeshPhongMaterial } from "three";
import { LehmerPrng } from "../../utils/LehmerPrng";
import { InstancedMeshHost } from "../../utils/InstancedMeshHost";


export class ManualUpdateGroup extends Group {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateMatrixWorld(force?: boolean | undefined): void {
        // suppress
    }

    manualUpdateMatrixWorld(): void {
        super.updateMatrixWorld(true);
    }
}

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

    const floorColors = (["#576c6e", "#b7d55c", "#c6ed71"] as const)
        .map(x => new Color(x));

    const grassColor = new Color("#94e56e");
    const pickableColor = new Color("#b635d3");
    const rockColor = new Color("#2e444f");
    const brickColor = new Color("#e18c5b");

    return ({
        tc, xc, sx, st,
        parent,
        boxHost: boxHost,
    }: {
        tc: number, xc: number, sx: number, st: number,
        parent: Group,
        boxHost: InstancedMeshHost,
    }) => {
        const root = new Group();
        parent.add(root);

        const boxPool = Array.from({ length: 5 }, () => {
            const box = boxHost.getFreeClientOrThrow();
            root.add(box);
            return box;
        });
        let boxIndex = 0;
        const getBox = () => {
            const box = boxPool[boxIndex++];
            box.visible = true;
            box.scale.set(1, 1, 1);
            box.position.set(0, 0, 0);
            box.rotation.set(0, 0, 0, "XYZ");
            return box;
        };

        let _t = undefined as number | undefined;
        let _x = undefined as number | undefined;

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

                _t = t;
                _x = x;

                boxIndex = 0;
                _pickable = undefined;

                const isInBounds = t >= 0 && x >= 0 && x < dropzone.width;
                if (isInBounds) {
                    root.position.set(t, 0, x);

                    const rand = new LehmerPrng(
                        1 + getReducedNeighborhoodState(dropzone, t, x));

                    const caState = caForDropzone(dropzone)._at(t, x);
                    const isVisited = sight.visitedCells
                        .some(p => v2.eqStrict(p, [x, t]));

                    const floor = getBox();
                    floor.visible = true;
                    floor.position.set(0, -1, 0);
                    floor.scale.set(1, 2, 1);
                    floor.color = floorColors[caState];

                    if (!isVisited) {
                        if (caState === emptyState) {
                            const grass1 = getBox();
                            grass1.color = grassColor;
                            grass1.position.set(0, 0.1, 0);
                            grass1.scale.set(1.05, 0.2, 1.05);

                            const grass2 = getBox();
                            grass2.color = grassColor;
                            grass2.scale.set(0.1, 0.5, 0.1);
                            grass2.position.set(0, 0.25, 0);
                            grass2.position.x = rand.nextFloat() - 0.5;
                            grass2.position.z = rand.nextFloat() - 0.5;

                            const grass3 = getBox();
                            grass3.color = grassColor;
                            grass3.scale.set(0.1, 0.7, 0.1);
                            grass3.position.set(0, 0.35, 0);
                            grass3.position.x = rand.nextFloat() - 0.5;
                            grass3.position.z = rand.nextFloat() - 0.5;
                        }
                        if (caState === 2) {
                            const pickable = getBox();
                            pickable.color = pickableColor;
                            pickable.scale.set(0.5, 0.5, 0.5);
                            pickable.rotation.set(Math.PI / 4, Math.PI / 6, 0);
                            pickable.position.set(0, 0.55, 0);
                            root.add(pickable);
                            _pickable = pickable;
                        }
                        if (caState === 0) {
                            const rock1 = getBox();
                            rock1.color = rockColor;
                            rock1.position.set(0, 0.4, 0);
                            rock1.scale.set(1, 0.8, 1);

                            if (rand.nextFloat() < 0.5) {

                                const rock2 = getBox();
                                rock2.color = rockColor;
                                rock2.scale.x = 0.4 + 0.8 * rand.nextFloat();
                                rock2.scale.y = 0.4 + 0.8 * rand.nextFloat();
                                rock2.scale.z = 0.4 + 0.8 * rand.nextFloat();
                                rock2.position.x =
                                    0.5 * (rand.nextFloat() - 0.5);
                                rock2.position.y = 0.8 * rand.nextFloat();
                                rock2.position.z =
                                    0.5 * (rand.nextFloat() - 0.5);
                            }
                        }
                    } else {
                        const brick1 = getBox();
                        brick1.color = brickColor;
                        brick1.scale.set(0.6, 0.05, 0.6);
                        brick1.position.set(0, 0.01, 0);
                        brick1.position.x = 0.3 * (rand.nextFloat() - 0.5);
                        brick1.position.z = 0.3 * (rand.nextFloat() - 0.5);


                        if (rand.nextFloat() < 0.5) {
                            const brick2 = getBox();
                            brick2.color = brickColor;
                            brick2.scale.set(0.4, 0.05, 0.3);
                            brick2.position.set(0, 0.01, 0);
                            brick2.position.x = 1 * (rand.nextFloat() - 0.5);
                            brick2.position.z = 1 * (rand.nextFloat() - 0.5);
                        }
                        if (rand.nextFloat() < 0.5) {
                            const brick3 = getBox();
                            brick3.color = brickColor;
                            brick3.scale.set(0.3, 0.05, 0.4);
                            brick3.position.set(0, 0.01, 0);
                            brick3.position.x = 1 * (rand.nextFloat() - 0.5);
                            brick3.position.z = 1 * (rand.nextFloat() - 0.5);
                        }
                    }
                }

                for (let i = boxIndex; i < boxPool.length; i++) {
                    boxPool[i].visible = false;
                }
            },
            update() {
                const timeSec = performance.now() / 1000;
                if (_pickable) {
                    _pickable.rotation.x = 0.3 * timeSec;
                    _pickable.rotation.y = 0.2 * Math.sin(timeSec);
                    _pickable.rotation.z = 0.3 * timeSec;
                    _pickable.position.y = 0.5
                        + 0.2 * Math.sin(timeSec + (_t ?? 0));
                    _pickable.updateMatrixWorld(true);
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

    const { manualUpdateGroup, cells } = useMemo(() => {
        const parent = new ManualUpdateGroup();
        const host = new InstancedMeshHost(
            new BoxGeometry(),
            new MeshPhongMaterial(),
            20000,
        );
        parent.add(host);
        return {
            manualUpdateGroup: parent,
            cells: Array.from({ length: tc * xc }, (_, i) => createCellView({
                tc,
                xc,
                sx: i % xc,
                st: Math.floor(i / xc),
                parent,
                boxHost: host,
            })),
        };
    }, [tc, xc]);
    useEffect(() => {
        for (const cell of cells) { cell.layout(trek); }
        manualUpdateGroup.manualUpdateMatrixWorld();
    }, [cells, trek, manualUpdateGroup]);
    useFrame(() => {
        for (const cell of cells) { cell.update(); }
    });
    return <primitive object={manualUpdateGroup} {...props} />;
}
