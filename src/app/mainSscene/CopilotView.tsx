import { useRecoilState } from "recoil";
import { sightAt, trekRecoil } from "../trekRecoil";
import { offer } from "../../copilot";
import { ThreeElements } from "@react-three/fiber";
import { instructions } from "../../model/terms/PackedTrek";


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
                const action = instructions[actionIndex];
                pr = {
                    prev: pr,
                    instruction: action,
                };
                const w = sightAt(pr);
                yield w.playerPosition;
            }
        })()].map((p, i, arr) => {
            const prevP = i > 0 ? arr[i - 1] : pos;
            const dx = p[0] - prevP[0];
            const dt = p[1] - prevP[1];
            return <group
                key={i}
                position={[p[1], 0.6, p[0]]}
                rotation={[
                    0,
                    -Math.atan2(dx, dt),
                    Math.PI / 2,
                ]}
            >
                <mesh
                    position={[0, 0.5, 0]}
                >
                    <cylinderGeometry args={[
                        0.02 * (arr.length - i),
                        0.02 * (arr.length - i - 1),
                        1,
                    ]} />
                    <meshBasicMaterial color={"grey"} />
                </mesh>
            </group>;
        })}
    </group>;
}
