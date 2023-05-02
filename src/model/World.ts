import { version } from "./version";
import { Code, keyProjectCode } from "../ca";
import { buildFullTransitionLookupTable, version as caVersion } from "../ca";
import { getNumberFromDigits } from "../ca/digits";


export const caStateCount = 3;
export type CaState = number; // 0 | 1 | 2;

export type World = {
    sightVersion: typeof version,
    ca: Code,
    stateEnergyDrain: [number, number, number],
    stateEnergyGain: [number, number, number],
    emptyState: CaState,
};

export const generateRandomWorld = (): World => ({
    sightVersion: version,
    ca: {
        version: caVersion,
        stateCount: caStateCount,
        rule: (() => {
            return getNumberFromDigits(
                buildFullTransitionLookupTable(
                    caStateCount,
                    () => Math.floor(Math.random() * caStateCount)),
                caStateCount,
            ).toString();
        })(),
    },
    stateEnergyDrain: [81 * 9, 1, 0],
    stateEnergyGain: [0, 0, 81],
    emptyState: 1,
});

export const keyProjectWorld = ({
    sightVersion, ca, stateEnergyDrain, stateEnergyGain, emptyState,
}: World) => ({
    sightVersion,
    ca: keyProjectCode(ca),
    stateEnergyDrain: stateEnergyDrain.slice(0, ca.stateCount),
    stateEnergyGain: stateEnergyGain.slice(0, ca.stateCount),
    emptyState,
});

export const keyifyWorld = (world: World) =>
    JSON.stringify(keyProjectWorld(world));