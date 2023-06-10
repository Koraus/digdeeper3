import { jsx } from "@emotion/react";
import { EvacuationLineParticles } from "./EvacuationLineParticles";
import { useRecoilValue } from "recoil";
import { playerActionRecoil, sightAt, startForTrek } from "../playerActionRecoil";
import { evacuationLinePosition, evacuationLineProgress } from "../../model/evacuation";
import { Howl, HowlOptions } from "howler";
import sound1Url from "../sounds/619837__eponn__soft-short-app-melody.mp3";
import { useEffect, useMemo } from "react";


const sound: HowlOptions = { src: [sound1Url] };

export function EvacuationLine({
    ...props
}: jsx.JSX.IntrinsicElements["group"] & {
    isPrev?: boolean;
}) {
    const playerAction = useRecoilValue(playerActionRecoil);
    const trek = playerAction.trek;
    const dropzone = startForTrek(trek).zone;

    const p = evacuationLineProgress(sightAt(trek).maxDepth);
    const line = Math.floor(p) + 1;

    // preload sounds
    useMemo(() => new Howl(sound), []);

    useEffect(() => {
        // note: no playerAction in deps, 
        // as the sound should play only when the line has changed
        if (playerAction.action?.action !== "step") { return; }

        if (line === 1) { return; }
        const howl = new Howl(sound);
        howl.play();
        return () => { howl.stop(); };
    }, [line]);

    return <group
        {...props}
    >
        <EvacuationLineParticles
            position={[
                evacuationLinePosition(line),
                0,
                dropzone.width / 2]}
            width={dropzone.width}
        />
    </group>;
}
