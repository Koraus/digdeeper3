import { useRecoilState } from "recoil";
import { worldAt } from "../../model/terms";
import { progressionRecoil } from "../progressionRecoil";
import { offer } from "../../copilot";
import { ThreeElements } from "@react-three/fiber";


export function CopilotView({
    ...props
}: ThreeElements["group"]) {
    const [progression] = useRecoilState(progressionRecoil);
    const theOffer = offer(progression);

    return <group {...props}>
        {[...(function *() {
            let pr = progression;
            for (const o of theOffer) {
                pr = {
                    prev: pr,
                    action: o,
                };
                const w = worldAt(pr);
                yield w.playerPosition;
            }
        })()].map((p, i) => <mesh
            key={i}
            position={[p[0], -p[1], 0.5]}
        >
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color={"grey"} />
        </mesh>)}
    </group>;
}
