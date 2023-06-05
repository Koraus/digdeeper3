import type { jsx } from "@emotion/react";
import { DropEquipmentSelector } from "./DropEquipmentSelector";
import { Canvas } from "@react-three/fiber";
import { Character } from "../mainSscene/Character";
import { CameraControls } from "@react-three/drei";
import { useLayoutEffect, useRef } from "react";
import { Box3, PerspectiveCamera, Vector3 } from "three";
import { LevelBadge } from "../LevelBadge";


function PlayerPanelScene() {
    const cameraControlsRef = useRef<CameraControls>(null);
    useLayoutEffect(() => {
        const cameraControls = cameraControlsRef.current;
        if (!cameraControls) { return; }
        (cameraControls.camera as PerspectiveCamera).fov = 30;
        cameraControls.camera.updateProjectionMatrix();
        cameraControls.setLookAt(
            -2, 3, 5,
            0, 0.75, 0);
        cameraControls.setBoundary(new Box3(
            new Vector3(0, 0, 0),
            new Vector3(0, 1, 0),
        ));
    });


    return <>
        <Character />
        <mesh>
            <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
            <meshBasicMaterial color="#9c9c9c" />
        </mesh>

        <CameraControls
            ref={cameraControlsRef}
            minDistance={4}
            maxDistance={8}
            minPolarAngle={0}
            maxPolarAngle={Math.PI * 0.6}
        />
    </>;
}


export function PlayerPanel({
    css: cssProp, ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    return <div css={[{
        display: "flex",
        flexDirection: "column",
        width: "40vmin",
    }, cssProp]} {...props}>
        <div css={{
            background: "#ffffff20",
            height: "50vmin",
        }}>
            <Canvas><PlayerPanelScene /></Canvas>
        </div>
        <LevelBadge css={{
            marginTop: "-1.3em",
            marginLeft: "-0.1em",
        }} />
        <DropEquipmentSelector />
    </div>;
}
