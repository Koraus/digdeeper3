import { GizmoHelper, GizmoViewport, PerspectiveCamera } from "@react-three/drei";
import { CellsView } from "./cells/CellsView";
import { PlayerView } from "./PlayerView";
import { CopilotView } from "./CopilotView";
import { StopLine } from "./StopLine";
import { GroupSync } from "../../utils/GroupSync";
import { Object3D, Vector3 } from "three";
import { dampVector3 } from "../../utils/dampVector3";
import { useEffect, useMemo } from "react";
import { StartingCamp } from "./StartingCamp";
import { EvacuationLine } from "./EvacuationLine";
import { useThree } from "@react-three/fiber";
import { setup as setupShaderSourceHooker } from "../../utils/glsl/hookShaderSource";
import { RandomStarsParticles } from "./RandomStarsParticles";
import { GalaxyStarsParticles } from "./GalaxyStarsParticles";


export function MainScene() {
    const gl = useThree(({ gl }) => gl);
    useEffect(() => setupShaderSourceHooker(gl.getContext()), [gl]);

    const lightTarget = useMemo(() => new Object3D(), []);
    return <>
        <color attach="background" args={["#2b002c"]} />
        <fog attach="fog" args={["#2b002c", 45, 51]} />

        <GalaxyStarsParticles />
        <RandomStarsParticles />

        <ambientLight intensity={0.5} />

        <PerspectiveCamera
            makeDefault
            fov={40}
            near={0.1}
            far={10000}
            rotation={[0, 0, 0]}
        />

        <PlayerView>
            <primitive object={lightTarget} />
            <GroupSync onFrame={(_g) => {
                // g.position.random().multiplyScalar(0.1);
            }} >
                <directionalLight
                    intensity={0.3}
                    position={[35, 45, 15]}
                    target={lightTarget}
                    castShadow
                    shadow-mapSize={[2 ** 10, 2 ** 11]}
                    shadow-bias={-0.0001}
                >
                    <orthographicCamera
                        attach="shadow-camera"
                        args={[-40, 40, 40, -40, 10, 150]}
                    />
                </directionalLight>
            </GroupSync>
            <directionalLight
                position={[35, 45, 15]}
                intensity={0.5}
                target={lightTarget}
            />
            <GroupSync
                onFrame={(g, { camera, size }, delta) => {
                    const aspect = size.width / size.height;

                    const aspectOffset = aspect > 1
                        ? new Vector3(-2 - aspect, 0, 0)
                        : new Vector3(-7 / Math.sqrt(aspect), 0, 0);

                    const p = new Vector3(12.5, 32, 20)
                        .add(aspectOffset);
                    g.localToWorld(p);
                    camera.parent?.worldToLocal(p);

                    if (camera.position.distanceTo(p) > 10) {
                        camera.position.copy(p);
                    } else if (camera.position.distanceTo(p) > 0.1) {
                        dampVector3(
                            camera.position, camera.position, p, 10, delta);
                    } else {
                        // 
                    }

                    if (camera.rotation.x === 0) {
                        const z = new Vector3(0, 0, 0);
                        g.localToWorld(z);
                        camera.parent?.worldToLocal(z);
                        z.add(aspectOffset)
                            .add(new Vector3(14, 10, 6));
                        camera.lookAt(z);
                    }
                }} />
        </PlayerView>
        <CopilotView />

        <StopLine />

        <CellsView tCellsPerScreen={71} xCellsPerScreen={51} />

        <StartingCamp />

        <EvacuationLine />
    </>;
}
