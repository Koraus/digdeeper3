import { GizmoHelper, GizmoViewport, PerspectiveCamera } from "@react-three/drei";
import { CellView } from "./CellView";
import { PlayerView } from "./PlayerView";
import { CopilotView } from "./CopilotView";
import { StopLine } from "./StopLine";
import { GroupSync } from "../../utils/GroupSync";
import { Vector3 } from "three";
import { dampVector3 } from "../../utils/dampVector3";

export function MainScene() {
    return <>
        <color attach="background" args={["#0a000d"]} />

        <ambientLight intensity={0.5} />
        <directionalLight
            intensity={0.6}
            position={[2, 3, 5]}
        />

        {/* <OrbitControls /> */}
        <GizmoHelper
            alignment="bottom-right"
            margin={[80, 110]}
        >
            <GizmoViewport />
        </GizmoHelper>

        <PerspectiveCamera
            makeDefault
            fov={60}
            near={0.1}
            far={1000}
        >
        </PerspectiveCamera>

        <PlayerView>
            <GroupSync
                onFrame={(g, { camera }, delta) => {
                    const z = new Vector3(0, 0, 0);
                    g.localToWorld(z);
                    camera.parent?.worldToLocal(z);

                    const p = new Vector3(0, 6, 30);
                    g.localToWorld(p);
                    camera.parent?.worldToLocal(p);

                    if (camera.position.distanceTo(p) > 10) {
                        camera.position.copy(p);
                    } else if (camera.position.distanceTo(p) > 0.1) {
                        dampVector3(
                            camera.position, camera.position, p, 0.1, delta);
                    } else {
                        // 
                    }

                    camera.lookAt(z);
                }} />
        </PlayerView>
        <CopilotView />

        <StopLine />

        {(function* () {
            const tCellsPerScreen = 61;
            const xCellsPerScreen = 51;
            for (let st = 0; st < tCellsPerScreen; st++) {
                for (let sx = 0; sx < xCellsPerScreen; sx++) {
                    yield <CellView
                        key={`${st}_${sx}`}
                        st={st}
                        sx={sx}
                        tc={tCellsPerScreen}
                        xc={xCellsPerScreen}
                    />;
                }
            }
        })().toArray()}
    </>;
}
