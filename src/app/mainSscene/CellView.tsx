import { useEffect, useState } from "react";
import { Cell, universe } from "../model/universe";
import { ThreeElements } from "@react-three/fiber";
import * as rx from "rxjs";

export function CellView({
    x, t, ...props
}: {
    t: number;
    x: number;
} & ThreeElements["mesh"]) {
    const [cell, setCell] = useState<Cell>();
    useEffect(() => {
        const d = universe.stateVersion
            .pipe(
                rx.map(() => ({ ...universe.spacetime[t][x] })),
                rx.distinctUntilChanged((p, c) =>
                    JSON.stringify(p) === JSON.stringify(c)),
            )
            .subscribe(setCell);
        return () => d.unsubscribe();
    }, [universe.stateVersion, x, t]);

    return <mesh {...props}>
        <boxGeometry />
        <meshPhongMaterial
            color={["#8000FF", "#000000", "#80FF00"][cell?.state ?? 0]}
            transparent
            opacity={(cell && cell.state !== 1)
                ? (cell.isEmpty ? 0.3 : 1)
                : 0} />
    </mesh>;
}
