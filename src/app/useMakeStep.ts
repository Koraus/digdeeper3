import { useRecoilState, useRecoilValue } from "recoil";
import { instructionIndices } from "../model/terms/PackedTrek";
import { packTrekChain } from "./packTrekChain";
import { submitTrek } from "./submitTrek";
import { evacuationLineProgress, isEvacuationLineCrossed } from "../model/evacuation";
import { trekRecoil, rawSightAt, sightAt, startForTrek } from "./trekRecoil";
import { useRegisterXp } from "./levelProgressRecoil";
import { saveTrek } from "../copilot/saver";
import { track } from "@amplitude/analytics-browser";
import { optOutSubmissionRecoil } from "./optOutSubmissionRecoil";
import { keyProjectDrop } from "../model/terms/Drop";


export function useMakeStep() {
    const [trek, setTrek] = useRecoilState(trekRecoil);
    const optOutSubmission = useRecoilValue(optOutSubmissionRecoil);
    const addXp = useRegisterXp();
    return (instruction: keyof typeof instructionIndices) => {
        const _sight = rawSightAt(trek);

        const nextTrek = !("prev" in trek) || _sight[0]
            ? { prev: trek, instruction }
            : { ...trek, instruction };

        const sight = sightAt(trek);
        const nextSight = sightAt(nextTrek);

        if (isEvacuationLineCrossed(sight.maxDepth, nextSight.maxDepth)) {
            if (!optOutSubmission) {
                submitTrek(packTrekChain(nextTrek)); //no await
            }
            saveTrek(packTrekChain(trek)); // copilot
            track("evacuation", {
                drop: startForTrek(trek),
                line: Math.floor(evacuationLineProgress(nextSight.maxDepth)),
            });
            addXp(1, JSON.stringify({
                drop: keyProjectDrop(startForTrek(trek)),
                line: Math.floor(evacuationLineProgress(nextSight.maxDepth)),
            }));
        }
        setTrek(nextTrek);
    };
}
