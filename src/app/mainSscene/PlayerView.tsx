import { ThreeElements } from "@react-three/fiber";
import { useWindowEvent } from "../../utils/reactish/useWindowEvent";
import { useRecoilState } from "recoil";
import { sightAt, trekRecoil } from "../trekRecoil";
import { useMakeStep } from "../useMakeStep";
import { offer } from "../../copilot";
import { instructions } from "../../model/terms/PackedTrek";
import { useState } from "react";
import { Character } from "./Character";


export function PlayerView({
    children, ...props
}: ThreeElements["group"]) {
    const [trek, setTrek] = useRecoilState(trekRecoil);
    const sight = sightAt(trek);
    const pos = sight.playerPosition;
    const makeStep = useMakeStep();

    // todo detect rotation from trek
    // todo and move controls into a separate component
    const [rotation, setRotation] = useState(0);

    useWindowEvent("keydown", ev => {
        switch (ev.code) {
            case "ArrowLeft":
            case "KeyA": {
                makeStep("backward");
                setRotation(3);
                break;
            }
            case "ArrowRight":
            case "KeyD": {
                makeStep("forward");
                setRotation(1);
                break;
            }
            case "ArrowUp":
            case "KeyW": {
                makeStep("left");
                setRotation(2);
                break;
            }
            case "ArrowDown":
            case "KeyS": {
                makeStep("right");
                setRotation(0);
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
        <Character
            rotation={[0, rotation * Math.PI / 2, 0]}
        />
        {children}
    </group>;
}
