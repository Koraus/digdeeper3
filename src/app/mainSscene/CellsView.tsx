import { ThreeElements, useFrame } from "@react-three/fiber";
import { v2 } from "../../utils/v";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { Dropzone, Trek, sightAt } from "../../model/terms";
import { trekDropzone } from "../../model/terms";
import { caForDropzone } from "../../model/terms";
import { useEffect, useMemo } from "react";
import { BoxGeometry, Color, Group, Mesh, MeshPhongMaterial } from "three";
import { LehmerPrng } from "../../utils/LehmerPrng";


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

    const gbox = new BoxGeometry(1, 1, 1);
    const floorColors = (["#576c6e", "#b7d55c", "#c6ed71"] as const)
        .map(x => new Color(x));

    const grassMaterial = new MeshPhongMaterial({
        color: "#94e56e",
    });

    const pickableMaterial = new MeshPhongMaterial({
        color: "#b635d3",
    });

    const rockMaterial = new MeshPhongMaterial({
        color: "#2e444f",
    });

    const brickMaterial = new MeshPhongMaterial({
        color: "#e18c5b",
    });

    return ({
        tc, xc, sx, st, host,
    }: {
        tc: number, xc: number, sx: number, st: number, host: Group
    }) => {
        const root = new Group();
        host.add(root);

        const floor = new Mesh(gbox, new MeshPhongMaterial());
        floor.position.set(0, -1, 0);
        floor.scale.set(1, 2, 1);
        root.add(floor);

        const grass1 = new Mesh(gbox, grassMaterial);
        grass1.position.set(0, 0.1, 0);
        grass1.scale.set(1.05, 0.2, 1.05);
        root.add(grass1);
        const grass2 = new Mesh(gbox, grassMaterial);
        grass2.scale.set(0.1, 0.5, 0.1);
        grass2.position.set(0, 0.25, 0);
        root.add(grass2);
        const grass3 = new Mesh(gbox, grassMaterial);
        grass3.scale.set(0.1, 0.7, 0.1);
        grass3.position.set(0, 0.35, 0);
        root.add(grass3);

        const pickable = new Mesh(gbox, pickableMaterial);
        pickable.scale.set(0.5, 0.5, 0.5);
        pickable.rotation.set(Math.PI / 4, Math.PI / 6, 0);
        pickable.position.set(0, 0.55, 0);
        root.add(pickable);

        const rock1 = new Mesh(gbox, rockMaterial);
        rock1.position.set(0, 0.4, 0);
        rock1.scale.set(1, 0.8, 1);
        root.add(rock1);
        const rock2 = new Mesh(gbox, rockMaterial);
        rock2.scale.set(0.9, 1, 0.9);
        rock2.position.set(0, 0, 0);
        root.add(rock2);

        const brick1 = new Mesh(gbox, brickMaterial);
        brick1.scale.set(0.6, 0.05, 0.6);
        brick1.position.set(0, 0.01, 0);
        root.add(brick1);
        const brick2 = new Mesh(gbox, brickMaterial);
        brick2.scale.set(0.4, 0.05, 0.3);
        brick2.position.set(0, 0.01, 0);
        root.add(brick2);
        const brick3 = new Mesh(gbox, brickMaterial);
        brick3.scale.set(0.3, 0.05, 0.4);
        brick3.position.set(0, 0.01, 0);
        root.add(brick3);

        const m1 = new Mesh(gbox, new MeshPhongMaterial());
        root.add(m1);

        let _t = undefined as number | undefined;
        let _x = undefined as number | undefined;

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

                root.position.set(t, 0, x);

                floor.visible = false;
                m1.visible = false;
                grass1.visible = false;
                grass2.visible = false;
                grass3.visible = false;
                pickable.visible = false;
                rock1.visible = false;
                rock2.visible = false;
                brick1.visible = false;
                brick2.visible = false;
                brick3.visible = false;

                const isInBounds = t >= 0 && x >= 0 && x < dropzone.width;
                if (!isInBounds) { return; }

                const rand = new LehmerPrng(
                    1 + getReducedNeighborhoodState(dropzone, t, x));

                const caState = caForDropzone(dropzone)._at(t, x);
                const isVisited = sight.visitedCells
                    .some(p => v2.eqStrict(p, [x, t]));

                floor.visible = true;
                floor.material.color.copy(floorColors[caState]);
                floor.material.needsUpdate = true;

                if (!isVisited) {
                    if (caState === emptyState) {
                        grass1.visible = true;
                        grass2.visible = true;
                        grass2.position.x = rand.nextFloat() - 0.5;
                        grass2.position.z = rand.nextFloat() - 0.5;
                        grass3.visible = true;
                        grass3.position.x = rand.nextFloat() - 0.5;
                        grass3.position.z = rand.nextFloat() - 0.5;
                    }
                    if (caState === 2) {
                        pickable.visible = true;
                    }
                    if (caState === 0) {
                        rock1.visible = true;
                        rock2.visible = true;
                        rock2.scale.x = 0.4 + 0.8 * rand.nextFloat();
                        rock2.scale.y = 0.4 + 0.8 * rand.nextFloat();
                        rock2.scale.z = 0.4 + 0.8 * rand.nextFloat();
                        rock2.position.x = 0.5 * (rand.nextFloat() - 0.5);
                        rock2.position.y = 0.8 * rand.nextFloat();
                        rock2.position.z = 0.5 * (rand.nextFloat() - 0.5);
                    }
                } else {
                    brick1.visible = true;
                    brick1.position.x = 0.3 * (rand.nextFloat() - 0.5);
                    brick1.position.z = 0.3 * (rand.nextFloat() - 0.5);
                    brick2.visible = true;
                    brick2.position.x = 1 * (rand.nextFloat() - 0.5);
                    brick2.position.z = 1 * (rand.nextFloat() - 0.5);
                    brick3.visible = true;
                    brick3.position.x = 1 * (rand.nextFloat() - 0.5);
                    brick3.position.z = 1 * (rand.nextFloat() - 0.5);
                }
            },
            update() {
                const timeSec = performance.now() / 1000;
                pickable.rotation.x = 0.3 * timeSec;
                pickable.rotation.y = 0.2 * Math.sin(timeSec);
                pickable.rotation.z = 0.3 * timeSec;
                pickable.position.y = 0.5 + 0.2 * Math.sin(timeSec + (_t ?? 0));
                pickable.updateMatrixWorld(true);
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
        const host = new ManualUpdateGroup();
        return {
            manualUpdateGroup: host,
            cells: Array.from({ length: tc * xc }, (_, i) => createCellView({
                tc,
                xc,
                sx: i % xc,
                st: Math.floor(i / xc),
                host,
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
