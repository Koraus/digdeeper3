import { GizmoHelper, GizmoViewport, PerspectiveCamera } from "@react-three/drei";
import { CellView } from "./CellView";
import { PlayerView } from "./PlayerView";
import { CopilotView } from "./CopilotView";
import { StopLine } from "./StopLine";

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

        <PlayerView>
            <PerspectiveCamera
                makeDefault
                fov={60}
                near={0.1}
                far={1000}
                position={[0, 6, 30]}
                rotation={[-0.3, 0, 0]}
            >
            </PerspectiveCamera>
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
