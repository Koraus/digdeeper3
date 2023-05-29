import { SightBody, applyStep, initSight } from "./sight";
import memoize from "memoizee";
import { TrekChain } from "./trekChain";
import { instructionIndices } from "./terms/PackedTrek";
import { Drop } from "./terms/Drop";


export function _startForTrek(trek: TrekChain): Drop {
    if (!("prev" in trek)) { return trek; }
    return startForTrek(trek.prev);
}
export const startForTrek = memoize(_startForTrek);


export type Sight = SightBody & { trek: TrekChain };

function getLastOkSight(sight: Sight): Sight {
    if (sight.ok) { return sight; }
    if ("prev" in sight.trek) {
        return getLastOkSight(sightAt(sight.trek.prev));
    }
    return sight; // init sight is always ok
}


export const sightAt = memoize((trek: TrekChain): Sight => {
    let sight;
    if (!("prev" in trek)) {
        sight = initSight(trek);
    } else {
        const prevSight = getLastOkSight(sightAt(trek.prev));
        sight = applyStep(
            startForTrek(trek),
            prevSight,
            instructionIndices[trek.instruction]);
    }

    return { ...sight, trek };
});