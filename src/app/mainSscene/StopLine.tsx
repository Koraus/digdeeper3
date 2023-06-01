import { useRecoilValue } from "recoil";
import { sightAt, trekRecoil } from "../trekRecoil";

export function StopLine() {
    const trek = useRecoilValue(trekRecoil);
    const sight = sightAt(trek);
    return <group position={[sight.depth - 0.5, 1, sight.playerPosition[0]]}>
        <mesh position={[0.1, -0.6, 0]}>
            <boxGeometry args={[0.2, 0.3, 200]} />
            <meshPhongMaterial
                color={"white"} />
        </mesh>
        <mesh position={[-61 / 2 + 0.1, 0, 0]}>
            <boxGeometry args={[61, 1.09, 200]} />
            <meshBasicMaterial
                color={"#6b008c"}
                transparent
                opacity={0.6}
            />
        </mesh>
        <mesh position={[-61 / 2 + 0.1 - 1, 0.1, 0]}>
            <boxGeometry args={[61, 1.09, 200]} />
            <meshBasicMaterial
                color={"#6b008c"}
                transparent
                opacity={0.3}
            />
        </mesh>
        <mesh position={[-61 / 2 + 0.1 - 2, 0.5, 0]}>
            <boxGeometry args={[61, 1.09, 200]} />
            <meshBasicMaterial
                color={"#6b008c"}
                transparent
                opacity={0.6}
            />
        </mesh>
        <mesh position={[-61 / 2 + 0.1 - 3, 1, 0]}>
            <boxGeometry args={[61, 1.09, 200]} />
            <meshBasicMaterial
                color={"#6b008c"}
                transparent
                opacity={0.9}
            />
        </mesh>
    </group>;
}
