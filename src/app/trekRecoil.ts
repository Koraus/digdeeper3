import { atom, useRecoilState } from "recoil";
import { version as sightVersion } from "../model/version";
import { generateRandomDropzone } from "../model/generate";
import { devChoiceWorlds } from "./basecamp/DevChoiceWorlds";
import { instructionIndices } from "../model/terms/PackedTrek";
import { packTrekChain } from "./packTrekChain";
import { submitTrek } from "./submitTrek";
import { isEvacuationLineCrossed } from "../model/evacuation";
import { Drop } from "../model/terms/Drop";
import { SightBody, applyStep, initSight } from "../model/sight";
import memoize from "memoizee";
import { _never } from "../utils/_never";

export type TrekChain =
    Drop
    | {
        instruction: keyof typeof instructionIndices,
        prev: TrekChain,
    };

export const trekRecoil = atom<TrekChain>({
    key: "trek",
    default: {
        v: sightVersion,
        zone: generateRandomDropzone({
            world: devChoiceWorlds[0],
        }),
        equipment: {
            pickNeighborhoodIndex: 0,
        },
        depthLeftBehind: 10,
    },
});

export const startForTrek = memoize((trek: TrekChain): Drop =>
    ("prev" in trek) ? startForTrek(trek.prev) : trek);


export const rawSightAt = memoize(
    (trek: TrekChain): ReturnType<typeof applyStep> =>
        !("prev" in trek)
            ? [initSight(trek), "init"]
            : applyStep(
                startForTrek(trek),
                sightAt(trek.prev),
                instructionIndices[trek.instruction],
                true));

export const sightAt = (trek: TrekChain): SightBody =>
    rawSightAt(trek)[0]
    ?? (("prev" in trek)
        ? sightAt(trek.prev)
        : _never(
            "prev should always exist"
            + " when sightAt(trek)[0] happenes to be undefined"));


export function useMakeStep() {
    const [trek, setTrek] = useRecoilState(trekRecoil);
    return (instruction: keyof typeof instructionIndices) => {
        const _sight = rawSightAt(trek);

        const nextTrek =
            !("prev" in trek) || _sight[0]
                ? { prev: trek, instruction }
                : { ...trek, instruction };

        const sight = sightAt(trek);
        const nextSight = sightAt(nextTrek);

        if (isEvacuationLineCrossed(sight.maxDepth, nextSight.maxDepth)) {
            submitTrek(packTrekChain(nextTrek)); //no await
        }
        setTrek(nextTrek);
    };
}