import { ThreeElements } from "@react-three/fiber";
import { useWindowEvent } from "../../utils/reactish/useWindowEvent";
import { useRecoilState } from "recoil";
import { sightAt, trekRecoil } from "../trekRecoil";
import { useMakeStep } from "../useMakeStep";
import { offer } from "../../copilot";
import { instructions } from "../../model/terms/PackedTrek";
import { useState } from "react";



export function PlayerView({
    children, ...props
}: ThreeElements["group"]) {
    const [trek, setTrek] = useRecoilState(trekRecoil);
    const sight = sightAt(trek);
    const pos = sight.playerPosition;
    const makeStep = useMakeStep();

    const [rotation, setRotation] = useState(0);

    useWindowEvent("keydown", ev => {
        switch (ev.code) {
            case "ArrowLeft":
            case "KeyA": {
                makeStep("backward");
                setRotation(2);
                break;
            }
            case "ArrowRight":
            case "KeyD": {
                makeStep("forward");
                setRotation(0);
                break;
            }
            case "ArrowUp":
            case "KeyW": {
                makeStep("left");
                setRotation(1);
                break;
            }
            case "ArrowDown":
            case "KeyS": {
                makeStep("right");
                setRotation(-1);
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
        <group
            position={[0, 0.7, 0]}
            rotation={[0, rotation * Math.PI / 2, 0]}
        >
            <group
                rotation={[0, 0, 0.3]}
            >
                <group scale={[0.9, 0.9, 0.9]}>
                    <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[0.5]} />
                        <meshBasicMaterial color="#f98501" />
                    </mesh>
                    <mesh
                        position={[0.12, 0, 0]}
                        scale={[0.8, 0.6, 1]}
                    >
                        <sphereGeometry args={[0.5]} />
                        <meshBasicMaterial color="#000000" />
                    </mesh>
                </group>
                <mesh position={[-0.1, 0, 0]}>
                    <sphereGeometry args={[0.52]} />
                    <meshBasicMaterial
                        color="#f98501"
                    />
                </mesh>
                <mesh>
                    <sphereGeometry args={[0.5]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.3}
                    />
                </mesh>
            </group>
            <group

                position={[-0.3, 0.25, 0.3]}
                rotation={[0.3, 0, 0.5]}
            >
                <mesh
                    position={[0, 0.25, 0]}
                >
                    <cylinderGeometry args={[0.04, 0.12, 0.5]} />
                    <meshBasicMaterial color="#959191" />
                </mesh>
                <mesh
                    position={[-0.09, 0.6, 0.02]}
                    rotation={[0.2, 0, 0.47]}
                >
                    <cylinderGeometry args={[0.02, 0.08, 0.5]} />
                    <meshBasicMaterial color="#959191" />
                </mesh>
            </group>
            <group

                position={[-0.3, 0.25, -0.3]}
                rotation={[-0.3, 0, 0.5]}
                scale={[1, 1, -1]}
            >
                <mesh
                    position={[0, 0.25, 0]}
                >
                    <cylinderGeometry args={[0.04, 0.12, 0.5]} />
                    <meshBasicMaterial color="#959191" />
                </mesh>
                <mesh
                    position={[-0.09, 0.6, 0.02]}
                    rotation={[0.2, 0, 0.47]}
                >
                    <cylinderGeometry args={[0.02, 0.08, 0.5]} />
                    <meshBasicMaterial color="#959191" />
                </mesh>
            </group>
        </group>
        {children}
    </group>;
}
