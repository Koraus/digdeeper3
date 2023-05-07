import { useRecoilValue } from "recoil";
import { sightAt } from "../../model/terms";
import { trekRecoil } from "../trekRecoil";

export function StopLine() {
    const trek = useRecoilValue(trekRecoil);
    const sight = sightAt(trek);
    return <group position={[sight.playerPosition[0], -sight.depth + 0.5, 0]}>
        <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[31, 0.2, 1.1]} />
            <meshPhongMaterial
                color={"white"} />
        </mesh>
        <mesh position={[0, 61 / 2 + 0.1, 0]}>
            <boxGeometry args={[31, 61, 1.09]} />
            <meshPhongMaterial
                color={"black"}
                transparent
                opacity={0.6}
            />
        </mesh>
    </group>;
}
