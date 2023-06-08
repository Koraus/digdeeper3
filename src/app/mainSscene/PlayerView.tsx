import { ThreeElements } from "@react-three/fiber";
import { useRecoilValue } from "recoil";
import { TrekChain, sightAt, trekRecoil } from "../trekRecoil";
import { Character } from "./Character";


const rotationForTrek = (trek: TrekChain) => {
    if (!("prev" in trek)) { return 0; }

    const curCop = sightAt(trek).playerPosition;
    const prevCop = sightAt(trek.prev).playerPosition;

    const [dx, dt] = [curCop[0] - prevCop[0], curCop[1] - prevCop[1]];

    if (dx === 0 && dt === 0) { return 0; }
    if (dx === 0) { return dt > 0 ? 1 : 3; }
    if (dt === 0) { return dx > 0 ? 0 : 2; }
    return 0;
};

export function PlayerView({
    children, ...props
}: ThreeElements["group"]) {
    const trek = useRecoilValue(trekRecoil);
    const sight = sightAt(trek);
    const pos = sight.playerPosition;

    const rotation = rotationForTrek(trek);

    return <group
        {...props}
        position={[pos[1], 0, pos[0]]}
    >
        <Character
            rotation={[0, rotation * Math.PI / 2, 0]}
        />
        {children}
    </group>;
}
