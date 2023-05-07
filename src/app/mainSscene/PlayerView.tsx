import { ThreeElements } from "@react-three/fiber";
import { useWindowEvent } from "../../utils/useWindowEvent";
import { useRecoilState } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { sightAt } from "../../model/terms";
import { indexedActions, offer } from "../../copilot";

export function PlayerView({
    children, ...props
}: ThreeElements["group"]) {
    const [trek, setTrek] = useRecoilState(trekRecoil);
    const sight = sightAt(trek);
    const pos = sight.playerPosition;

    useWindowEvent("keydown", ev => {
        switch (ev.code) {
            case "ArrowLeft":
            case "KeyA": {
                setTrek({
                    prev: trek,
                    action: "left",
                });
                break;
            }
            case "ArrowRight":
            case "KeyD": {
                setTrek({
                    prev: trek,
                    action: "right",
                });
                break;
            }
            case "ArrowUp":
            case "KeyW": {
                setTrek({
                    prev: trek,
                    action: "backward",
                });
                break;
            }
            case "ArrowDown":
            case "KeyS": {
                setTrek({
                    prev: trek,
                    action: "forward",
                });
                break;
            }
            case "KeyC": {
                const theOffer = offer(trek);
                if (!theOffer) { break; }
                const actionIndex = theOffer
                    .map((v, i) => [i, v])
                    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0]?.[0];
                const action = indexedActions[actionIndex];
                setTrek({
                    prev: trek,
                    action,
                });
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
        position={[pos[0], -pos[1], 0]}
    >
        <mesh position={[0, 0, 1]}>
            <sphereGeometry args={[0.5]} />
        </mesh>
        {children}
    </group>;
}
