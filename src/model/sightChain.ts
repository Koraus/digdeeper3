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


export type Sight = SightBody & {
    trek: TrekChain,
    ok: boolean,
    log: string,
};

function getLastOkSight(sight: Sight): Sight {
    if (sight.ok) { return sight; }
    if ("prev" in sight.trek) {
        return getLastOkSight(sightAt(sight.trek.prev));
    }
    return sight; // init sight is always ok
}


export const sightAt = memoize((trek: TrekChain): Sight => {
    if (!("prev" in trek)) {
        const sight = initSight(trek);
        return { ...sight, trek, ok: true, log: "init" };
    }

    const prevSight = getLastOkSight(sightAt(trek.prev));
    const [sight, log] = applyStep(
        startForTrek(trek),
        prevSight,
        instructionIndices[trek.instruction],
        true);

    return {
        ...(sight ?? prevSight),
        trek,
        ok: sight !== undefined,
        log,
    };
});