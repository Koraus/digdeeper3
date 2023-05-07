import { useRecoilState } from "recoil";
import { sightAt } from "../../model/terms";
import { trekRecoil } from "../trekRecoil";
import { indexedActions, offer } from "../../copilot";
import { ThreeElements } from "@react-three/fiber";


export function CopilotView({
    ...props
}: ThreeElements["group"]) {
    const [trek] = useRecoilState(trekRecoil);
    const sight = sightAt(trek);
    const pos = sight.playerPosition;

    return <group {...props}>
        {[...(function* () {
            const stepsToOffer = 10;
            let pr = trek;
            for (let i = 0; i < stepsToOffer; i++) {
                const theOffer = offer(pr);
                if (!theOffer) { break; }

                // if (i === 0) { console.log("offer", theOffer); }
                const actionIndex = theOffer
                    .map((v, i) => [i, v])
                    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0]?.[0];
                const action = indexedActions[actionIndex];
                pr = {
                    prev: pr,
                    action,
                };
                const w = sightAt(pr);
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
