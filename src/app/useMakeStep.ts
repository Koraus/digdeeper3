import { useRecoilState, useRecoilValue } from "recoil";
import { instructionIndices } from "../model/terms/PackedTrek";
import { packTrekChain } from "./packTrekChain";
import { submitTrek } from "./submitTrek";
import { evacuationLineProgress, isEvacuationLineCrossed } from "../model/evacuation";
import { playerActionRecoil, rawSightAt, sightAt, startForTrek } from "./playerActionRecoil";
import { useRegisterXp } from "./levelProgressRecoil";
import { saveTrek } from "../copilot/saver";
import { track } from "@amplitude/analytics-browser";
import { optOutSubmissionRecoil } from "./optOutSubmissionRecoil";
import { keyProjectDrop } from "../model/terms/Drop";


export function useMakeStep() {
    const [playerAction, setPlayerAction] = useRecoilState(playerActionRecoil);
    const optOutSubmission = useRecoilValue(optOutSubmissionRecoil);
    const addXp = useRegisterXp();
    return (
        instruction: keyof typeof instructionIndices,
        copiloted = false,
    ) => {
        const { trek } = playerAction;
        const sight = sightAt(trek);

        const nextTrek = { prev: trek, instruction };
        const [nextSight, log] = rawSightAt(nextTrek);

        if (!nextSight) {
            setPlayerAction({
                action: {
                    action: "step",
                    copiloted,
                    instruction,
                },
                ok: false,
                log,
                trek,
            });
            return;
        }

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

        setPlayerAction({
            action: {
                action: "step",
                copiloted,
                instruction,
            },
            ok: true,
            log: undefined,
            trek: nextTrek,
        });
    };
}
