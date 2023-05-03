import { useRecoilValue } from "recoil";
import { sightAt } from "../../model/terms";
import { trekRecoil } from "../trekRecoil";

export function StopLine() {
    const trek = useRecoilValue(trekRecoil);
    const sight = sightAt(trek);
    return <mesh position={[15, -sight.depth + 1, 1]}>
        <boxGeometry args={[31, 0.2]} />
        <meshPhongMaterial
            color={"black"} />
    </mesh>;
}
