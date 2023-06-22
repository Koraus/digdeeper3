import type { jsx } from "@emotion/react";
import usePromise from "react-use-promise";
import { fetchLastTreks } from "./fetchLastTreks";
import { LoaderCircle } from "@emotion-icons/boxicons-regular/LoaderCircle";
import { Error as ErrorIcon } from "@emotion-icons/boxicons-solid/Error";
import { useRecoilValue } from "recoil";
import { playerActionRecoil, sightAt, startForTrek } from "./playerActionRecoil";
import { eqDropzone } from "../model/terms/Dropzone";
import { version as sightVersion } from "../model/version";
import { Sparkles } from "@emotion-icons/ionicons-solid/Sparkles";
import { useMemo, useState } from "react";
import { Reload } from "@emotion-icons/ionicons-solid/Reload";
import { useTranslate } from "./languageRecoil";
import { evacuationLineProgress } from "../model/evacuation";
import { applyStep, initSight } from "../model/sight";
import { enumerateBytecode } from "../model/terms/PackedTrek";
import { _never } from "../utils/_never";


export function DropStats({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const playerAction = useRecoilValue(playerActionRecoil);
    const dropzone = startForTrek(playerAction.trek).zone;
    const [refreahTrigger, setRefreahTrigger] = useState(0);
    const translate = useTranslate();
    const playerSight = sightAt(playerAction.trek);
    const playerNextEvacuationLine = Math.floor(evacuationLineProgress(playerSight.maxDepth)) + 1;

    const [treks, treksError, treksStatus] = usePromise(async () => {
        const treks = await fetchLastTreks();
        return treks
            .filter(t => t.v === sightVersion);
    }, [refreahTrigger]);

    const treks1 = useMemo(() =>
        treks
            ?.filter(t => eqDropzone(t.drop.zone, dropzone))
            .map(trek => {
                let sight = initSight(trek.drop);
                for (const instruction of enumerateBytecode(trek)) {
                    sight = applyStep(trek.drop, sight, instruction)[0]
                        ?? _never();
                }
                return ({
                    trek,
                    sight,
                });
            })
            .sort((a, b) =>
                (Math.floor(evacuationLineProgress(a.sight.maxDepth))
                    - Math.floor(evacuationLineProgress(b.sight.maxDepth)))
                || (a.trek.bytecodeLength - b.trek.bytecodeLength))
        , [treks, dropzone]);

    const treks2 = useMemo(() =>
        treks1
            ?.filter(({ sight }) =>
                Math.floor(evacuationLineProgress(sight.maxDepth))
                === playerNextEvacuationLine)
        , [treks1, playerAction, playerNextEvacuationLine]);


    return <div {...props}>
        your next evac: {playerNextEvacuationLine}
        <br />
        <br />
        <button
            css={[{ margin: "0.9vmin 0" }]}
            onClick={() => { setRefreahTrigger(refreahTrigger + 1); }}
            disabled={treksStatus === "pending"}
        >
            <Reload css={{
                height: "1em",
                marginTop: "-0.2em",
            }} />
        </button> known treks:
        <br />
        (lower score is better)
        <br />
        {treksStatus === "pending"
            && <LoaderCircle css={{ height: "8em", margin: "2em" }} />}
        {treksStatus === "rejected"
            && <>
                <ErrorIcon css={{ height: "8em", margin: "2em" }} />
                {treksError.message}
            </>}
        {treks1 && treks1.length === 0 && <>
            <Sparkles css={{ height: "8em", margin: "2em" }} />
        </>}
        <div css={{ overflow: "auto", height: "100%" }}>
            {treks1 && treks1.map(({ trek, sight }, i) => <div
                key={i}
                css={{
                    backgroundColor: i % 2
                        ? "rgb(255, 255, 255, 0.08)"
                        : undefined,
                    color:
                        playerNextEvacuationLine
                            === Math.floor(evacuationLineProgress(sight.maxDepth))
                            ? undefined
                            : "grey",
                }}
            >
                {trek.bytecodeLength} score
                &nbsp;@&nbsp;
                evac #{Math.floor(evacuationLineProgress(sight.maxDepth))}
            </div>)}
        </div>
    </div >;
}
