import { useRecoilValue } from "recoil";
import { sightAt } from "../../model/terms";
import { trekRecoil } from "../trekRecoil";

export function StopLine() {
    const trek = useRecoilValue(trekRecoil);
    const sight = sightAt(trek);
    return <group position={[sight.depth - 0.5, 1, sight.playerPosition[0]]}>
        <mesh position={[0.1, 0, 0]}>
            <boxGeometry args={[0.2, 1.1, 31]} />
            <meshPhongMaterial
                color={"white"} />
        </mesh>
        <mesh position={[-61 / 2 + 0.1, 0, 0]}>
            <boxGeometry args={[61, 1.09, 31]} />
            <meshPhongMaterial
                color={"black"}
                transparent
                opacity={0.6}
            />
        </mesh>
    </group>;
}
