import { v3 } from "../../utils/v";
import { GizmoHelper, GizmoViewport, PerspectiveCamera, Box, OrbitControls, Grid } from "@react-three/drei";
import { GroupSync } from "../../utils/GroupSync";


export function MainScene() {

    return <>
        <color attach="background" args={["#0a000d"]} />

        <ambientLight intensity={0.5} />
        <directionalLight
            intensity={0.6}
            position={[0, 5, 5]}
        />
        <PerspectiveCamera
            makeDefault
            fov={60}
            near={0.1}
            far={1000}
            position={v3.scale(v3.from(1, Math.SQRT2, 1), 5)}
        >
        </PerspectiveCamera>
        <OrbitControls />
        <GizmoHelper
            alignment="bottom-right"
            margin={[80, 110]}
        >
            <GizmoViewport />
        </GizmoHelper>

        <GroupSync onFrame={g => {
            g.rotation.x = performance.now() / 1000 * 0.1;
            g.rotation.y = performance.now() / 1000 * 0.2;
            g.rotation.z = performance.now() / 1000 * 0.5;
        }}>
            <Box>
                <meshPhongMaterial color={"#d7d7ff"} />
            </Box>
        </GroupSync>
        <Grid infiniteGrid />
    </>;
}
