import { Box } from "@react-three/drei";
import { GroupSync } from "../../utils/GroupSync";
import { jsx } from "@emotion/react";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { startForTrek } from "../../model/terms";


export function StartingCamp({
    ...props
}: jsx.JSX.IntrinsicElements["group"]) {
    const trek = useRecoilValue(trekRecoil);
    const drop = startForTrek(trek);

    return <group
        position={[-2.5, 0, (drop.dropzone.width - 1) / 2]}
        {...props}
    >
        <Box
            position={[0, -1, 0]}
            scale={[4, 2, 11]}
        >
            <meshStandardMaterial
                color={"#9db863"} />

        </Box>
        <Box
            scale={[1, 0.1, 1]}
            rotation={[0, Math.PI / 4, 0]}
            position={[1, 0.1, 0]}
        >
            <meshStandardMaterial
                color={"#5a7573"} />

        </Box>
        <GroupSync
            scale={[0.3, 0.3, 0.3]}
            rotation={[Math.PI / 4, 0, 1.6]}
            position={[0.8, 0.3, 0]}
            onFrame={(g, { clock }) => {
                const timeSec = clock.getElapsedTime();

                const speed = 4;

                const c0 = g.children[0];
                c0.position.x = Math.sin(timeSec * speed * 2) * 0.1;
                c0.position.y = Math.sin(timeSec * speed * 3) * 0.1;
                c0.position.z = Math.sin(timeSec * speed * 1) * 0.1;
                c0.rotation.x = Math.sin(timeSec * speed * 2) * 0.6;
                c0.rotation.y = Math.sin(timeSec * speed * 3) * 0.6;
                c0.rotation.z = Math.sin(timeSec * speed * 1) * 0.6;
                c0.scale.x = 1 + Math.sin(timeSec * speed * 2) * 0.1;
                c0.scale.y = 1 + Math.sin(timeSec * speed * 3) * 0.1;
                c0.scale.z = 1 + Math.sin(timeSec * speed * 1) * 0.1;
            }}
        ><Box><meshStandardMaterial color={"#ec6a0d"} /></Box></GroupSync>
        <GroupSync
            scale={[0.45, 0.45, 0.45]}
            rotation={[Math.PI / 4, 0, 1]}
            position={[1.1, 0.3, 0.1]}
            onFrame={(g, { clock }) => {
                const timeSec = clock.getElapsedTime();

                const speed = 0.6;

                const c0 = g.children[0];
                c0.position.x = Math.sin(timeSec * speed * 2) * 0.1;
                c0.position.y = Math.sin(timeSec * speed * 3) * 0.1;
                c0.position.z = Math.sin(timeSec * speed * 1) * 0.1;
                c0.rotation.x = Math.sin(timeSec * speed * 2) * 0.6;
                c0.rotation.y = Math.sin(timeSec * speed * 3) * 0.6;
                c0.rotation.z = Math.sin(timeSec * speed * 1) * 0.6;
                c0.scale.x = 1 + Math.sin(timeSec * speed * 2) * 0.1;
                c0.scale.y = 1 + Math.sin(timeSec * speed * 3) * 0.1;
                c0.scale.z = 1 + Math.sin(timeSec * speed * 1) * 0.1;
            }}
        ><Box><meshStandardMaterial color={"#ec6a0d"} /></Box></GroupSync>
        <GroupSync
            scale={[0.45, 0.45, 0.45]}
            rotation={[Math.PI / 4, 0, 1]}
            position={[1.1, 0.3, -0.1]}
            onFrame={(g, { clock }) => {
                const timeSec = clock.getElapsedTime();

                const speed = 1;

                const c0 = g.children[0];
                c0.position.x = Math.sin(timeSec * speed * 2) * 0.1;
                c0.position.y = Math.sin(timeSec * speed * 3) * 0.1;
                c0.position.z = Math.sin(timeSec * speed * 1) * 0.1;
                c0.rotation.x = Math.sin(timeSec * speed * 2) * 0.6;
                c0.rotation.y = Math.sin(timeSec * speed * 3) * 0.6;
                c0.rotation.z = Math.sin(timeSec * speed * 1) * 0.6;
                c0.scale.x = 1 + Math.sin(timeSec * speed * 2) * 0.1;
                c0.scale.y = 1 + Math.sin(timeSec * speed * 3) * 0.1;
                c0.scale.z = 1 + Math.sin(timeSec * speed * 1) * 0.1;
            }}
        ><Box><meshStandardMaterial color={"#ec6a0d"} /></Box></GroupSync>
        <Box
            position={[-0.1, 0.2, -2.4]}
            scale={[1.5, 1.5, 2]}
            rotation={[0, 0.6, Math.PI / 4]}
        >
            <meshStandardMaterial
                color={"#376b2a"} />
        </Box>
        <Box
            position={[0.5, 0.2, 2.5]}
            scale={[1, 1, 2]}
            rotation={[0, -0.3, Math.PI / 4]}
        >
            <meshStandardMaterial
                color={"#376b2a"} />
        </Box>
    </group>;
}
