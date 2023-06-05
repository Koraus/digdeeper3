import { ThreeElements } from "@react-three/fiber";


export function Character({
    ...props
}: ThreeElements["group"]) {
    return <group {...props}>
        <group
            position={[0, 0.7, 0]}
            rotation={[0, -Math.PI / 2, 0]}
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
                        color="#f98501" />
                </mesh>
                <mesh>
                    <sphereGeometry args={[0.5]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.3} />
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
                    position={[-0.1, 0.64, 0.04]}
                    rotation={[0.2, 0, 0.47]}
                >
                    <cylinderGeometry args={[0.02, 0.07, 0.5]} />
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
                    position={[-0.1, 0.64, 0.04]}
                    rotation={[0.2, 0, 0.47]}
                >
                    <cylinderGeometry args={[0.02, 0.07, 0.5]} />
                    <meshBasicMaterial color="#959191" />
                </mesh>
            </group>
        </group>
    </group>;
}
