import { jsx } from "@emotion/react";
import { EvacuationLineParticles } from "./EvacuationLineParticles";
import { useRecoilValue } from "recoil";
import { sightAt, startForTrek, trekRecoil } from "../trekRecoil";
import { evacuationLinePosition, evacuationLineProgress } from "../../model/evacuation";


export function EvacuationLine({
    ...props
}: jsx.JSX.IntrinsicElements["group"] & {
    isPrev?: boolean;
}) {
    const trek = useRecoilValue(trekRecoil);
    const dropzone = startForTrek(trek).zone;

    const p = evacuationLineProgress(sightAt(trek).maxDepth);

    return <group
        {...props}
    >
        <EvacuationLineParticles
            position={[
                evacuationLinePosition(Math.floor(p) + 1),
                0,
                dropzone.width / 2]}
            width={dropzone.width}
        />
    </group>;
}
