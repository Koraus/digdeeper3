import { v2 } from "../utils/v";
import memoize from "memoizee";
import { ca } from "./ca";
import { LehmerPrng } from "../utils/LehmerPrng";
import { version as sightVersion } from "./version";
import { World, generateRandomWorld } from "./World";


export { sightVersion };

export type Dropzone = {
    world: World,
    seed: number,
    width: number,
    depthLeftBehind: number,
};

export const generateRandomDropzone = (
    world: World = generateRandomWorld(),
): Dropzone => ({
    world,
    seed: Math.floor(Math.random() * LehmerPrng.MAX_INT32),
    width: 31,
    depthLeftBehind: 10,
});

export const eqStringify = <T>(a: T, b: T) =>
    JSON.stringify(a) === JSON.stringify(b);

export const eqDropzone = eqStringify<Dropzone>;

export type MoveAction =
    "forward" // t++
    | "backward" // t--
    | "left" // x--
    | "right"; // x++

export type TrekStep = { action: MoveAction };
export type Trek = { dropzone: Dropzone } | (TrekStep & { prev: Trek });

export type SightBody = {
    playerPosition: v2,
    playerEnergy: number,
    visitedCells: v2[],
    depth: number,
    log: string,
    ok: boolean,
};

export type Sight = SightBody & { trek: Trek };

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

export const initSight = (dropzone: Dropzone): SightBody => ({
    playerPosition: [Math.floor(dropzone.width / 2), 0],
    playerEnergy: 81 * 3,
    visitedCells: [[Math.floor(dropzone.width / 2), 0]],
    depth: 0,
    log: "init",
    ok: true,
});

export const applyStep = (
    dropzone: Dropzone,
    prevSight: SightBody,
    trek: TrekStep,
) => {
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
            playerPosition: prevSight.playerPosition,
            playerEnergy: prevSight.playerEnergy,
            visitedCells: prevSight.visitedCells,
            depth: prevSight.depth,
            log: isOutOfSpace ? "out of space bounds" : "cannot return back",
            ok: false,
        };
    }

    const isP1Visited = prevSight.visitedCells.some(x => v2.eqStrict(x, p1));
    const caState = caForDropzone(dropzone)._at(p1[1], p1[0]);

    const theStateEnergyDrain = directionEnergyDrain[trek.action];
    const theDirectionEnergyDrain = isP1Visited ? 0 : stateEnergyDrain[caState];
    const moveCost = theStateEnergyDrain + theDirectionEnergyDrain;

    if (prevSight.playerEnergy < moveCost) {
        return {
            playerPosition: prevSight.playerPosition,
            playerEnergy: prevSight.playerEnergy,
            visitedCells: prevSight.visitedCells,
            depth: prevSight.depth,
            log: `insufficient energy ${moveCost - prevSight.playerEnergy}`,
            ok: false,
        };
    }

    const energyGain = isP1Visited ? 0 : stateEnergyGain[caState];
    const energyDelta = energyGain - moveCost;
    const newPlayerEnergy = prevSight.playerEnergy + energyDelta;

    const newVisitedCells =
        (isP1Visited ? prevSight.visitedCells : [p1, ...prevSight.visitedCells])

            // 2x depthLeftBehind
            .filter(([, t]) => t >= prevSight.depth - depthLeftBehind);


    const newDepth = Math.max(prevSight.depth, p1[1] - depthLeftBehind);

    return {
        playerPosition: p1,
        playerEnergy: newPlayerEnergy,
        visitedCells: newVisitedCells,
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
};

export const sightAt = memoize((trek: Trek): Sight => {
    let sight;
    if (!("prev" in trek)) {
        sight = initSight(trek.dropzone);
    } else {
        const prevSight = getLastOkSight(sightAt(trek.prev));
        const dropzone = trekDropzone(trek);
        sight = applyStep(dropzone, prevSight, trek);
    }

    return { ...sight, trek };
});