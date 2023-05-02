import { v2 } from "../utils/v";
import memoize from "memoizee";
import { ca } from "./ca";
import { CaCode } from "../ca";
import { buildFullTransitionLookupTable, version as caVersion } from "../ca";
import { LehmerPrng } from "../utils/LehmerPrng";
import { getNumberFromDigits } from "../ca/digits";


export const sightVersion = "digdeeper3/sight@2";

export const caStateCount = 3;

export type CaState = number; // 0 | 1 | 2;

export type World = {
    sightVersion: typeof sightVersion,
    ca: CaCode,
    stateEnergyDrain: Record<CaState, number>,
    stateEnergyGain: Record<CaState, number>,
    emptyState: CaState,
};

export type Dropzone = {
    world: World,
    seed: number,
    width: number,
    depthLeftBehind: number,
};

export const createRandomDropzone = (): Dropzone => ({
    world: {
        sightVersion,
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
    },
    seed: Math.floor(Math.random() * LehmerPrng.MAX_INT32),
    width: 31,
    depthLeftBehind: 10,
});

export const eqStringify = (a: unknown, b: unknown) =>
    JSON.stringify(a) === JSON.stringify(b);

export const eqDropzone = (a: Dropzone, b: Dropzone) => eqStringify(a, b);

export type MoveAction =
    "forward" // t++
    | "backward" // t--
    | "left" // x--
    | "right"; // x++

export type InitTrek = { dropzone: Dropzone };
export type ActionTrekStep = { prev: Trek, action: MoveAction };
export type Trek = InitTrek | ActionTrekStep;

export type Sight = {
    trek: Trek,
    playerPosition: v2,
    playerEnergy: number,
    emptyCells: v2[],
    depth: number,
    log: string,
    ok: boolean,
}

export function trekDropzone(trek: Trek): Dropzone {
    if (!("prev" in trek)) { return trek.dropzone; }
    return trekDropzone(trek.prev);
}

export const directionEnergyDrain = {
    left: 1,
    right: 1,
    backward: 9,
    forward: 0,
} as const;
export const directionVec = {
    left: [-1, 0],
    right: [1, 0],
    backward: [0, -1],
    forward: [0, 1],
} as const;

export const caForDropzone = memoize((dropzone: Dropzone) => ca({
    ca: dropzone.world.ca,
    spaceSize: dropzone.width,
    emptyState: dropzone.world.emptyState,
    seed: dropzone.seed,
}));

function getLastOkSight(sight: Sight): Sight {
    if (sight.ok) { return sight; }
    if ("prev" in sight.trek) {
        return getLastOkSight(sightAt(sight.trek.prev));
    }
    return sight; // init sight is always ok
}

export const sightAt = memoize((trek: Trek): Sight => {
    if (!("prev" in trek)) {
        return {
            trek,
            playerPosition: [Math.floor(trek.dropzone.width / 2), 0],
            playerEnergy: 81 * 3,
            emptyCells: [],
            depth: 0,
            log: "init",
            ok: true,
        };
    }


    const prevSight = getLastOkSight(sightAt(trek.prev));

    const dropzone = trekDropzone(trek);
    const {
        world,
        width,
        depthLeftBehind,
    } = dropzone;
    const {
        stateEnergyDrain,
        stateEnergyGain,
    } = world;

    const p1 = v2.add(
        prevSight.playerPosition,
        directionVec[trek.action]);

    const isOutOfSpace = p1[0] < 0 || p1[0] >= width;
    const isOutOfGoBack = p1[1] < prevSight.depth;

    if (isOutOfSpace || isOutOfGoBack) {
        return {
            trek,
            playerPosition: prevSight.playerPosition,
            playerEnergy: prevSight.playerEnergy,
            emptyCells: prevSight.emptyCells,
            depth: prevSight.depth,
            log: isOutOfSpace ? "out of space bounds" : "cannot return back",
            ok: false,
        };
    }

    const isEmptyAtP1 = prevSight.emptyCells.some(x => v2.eqStrict(x, p1));
    const caState = caForDropzone(dropzone)._at(p1[1], p1[0]);

    const theStateEnergyDrain = directionEnergyDrain[trek.action];
    const theDirectionEnergyDrain = isEmptyAtP1 ? 0 : stateEnergyDrain[caState];
    const moveCost = theStateEnergyDrain + theDirectionEnergyDrain;

    if (prevSight.playerEnergy < moveCost) {
        return {
            trek,
            playerPosition: prevSight.playerPosition,
            playerEnergy: prevSight.playerEnergy,
            emptyCells: prevSight.emptyCells,
            depth: prevSight.depth,
            log: `insufficient energy ${moveCost - prevSight.playerEnergy}`,
            ok: false,
        };
    }

    const energyGain = isEmptyAtP1 ? 0 : stateEnergyGain[caState];
    const energyDelta = energyGain - moveCost;
    const newPlayerEnergy = prevSight.playerEnergy + energyDelta;

    const newEmptyCells = isEmptyAtP1
        ? prevSight.emptyCells
        : [p1, ...prevSight.emptyCells];

    const newDepth = Math.max(prevSight.depth, p1[1] - depthLeftBehind);

    return {
        trek,
        playerPosition: p1,
        playerEnergy: newPlayerEnergy,
        emptyCells: newEmptyCells,
        depth: newDepth,
        log: `delta ${energyGain - moveCost}:`
            + ((theDirectionEnergyDrain > 0)
                ? ` move ${-theDirectionEnergyDrain}`
                : "")
            + ((theStateEnergyDrain > 0)
                ? ` ruin ${-theStateEnergyDrain}`
                : "")
            + ((energyGain > 0)
                ? ` gain ${energyGain}`
                : ""),
        ok: true,
    };
});