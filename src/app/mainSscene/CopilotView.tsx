import { useRecoilState } from "recoil";
import { worldAt } from "../../model/terms";
import { progressionRecoil } from "../progressionRecoil";
import { offer } from "../../copilot";
import { ThreeElements } from "@react-three/fiber";


export function CopilotView({
    ...props
}: ThreeElements["group"]) {
    const [progression] = useRecoilState(progressionRecoil);

    return <group {...props}>
        {[...(function* () {
            const stepsToOffer = 10;
            let pr = progression;
            for (let i = 0; i < stepsToOffer; i++) {
                const theOffer = offer(pr);
                if (!theOffer) { break; }
                pr = {
                    prev: pr,
                    action: theOffer,
                };
                const w = worldAt(pr);
                yield w.playerPosition;
            }
        })()].map((p, i, { length }) => <mesh
            key={i}
            position={[p[0], -p[1], 0.5]}
        >
            <sphereGeometry args={[0.01 * (length - i)]} />
            <meshBasicMaterial color={"grey"} />
        </mesh>)}
    </group>;
}
