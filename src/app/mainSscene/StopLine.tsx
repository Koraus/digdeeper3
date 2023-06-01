import { useRecoilValue } from "recoil";
import { sightAt, trekRecoil } from "../trekRecoil";

export function StopLine() {
    const trek = useRecoilValue(trekRecoil);
    const sight = sightAt(trek);
    return <group position={[sight.depth - 0.5, 1, sight.playerPosition[0]]}>
        <mesh position={[0.1, -0.8, 0]}>
            <boxGeometry args={[0.05, 1, 200]} />
            <meshPhongMaterial
                color={"white"} />
        </mesh>
        {sight.depth > 0 && <mesh position={[-61 / 2 + 0.1, 0, 0]}>
            <boxGeometry args={[61, 1.09, 200]} />
            <meshBasicMaterial
                color={"#6b008c"}
                transparent
                opacity={0.5}
            />
        </mesh>}
    </group >;
}
