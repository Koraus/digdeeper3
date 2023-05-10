import { ThreeElements } from "@react-three/fiber";
import { v2 } from "../../utils/v";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { Dropzone, Sight, Trek, sightAt } from "../../model/terms";
import { trekDropzone } from "../../model/terms";
import { caForDropzone } from "../../model/terms";
import { useEffect, useMemo } from "react";
import { BoxGeometry, Color, Group, Mesh, MeshPhongMaterial } from "three";


export class ManualUpdateGroup extends Group {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateMatrixWorld(force?: boolean | undefined): void {
        // suppress
    }

    manualUpdateMatrixWorld(): void {
        super.updateMatrixWorld(true);
    }
}

export function CellsView({
    tCellsPerScreen: tc, xCellsPerScreen: xc, ...props
}: {
    tCellsPerScreen: number;
    xCellsPerScreen: number;
} & ThreeElements["group"]) {
    const trek = useRecoilValue(trekRecoil);

    const { manualUpdateGroup, cells } = useMemo(() => {
        const g = new ManualUpdateGroup();

        const colors = (["#8000FF", "#404040", "#80FF00"] as const)
            .map(x => new Color(x));

        const gbox = new BoxGeometry(1, 1, 1);

        const cells = Array.from(
            { length: tc * xc },
            (_, i) => {
                const sx = i % xc;
                const st = Math.floor(i / xc);

                const floor = new Mesh(gbox, new MeshPhongMaterial());
                g.add(floor);

                const m1 = new Mesh(gbox, new MeshPhongMaterial());
                g.add(m1);
                return {
                    update(
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

                        m1.position.set(t, 0.5, x);

                        const isInBounds = t >= 0
                            && x >= 0 && x < dropzone.width;
                        if (!isInBounds) {
                            floor.visible = false;
                            m1.visible = false;
                            return;
                        }

                        const caState = caForDropzone(dropzone)._at(t, x);
                        const isVisited = sight.visitedCells
                            .some(p => v2.eqStrict(p, [x, t]));

                        floor.position.set(t, -0.1, x);
                        floor.scale.set(1, 0.2, 1);
                        floor.material.color.copy(colors[caState]);
                        floor.material.needsUpdate = true;

                        m1.visible = false;
                        if (!isVisited && caState !== emptyState) {
                            m1.visible = true;
                            m1.material.color.copy(colors[caState]);
                            m1.material.needsUpdate = true;
                        }
                    },
                };
            });
        return { manualUpdateGroup: g, cells };
    }, [tc, xc]);
    useEffect(() => {
        for (const cell of cells) { cell.update(trek); }
        manualUpdateGroup.manualUpdateMatrixWorld();
    }, [cells, trek, manualUpdateGroup]);
    return <primitive object={manualUpdateGroup} {...props} />;
}
