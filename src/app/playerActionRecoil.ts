import { atom } from "recoil";
import { version as sightVersion } from "../model/version";
import { generateRandomDropzone } from "../model/generate";
import { devChoiceWorlds } from "./basecamp/DevChoiceWorlds";
import { Instruction } from "../model/terms/PackedTrek";
import { Drop } from "../model/terms/Drop";
import { SightBody, applyStep, initSight } from "../model/sight";
import memoize from "memoizee";
import { _never } from "../utils/_never";

export type TrekChain =
    Drop
    | {
        instruction: Instruction,
        prev: TrekChain,
    };

export const playerActionRecoil = atom<{
    action: undefined | {
        action: "step",
        copiloted: boolean,
        instruction: Instruction,
    } | {
        action: "undo",
    },
    ok: boolean,
    log: undefined | string,
    trek: TrekChain,
}>({
    key: "playerAction",

    // this would be reset immediately
    default: {
        action: undefined,
        ok: true,
        log: undefined,
        trek: {
            v: sightVersion,
            zone: generateRandomDropzone({
                world: devChoiceWorlds[0],
            }),
            equipment: {
                pickNeighborhoodLevel: 0,
                knightMoveLevel: 0,
            },
            depthLeftBehind: 10,
        },
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
                trek.instruction,
                true));

export const sightAt = (trek: TrekChain): SightBody =>
    rawSightAt(trek)[0]
    ?? _never("In TrekChain, sight is guaranteed to exist");
