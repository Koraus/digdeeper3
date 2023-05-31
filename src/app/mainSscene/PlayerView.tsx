import { ThreeElements } from "@react-three/fiber";
import { useWindowEvent } from "../../utils/reactish/useWindowEvent";
import { useRecoilState } from "recoil";
import { sightAt, trekRecoil, useMakeStep } from "../trekRecoil";
import { offer } from "../../copilot";
import { instructions } from "../../model/terms/PackedTrek";



export function PlayerView({
    children, ...props
}: ThreeElements["group"]) {
    const [trek, setTrek] = useRecoilState(trekRecoil);
    const sight = sightAt(trek);
    const pos = sight.playerPosition;
    const makeStep = useMakeStep();

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
