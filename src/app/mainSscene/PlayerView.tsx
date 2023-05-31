import { ThreeElements } from "@react-three/fiber";
import { useWindowEvent } from "../../utils/reactish/useWindowEvent";
import { useRecoilState } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { sightAt } from "../../model/sightChain";
import { offer } from "../../copilot";
import { instructionIndices, instructions } from "../../model/terms/PackedTrek";
import { packTrekChain } from "../../model/trekChain";
import { submitTrek } from "../submitTrek";
import { evacuationLineProgress, isEvacuationLineCrossed } from "../../model/evacuation";


export function PlayerView({
    children, ...props
}: ThreeElements["group"]) {
    const [trek, setTrek] = useRecoilState(trekRecoil);
    const sight = sightAt(trek);
    const pos = sight.playerPosition;
    const makeStep = (instruction: keyof typeof instructionIndices) => {
        const nextTrek =
            !("prev" in trek) || sight.ok
                ? { prev: trek, instruction }
                : { ...trek, instruction };
        const nextSight = sightAt(nextTrek);

        if (isEvacuationLineCrossed(sight.maxDepth, nextSight.maxDepth)) {
            submitTrek(packTrekChain(nextTrek)); //no await
        }
        setTrek(nextTrek);
    };

    useWindowEvent("keydown", ev => {
        switch (ev.code) {
            case "ArrowLeft":
            case "KeyA": {
                makeStep("backward");
                break;
            }
            case "ArrowRight":
            case "KeyD": {
                makeStep("forward");
                break;
            }
            case "ArrowUp":
            case "KeyW": {
                makeStep("left");
                break;
            }
            case "ArrowDown":
            case "KeyS": {
                makeStep("right");
                break;
            }
            case "KeyC": {
                const theOffer = offer(trek);
                if (!theOffer) { break; }
                const actionIndex = theOffer
                    .map((v, i) => [i, v])
                    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0]?.[0];
                const action = instructions[actionIndex];
                makeStep(action);
                break;
            }
            case "KeyZ": {
                if ("prev" in trek) {
                    setTrek(trek.prev);
                }
                break;
            }
        }
    });

    return <group
        {...props}
        position={[pos[1], 0, pos[0]]}
    >
        <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.5]} />
        </mesh>
        {children}
    </group>;
}
