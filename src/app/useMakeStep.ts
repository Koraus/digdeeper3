import { useRecoilState } from "recoil";
import { instructionIndices } from "../model/terms/PackedTrek";
import { packTrekChain } from "./packTrekChain";
import { submitTrek } from "./submitTrek";
import { isEvacuationLineCrossed } from "../model/evacuation";
import { trekRecoil, rawSightAt, sightAt } from "./trekRecoil";
import { useRegisterXp } from "./playerProgressionRecoil";
import { saveTrek } from "../copilot/saver";


export function useMakeStep() {
    const [trek, setTrek] = useRecoilState(trekRecoil);
    const addXp = useRegisterXp();
    return (instruction: keyof typeof instructionIndices) => {
        const _sight = rawSightAt(trek);

        const nextTrek = !("prev" in trek) || _sight[0]
            ? { prev: trek, instruction }
            : { ...trek, instruction };

        const sight = sightAt(trek);
        const nextSight = sightAt(nextTrek);

        if (isEvacuationLineCrossed(sight.maxDepth, nextSight.maxDepth)) {
            submitTrek(packTrekChain(nextTrek)); //no await
            saveTrek(packTrekChain(trek)); // copilot
            addXp(1);
        }
        setTrek(nextTrek);
    };
}
