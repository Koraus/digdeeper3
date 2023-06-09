import { jsx } from "@emotion/react";
import { EvacuationLineParticles } from "./EvacuationLineParticles";
import { useRecoilValue } from "recoil";
import { sightAt, startForTrek, trekRecoil } from "../trekRecoil";
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
    const trek = useRecoilValue(trekRecoil);
    const dropzone = startForTrek(trek).zone;

    const p = evacuationLineProgress(sightAt(trek).maxDepth);
    const line = Math.floor(p) + 1;

    // preload sounds
    useMemo(() => new Howl(sound), []);

    useEffect(() => {
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
