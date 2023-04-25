import { useRecoilState } from "recoil";
import { worldAt } from "../../model/terms";
import { progressionRecoil } from "../progressionRecoil";
import { offer } from "../../copilot";
import { ThreeElements } from "@react-three/fiber";


export function CopilotView({
    ...props
}: ThreeElements["group"]) {
    const [progression] = useRecoilState(progressionRecoil);
    const world = worldAt(progression);
    const pos = world.playerPosition;

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
        })()].map((p, i, arr) => {
            const prevP = i > 0 ? arr[i - 1] : pos;
            return <group
                key={i}
                position={[p[0], -p[1], 0]}
                rotation={[
                    0,
                    0,
                    Math.PI / 2
                    + Math.atan2(-(p[1] - prevP[1]), p[0] - prevP[0]),
                ]}
            >
                <mesh
                    position={[0, 0.5, 0.5]}
                >
                    <cylinderGeometry args={[
                        0.01 * (arr.length - i),
                        0.01 * (arr.length - i - 1),
                        1,
                    ]} />
                    <meshBasicMaterial color={"grey"} />
                </mesh>
            </group>;
        })}
    </group>;
}
