import { GizmoHelper, GizmoViewport, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { universe } from "../model/universe";
import { CellView } from "./CellView";
import { PlayerView } from "./PlayerView";

export function MainScene() {

    return <>
        <color attach="background" args={["#0a000d"]} />

        <ambientLight intensity={0.5} />
        <directionalLight
            intensity={0.6}
            position={[0, 5, 5]}
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
                position={[0, 0, 10]}
            >
            </PerspectiveCamera>
        </PlayerView>

        {universe.spacetime.map((space, t) => space.map((_, x) => {
            return <CellView
                key={`${t}_${x}`}
                position={[x, -t, 0]}
                t={t}
                x={x}
            />;
        }))}
    </>;
}
