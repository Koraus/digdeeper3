import { ThreeElements } from "@react-three/fiber";
import { useWindowEvent } from "../../utils/useWindowEvent";
import { useRecoilState } from "recoil";
import { progressionRecoil } from "../progressionRecoil";
import { worldAt } from "../../model/terms";
import { offer } from "../../copilot";

export function PlayerView({
    children, ...props
}: ThreeElements["group"]) {
    const [progression, setProgression] = useRecoilState(progressionRecoil);
    const world = worldAt(progression);
    const pos = world.playerPosition;

    useWindowEvent("keydown", ev => {
        switch (ev.code) {
            case "ArrowLeft":
            case "KeyA": {
                setProgression({
                    prev: progression,
                    action: "left",
                });
                break;
            }
            case "ArrowRight":
            case "KeyD": {
                setProgression({
                    prev: progression,
                    action: "right",
                });
                break;
            }
            case "ArrowUp":
            case "KeyW": {
                setProgression({
                    prev: progression,
                    action: "backward",
                });
                break;
            }
            case "ArrowDown":
            case "KeyS": {
                setProgression({
                    prev: progression,
                    action: "forward",
                });
                break;
            }
            case "Space": {
                const theOffer = offer(progression);
                if (theOffer.length > 0) {
                    setProgression({
                        prev: progression,
                        action: theOffer[0],
                    });
                }
                break;
            }
            case "KeyZ": {
                if ("prev" in progression) {
                    setProgression(progression.prev);
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
