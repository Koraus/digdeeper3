import { useWindowEvent } from "../utils/reactish/useWindowEvent";
import { useRecoilState } from "recoil";
import { useMakeStep } from "./useMakeStep";
import { offer } from "../copilot";
import { instructions } from "../model/terms/PackedTrek";
import { playerActionRecoil } from "./playerActionRecoil";


export function usePlayerControls() {
    const [playerAction, setPlayerAction] = useRecoilState(playerActionRecoil);
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
                const trek = playerAction.trek;
                const theOffer = offer(trek);
                if (!theOffer) { break; }
                const actionIndex = theOffer
                    .map((v, i) => [i, v])
                    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0]?.[0];
                const action = instructions[actionIndex];
                makeStep(action, true);
                break;
            }
            case "KeyZ": {
                const trek = playerAction.trek;
                if ("prev" in trek) {
                    setPlayerAction({
                        action: { action: "undo" },
                        ok: true,
                        log: undefined,
                        trek: trek.prev,
                    });
                } else {
                    setPlayerAction({
                        action: { action: "undo" },
                        ok: false,
                        log: "nothing to undo",
                        trek,
                    });
                }
                break;
            }
        }
    });
}
