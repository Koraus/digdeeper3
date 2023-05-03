import { useRecoilValue } from "recoil";
import { sightAt } from "../../model/terms";
import { trekRecoil } from "../trekRecoil";

export function StopLine() {
    const trek = useRecoilValue(trekRecoil);
    const sight = sightAt(trek);
    return <mesh position={[sight.playerPosition[0], -sight.depth + 0.6, 0]}>
        <boxGeometry args={[31, 0.2, 1.1]} />
        <meshPhongMaterial
            color={"white"} />
    </mesh>;
}
