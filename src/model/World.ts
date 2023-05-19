import { version } from "./version";
import { Code, keyProjectCode } from "../ca";
import { calculateComposition } from "../ca/calculateComposition";
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

export const generateRandomWorld = () => {
    const caCode =  {
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
    };

    const composition = calculateComposition(caCode);

    const [stone, grass, energy] = composition
        .map((p, i) => [p, i])
        .sort(([a], [b]) => b - a)
        .map(([_, i]) => i);

    const stateEnergyDrain = [0, 0, 0];
    stateEnergyDrain[stone] = 81 * 9;
    stateEnergyDrain[grass] = 1;
    stateEnergyDrain[energy] = 0;

    const stateEnergyGain = [0, 0, 0];
    stateEnergyGain[stone] = 0;
    stateEnergyGain[grass] = 0;
    stateEnergyGain[energy] = 81;

    return {
        sightVersion: version,
        ca: caCode,
        stateEnergyDrain,
        stateEnergyGain,
        emptyState: stateEnergyGain[grass],
    } as World;

};

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