import { GizmoHelper, GizmoViewport, PerspectiveCamera } from "@react-three/drei";
import { CellsView } from "./cells/CellsView";
import { PlayerView } from "./PlayerView";
import { CopilotView } from "./CopilotView";
import { StopLine } from "./StopLine";
import { GroupSync } from "../../utils/GroupSync";
import { Object3D, Vector3 } from "three";
import { dampVector3 } from "../../utils/dampVector3";
import { useMemo } from "react";

export function MainScene() {
    const lightTarget = useMemo(() => new Object3D(), []);
    return <>
        <color attach="background" args={["#6b008c"]} />
        <fog attach="fog" args={["#6b008c", 45, 51]} />

        <ambientLight intensity={0.5} />


        <GizmoHelper
            alignment="bottom-right"
            margin={[80, 110]}
        >
            <GizmoViewport />
        </GizmoHelper>

        <PerspectiveCamera
            makeDefault
            fov={40}
            near={0.1}
            far={1000}
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
                onFrame={(g, { camera }, delta) => {

                    const p = new Vector3(12.5, 32, 20);
                    g.localToWorld(p);
                    camera.parent?.worldToLocal(p);

                    if (camera.position.distanceTo(p) > 10) {
                        camera.position.copy(p);
                    } else if (camera.position.distanceTo(p) > 0.1) {
                        dampVector3(
                            camera.position, camera.position, p, 3, delta);
                    } else {
                        // 
                    }

                    if (camera.rotation.x === 0) {
                        const z = new Vector3(0, 0, 0);
                        g.localToWorld(z);
                        camera.parent?.worldToLocal(z);
                        z.x += 14;
                        z.y += 10;
                        z.z += 6;
                        camera.lookAt(z);
                    }
                }} />
        </PlayerView>
        <CopilotView />

        <StopLine />

        <CellsView tCellsPerScreen={71} xCellsPerScreen={51} />
    </>;
}
