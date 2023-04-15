import { universe } from "../model/universe";
import { ThreeElements } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { v2 } from "../../utils/v";
import { player } from "../model/player";

export function PlayerView({
    children, ...props
}: ThreeElements["group"]) {
    const [pos, setPos] = useState<v2>(v2.zero());
    useEffect(() => {
        const s = universe.stateVersion.subscribe(() => {
            const { t, x } = player.cell;
            setPos([x, -(t + universe.step)]);
        });
        return () => s.unsubscribe();
    }, [universe.stateVersion]);

    return <group
        {...props}
        position={[...pos, 0]}
    >
        <mesh position={[0, 0, 1]}>
            <sphereGeometry args={[0.5]} />
        </mesh>
        {children}
    </group>;
}
