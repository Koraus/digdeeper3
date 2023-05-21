import { getNumberFromDigits } from "./digits";
import { buildFullTransitionLookupTable, version } from ".";


export const generateRandomRule = (
    stateCount: number,
    random = Math.random,
) => ({
    version,
    stateCount,
    rule: getNumberFromDigits(
        buildFullTransitionLookupTable(
            stateCount,
            () => Math.floor(random() * stateCount)),
        stateCount,
    ).toString(),
});