import { ThreeElements } from "@react-three/fiber";
import { v2 } from "../../utils/v";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { sightAt } from "../../model/terms";
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
        const gbox = new BoxGeometry(1, 1, 1);
        const cells = Array.from(
            { length: tc * xc },
            () => new Mesh(gbox, new MeshPhongMaterial()));
        const manualUpdateGroup = new ManualUpdateGroup();
        manualUpdateGroup.add(...cells);
        return { manualUpdateGroup, cells };
    }, [tc, xc]);
    useEffect(() => {
        const sight = sightAt(trek);
        const dropzone = trekDropzone(trek);
        const emptyState = dropzone.world.emptyState;

        const pos = sight.playerPosition;
        const [px, pt] = pos;

        const colors = (["#8000FF", "#404040", "#80FF00"] as const)
            .map(x => new Color(x));

        for (let st = 0; st < tc; st++) {
            for (let sx = 0; sx < xc; sx++) {
                const cell = cells[st * xc + sx];

                const t1 = Math.round(pt / tc) * tc + st;
                const t = t1 + (pt > (t1 - tc / 2) ? 0 : -tc);

                const x1 = Math.round(px / xc) * xc + sx;
                const x = x1 + (px > (x1 - xc / 2) ? 0 : -xc);

                cell.position.set(x, -t, 0);

                const isInBounds = t >= 0 && x >= 0 && x < dropzone.width;
                if (!isInBounds) {
                    cell.visible = false;
                    continue;
                }

                const caState = caForDropzone(dropzone)._at(t, x);
                const isVisited = sight.emptyCells
                    .some(p => v2.eqStrict(p, [x, t]));

                if (isVisited) {
                    if (caState === emptyState) {
                        cell.visible = false;
                    } else {
                        cell.visible = true;

                        cell.material.color.copy(colors[caState]);
                        cell.material.transparent = true;
                        cell.material.opacity = 0.3;
                        cell.material.needsUpdate = true;

                        cell.scale.set(1, 1, 0.01);
                        cell.position.z = -0.5;
                    }
                } else {
                    cell.visible = true;
                    cell.material.color.copy(colors[caState]);
                    cell.scale.setScalar(1);
                    cell.position.z = 0;
                    if (caState !== emptyState) {
                        cell.material.transparent = false;
                        cell.material.opacity = 1;
                    } else {
                        cell.material.transparent = true;
                        cell.material.opacity = 0.6;
                    }
                    cell.material.needsUpdate = true;
                }
            }
        }
        manualUpdateGroup.manualUpdateMatrixWorld();
    }, [tc, xc, cells, trek, manualUpdateGroup]);
    return <primitive object={manualUpdateGroup} {...props} />;
}
