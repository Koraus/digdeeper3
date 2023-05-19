import { version } from "./version";
import { Code, keyProjectCode } from "../ca";
import { ca } from "./ca";
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

export function calculateCaComposition({
    ca: caCode,
    spaceSize,
    timeSize,
    seed,
}: {
    ca: Code;
    spaceSize: number;
    timeSize: number;
    seed: number;
}) {
    const theCa = ca({
        ca: caCode,
        spaceSize,
        emptyState: 1,
        seed,
    });

    const compostion = [0, 0, 0];
    for (let x = 1; x < spaceSize - 1; x++) {
        for (let t = 3; t < timeSize + 3; t++) {
            compostion[theCa._at(t, x)]++;
        }
    }
    const sum = compostion.reduce((a, b) => a + b, 0);
    return compostion.map((v) => v / sum);
}

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

    const composition = calculateCaComposition({
        ca: caCode,
        spaceSize: 31,
        timeSize: 51,
        seed: 4242,
    });

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