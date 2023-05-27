import { SightBody, applyStep, initSight } from "./sight";
import memoize from "memoizee";
import { Trek, TrekStart } from "./trek";


export function _startForTrek(trek: Trek): TrekStart {
    if (!("prev" in trek)) { return trek; }
    return startForTrek(trek.prev);
}
export const startForTrek = memoize(_startForTrek);


export type Sight = SightBody & { trek: Trek };

function getLastOkSight(sight: Sight): Sight {
    if (sight.ok) { return sight; }
    if ("prev" in sight.trek) {
        return getLastOkSight(sightAt(sight.trek.prev));
    }
    return sight; // init sight is always ok
}


export const sightAt = memoize((trek: Trek): Sight => {
    let sight;
    if (!("prev" in trek)) {
        sight = initSight(trek);
    } else {
        const prevSight = getLastOkSight(sightAt(trek.prev));
        sight = applyStep(startForTrek(trek), prevSight, trek);
    }

    return { ...sight, trek };
});