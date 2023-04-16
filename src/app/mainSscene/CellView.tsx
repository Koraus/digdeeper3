import { useEffect, useState } from "react";
import { Cell, emptyState, universe } from "../model/universe";
import { ThreeElements } from "@react-three/fiber";
import * as rx from "rxjs";
import { player } from "../model/player";
import { v2 } from "../../utils/v";

export function CellView({
    sx, st, tc, xc, ...props
}: {
    st: number;
    sx: number;
    tc: number;
    xc: number;
} & ThreeElements["group"]) {
    const [pos, setPos] = useState(v2.zero());
    useEffect(() => {
        const s = universe.stateVersion.subscribe(() => {
            setPos(player.position);
        });
        return () => s.unsubscribe();
    }, [universe.stateVersion]);

    const pos_t = pos[1];
    const t1 = Math.floor(pos_t / tc) * tc + st;
    const t = [t1, t1 + tc, t1 - tc]
        .sort((a, b) => Math.abs(pos_t - a) - Math.abs(pos_t - b))[0];

    const x1 = Math.floor(pos[0] / xc) * xc + sx;
    const x = [x1, x1 + xc, x1 - xc]
        .sort((a, b) => Math.abs(pos[0] - a) - Math.abs(pos[0] - b))[0];

    const caState = universe.getCaState(t, x);

    const [cell, setCell] = useState<Cell>();
    useEffect(() => {
        const d = universe.stateVersion
            .pipe(
                rx.map(() => ({ ...universe.get(t, x) ?? {} })),
                rx.distinctUntilChanged((p, c) =>
                    JSON.stringify(p) === JSON.stringify(c)),
            )
            .subscribe(setCell);
        return () => d.unsubscribe();
    }, [universe.stateVersion, x, t]);

    return <group {...props} position={[x, -t, 0]}>
        {cell
            && !(cell.isEmpty && caState === emptyState)
            && <mesh>
                <boxGeometry />
                <meshPhongMaterial
                    color={["#8000FF", "#404040", "#80FF00"][caState]}
                    transparent
                    opacity={(cell && caState !== emptyState)
                        ? (cell.isEmpty ? 0.3 : 1)
                        : 0.3} />
            </mesh>
        }
    </group>;
}
