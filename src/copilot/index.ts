import { Dropzone } from "../model/terms/Dropzone";
import { World, keyProjectWorld } from "../model/terms/World";
import { TrekChain } from "../model/trekChain";
import { sightAt, startForTrek } from "../model/sightChain";
import { applyStep, caForDropzone, initSight, SightBody } from "../model/sight";
import { v2 } from "../utils/v";
import memoize from "memoizee";
import { loadPackedTreks } from "./saver";
import { PackedTrek, getInstructionAt, instructionIndices, instructions } from "../model/terms/PackedTrek";
import { _never } from "../utils/_never";


const offerVersion = "digdeeper3/copilot/offer@14";

const windowLengths = [6, 5, 4, 3];
const neighborhoods = [[
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 0], [0, 1],
    [1, -1], [1, 0], [1, 1],
], [
    [-1, 0],
    [0, -1], [0, 0], [0, 1],
    [1, 0],
], [
    [0, 0],
]] as v2[][];

type LeafMap = Record<
    string, // reduced state
    [number, number, number, number] // action weights
>;
type AccumulatedMap = LeafMap[];

function saveAccumulatedMap(
    world: World,
    map: AccumulatedMap,
    accumulatedOverTrekCount: number,
) {
    const key = JSON.stringify({
        offerVersion,
        world: keyProjectWorld(world),
        key: "map",
    });
    localStorage.setItem(key, JSON.stringify({
        accumulatedOverTrekCount,
        map,
    }));
    mapForWorld.clear(world);
}

function loadAccumulatedMap(
    world: World,
): {
    map: AccumulatedMap | undefined,
    accumulatedOverTrekCount: number,
} {
    const key = JSON.stringify({
        offerVersion,
        world: keyProjectWorld(world),
        key: "map",
    });
    const str = localStorage.getItem(key);
    if (!str) {
        return {
            map: undefined,
            accumulatedOverTrekCount: 0,
        };
    }
    return JSON.parse(str);
}


const getLeafIndex = (
    windowLengthIndex: number,
    neighborhoodIndex: number,
) => {
    return windowLengthIndex * neighborhoods.length
        + neighborhoodIndex;
};

const getCell = (
    dropzone: Dropzone,
    sight: SightBody,
    t: number,
    x: number,
) => {
    const stateCount = dropzone.world.ca.stateCount;
    const ca = caForDropzone(dropzone);
    if (t < sight.depth) { return stateCount + 1; }
    if (x < 0 || x >= dropzone.width) { return stateCount + 1; }
    const isEmpty = sight.visitedCells
        .some(([_t, _x]) => _t === t && _x === x);
    if (isEmpty) { return stateCount + 0; }
    return ca._at(t, x);
};

const getReducedNeighborhoodState = (
    dropzone: Dropzone,
    sight: SightBody,
    neighborhood: v2[],
) => {
    const stateCount = dropzone.world.ca.stateCount;

    const sc = stateCount
        + 1 // for empty (visited)
        + 1; // for out of bounds
    let s = 0;
    for (let i = 0; i < neighborhood.length; i++) {
        const [dx, dt] = neighborhood[i];
        s *= sc;
        s += getCell(
            dropzone,
            sight,
            sight.playerPosition[1] + dt,
            sight.playerPosition[0] + dx);
    }
    return s;
};

const getReducedState = (
    dropzone: Dropzone,
    treksSteps: TrekChain[],
    windowLength: number,
    neighborhood: v2[],
) => JSON.stringify(
    treksSteps
        .slice(-windowLength)
        .map(trek => {
            if (!("prev" in trek)) { return; }
            const sight = sightAt(trek);
            const rns = getReducedNeighborhoodState(
                dropzone, sight, neighborhood);
            return rns * (instructions.length + 1)
                + instructionIndices[trek.instruction];
        }),
);

export const processTrek = (
    map: LeafMap,
    packedTrek: PackedTrek,
    windowLength: number,
    neighborhood: v2[],
) => {
    let sight = initSight(packedTrek.drop);

    const rns = getReducedNeighborhoodState(
        packedTrek.drop.zone, sight, neighborhood);
    const states = [rns * (instructions.length + 1) + instructions.length];
    for (let i = 0; i < packedTrek.bytecodeLength; i++) {
        const instruction = getInstructionAt(packedTrek, i);
        if (states.length >= windowLength) {
            const key = JSON.stringify(states);
            const mapActions = map[key] ?? (map[key] = [0, 0, 0, 0]);
            for (let ai = 0; ai < instructions.length; ai++) {
                mapActions[ai] *= 0.95;
                if (ai === instruction) {
                    mapActions[ai] += 1;
                }
            }
        }

        const _sight = applyStep(packedTrek.drop, sight, instruction)[0];
        if (!_sight) { return _never(); }
        sight = _sight;

        const rns = getReducedNeighborhoodState(
            packedTrek.drop.zone, sight, neighborhood);
        states.push(rns * (instructions.length + 1) + instruction);
        states.splice(0, states.length - windowLength);
    }

    return states;
};

const mapForWorld = memoize((world: World) => {
    const { map: _map, accumulatedOverTrekCount } =
        loadAccumulatedMap(world);

    const map = _map ?? [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

    const treks = loadPackedTreks(world);
    for (let i = accumulatedOverTrekCount; i < treks.length; i++) {
        for (let wi = 0; wi < windowLengths.length; wi++) {
            for (let ni = 0; ni < neighborhoods.length; ni++) {
                processTrek(
                    map[getLeafIndex(wi, ni)],
                    treks[i],
                    windowLengths[wi],
                    neighborhoods[ni]);
            }
        }
    }

    if (treks.length > accumulatedOverTrekCount) {
        saveAccumulatedMap(world, map, treks.length);
    }

    return map;
});

// function mergeX(
//     a: [number, number, number, number] | undefined,
//     b: [number, number, number, number] | undefined,
// ) {
//     if (!a) { return b; }
//     if (!b) { return a; }
//     const sum = b[0] + b[1] + b[2] + b[3];
//     const f = Math.pow(0.95, sum);
//     return [
//         a[0] * f + b[0],
//         a[1] * f + b[1],
//         a[2] * f + b[2],
//         a[3] * f + b[3],
//     ] as [number, number, number, number];
// }

export const offer = (trek: TrekChain) => {
    const dropzone = startForTrek(trek).zone;
    const loadedMap = mapForWorld(dropzone.world);

    const treks = [trek];
    const maxWindowLength = Math.max(...windowLengths);
    while (treks.length < maxWindowLength && "prev" in trek) {
        treks.unshift(trek = trek.prev);
    }

    for (let ni = 0; ni < neighborhoods.length; ni++) {
        for (let wi = 0; wi < windowLengths.length; wi++) {
            const key = getReducedState(
                dropzone,
                treks,
                windowLengths[wi],
                neighborhoods[ni]);
            const value = loadedMap[getLeafIndex(wi, ni)][key];
            if (value) { return value; }
        }
    }
};
