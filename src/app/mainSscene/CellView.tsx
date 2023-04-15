import { useEffect, useState } from "react";
import { Cell, universe } from "../model/universe";
import { ThreeElements } from "@react-three/fiber";
import * as rx from "rxjs";
import { player } from "../model/player";

export function CellView({
    sx, st, tc, xc, ...props
}: {
    st: number;
    sx: number;
    tc: number;
    xc: number;
} & ThreeElements["group"]) {
    const [pos, setPos] = useState<{ x: number, t: number }>({
        t: 0,
        x: 0,
    });
    useEffect(() => {
        const s = universe.stateVersion.subscribe(() => {
            setPos(player.cell);
        });
        return () => s.unsubscribe();
    }, [universe.stateVersion]);

    const pos_t = pos.t + universe.step;
    const t1 = Math.floor(pos_t / tc) * tc + st;
    const t = [t1, t1 + tc, t1 - tc]
        .sort((a, b) => Math.abs(pos_t - a) - Math.abs(pos_t - b))[0];

    const x1 = Math.floor(pos.x / xc) * xc + sx;
    const x = [x1, x1 + xc, x1 - xc]
        .sort((a, b) => Math.abs(pos.x - a) - Math.abs(pos.x - b))[0];

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
            && !(cell.isEmpty && cell.state === 1)
            && <mesh>
                <boxGeometry />
                <meshPhongMaterial
                    color={["#8000FF", "#404040", "#80FF00"][cell?.state ?? 0]}
                    transparent
                    opacity={(cell && cell.state !== 1)
                        ? (cell.isEmpty ? 0.3 : 1)
                        : 0.3} />
            </mesh>
        }
    </group>;
}
