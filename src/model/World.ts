import { version } from "./version";
import { Code, keyProjectCode } from "../ca";
import { buildFullTransitionLookupTable, version as caVersion } from "../ca";
import { getNumberFromDigits } from "../ca/digits";
import { Dropzone, caForDropzone } from "./terms";


export const caStateCount = 3;
export type CaState = number; // 0 | 1 | 2;

export type World = {
    sightVersion: typeof version,
    ca: Code,
    stateEnergyDrain: [number, number, number],
    stateEnergyGain: [number, number, number],
    emptyState: CaState,
};

export const worldComposition = ({ seed, space, width,
}: {
    width: number, seed: number, space: number,
}) => {

    const generateDropzone = (
        world: World,
    ): Dropzone => ({
        world,
        seed: seed,
        width: width,
        depthLeftBehind: 10,
    });

    const world: World = {
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
    };

    const dropzone = generateDropzone(world);

    const theCa = caForDropzone(dropzone);
    const w = space;
    const h = dropzone.width;

    const state: number[][] = [[], [], []];

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (theCa._at(x, y) === 0) {
                state[0].push(theCa._at(x, y));
            }
            if (theCa._at(x, y) === 1) {
                state[1].push(theCa._at(x, y));
            }
            if (theCa._at(x, y) === 2) {
                state[2].push(theCa._at(x, y));
            }
        }
    }

    const crtState = state.sort((a, b) => a.length - b.length);
    const stateLength = state.flat().length + 1;

    const composition = {
        stone: {
            value: crtState[2][0],
            percentage: Math.round(
                ((crtState[2].length + 1) / stateLength * 100) * 10) / 10,
            drain: 81 * 9,
            gain: 0,
        },
        grass: {
            value: crtState[1][0],
            percentage: Math.round(
                ((crtState[1].length + 1) / stateLength * 100) * 10) / 10,
            drain: 1,
            gain: 0,
        },

        energy: {
            value: crtState[0][0],
            percentage: Math.round(
                ((crtState[0].length + 1) / stateLength * 100) * 10) / 10,
            drain: 0,
            gain: 81,
        },
    };

    world.stateEnergyDrain[composition.stone.value] = 81 * 9;
    world.stateEnergyDrain[composition.grass.value] = 1;
    world.stateEnergyDrain[composition.energy.value] = 0;
    world.stateEnergyGain[composition.stone.value] = 0;
    world.stateEnergyGain[composition.grass.value] = 0;
    world.stateEnergyGain[composition.energy.value] = 81;

    return world;

};

export const generateRandomWorld = (): World => {

    // return {
    //     sightVersion: version,
    //     ca: {
    //         version: caVersion,
    //         stateCount: caStateCount,
    //         rule: (() => {
    //             return getNumberFromDigits(
    //                 buildFullTransitionLookupTable(
    //                     caStateCount,
    //                     () => Math.floor(Math.random() * caStateCount)),
    //                 caStateCount,
    //             ).toString();
    //         })(),
    //     },
    //     stateEnergyDrain: [81 * 9, 1, 0],
    //     stateEnergyGain: [0, 0, 81],
    //     emptyState: 1,
    // };
    return worldComposition({ width: 51, seed: 1438499315, space: 31 });
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