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
    const sight = sightAt(trek);
    const pos = sight.playerPosition;

    const p = evacuationLineProgress(pos[1]);

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
