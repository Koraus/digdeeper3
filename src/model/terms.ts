import { v2 } from "../utils/v";
import memoize from "memoizee";
import { ca } from "./ca";
import { version as sightVersion } from "./version";
import { Dropzone } from "./Dropzone";


export { sightVersion };

export type MoveAction =
    "forward" // t++
    | "backward" // t--
    | "left" // x--
    | "right"; // x++

export type DropEquipment = {
    pickNeighborhoodIndex: number,
};

export type Drop = {
    dropzone: Dropzone,
    equipment: DropEquipment,
    depthLeftBehind: number,
}

export type TrekStart = Drop;
export type TrekStep = { action: MoveAction };
export type Trek = TrekStart | (TrekStep & { prev: Trek });

export type SightBody = {
    playerPosition: v2,
    playerEnergy: number,
    visitedCells: v2[],
    collectedCells: v2[],
    depth: number,
    log: string,
    ok: boolean,
};

export type Sight = SightBody & { trek: Trek };

/**
 * @deprecated use `startForTrek(trek).dropzone`
 */
export const trekDropzone = (trek: Trek): Dropzone =>
    startForTrek(trek).dropzone;

export function startForTrek(trek: Trek): TrekStart {
    if (!("prev" in trek)) { return trek; }
    return startForTrek(trek.prev);
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
    startFillState: dropzone.startFillState,
    seed: dropzone.seed,
}));

function getLastOkSight(sight: Sight): Sight {
    if (sight.ok) { return sight; }
    if ("prev" in sight.trek) {
        return getLastOkSight(sightAt(sight.trek.prev));
    }
    return sight; // init sight is always ok
}

export const initSight = ({ dropzone, equipment }: TrekStart): SightBody => ({
    playerPosition: [Math.floor(dropzone.width / 2), 0],
    playerEnergy: 81 * 3,
    visitedCells: [[Math.floor(dropzone.width / 2), 0]],
    collectedCells: neighborhoods[equipment.pickNeighborhoodIndex]
        .map(x => v2.add(x, [Math.floor(dropzone.width / 2), 0]))
        .filter((x) => x[1] >= 0),
    depth: 0,
    log: "init",
    ok: true,
});

const neighborhoods = [[
    [0, 0],
], [
    [-1, 0],
    [0, -1], [0, 0], [0, 1],
    [1, 0],
], [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 0], [0, 1],
    [1, -1], [1, 0], [1, 1],
]] as v2[][];

export const applyStep = (
    start: TrekStart,
    prevSight: SightBody,
    trek: TrekStep,
) => {
    const {
        dropzone,
        depthLeftBehind,
        equipment,
    } = start;
    const {
        world,
        width,
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
            collectedCells: prevSight.collectedCells,
            depth: prevSight.depth,
            log: isOutOfSpace ? "out of space bounds" : "cannot return back",
            ok: false,
        };
    }

    const isP1Visited = prevSight.visitedCells.some(x => v2.eqStrict(x, p1));
    const ca = caForDropzone(dropzone);
    const caState = caForDropzone(dropzone)._at(p1[1], p1[0]);

    const theStateEnergyDrain = directionEnergyDrain[trek.action];
    const theDirectionEnergyDrain = isP1Visited ? 0 : stateEnergyDrain[caState];
    const moveCost = theStateEnergyDrain + theDirectionEnergyDrain;

    if (prevSight.playerEnergy < moveCost) {
        return {
            playerPosition: prevSight.playerPosition,
            playerEnergy: prevSight.playerEnergy,
            visitedCells: prevSight.visitedCells,
            collectedCells: prevSight.collectedCells,
            depth: prevSight.depth,
            log: `insufficient energy ${moveCost - prevSight.playerEnergy}`,
            ok: false,
        };
    }

    const stepCollectedCells =
        neighborhoods[equipment.pickNeighborhoodIndex]
            .map(x => v2.add(x, p1))
            .filter((x) =>
                x[0] >= 0
                && x[0] < width
                && x[1] >= 0
                && !prevSight.collectedCells.some(y => v2.eqStrict(x, y)));



    const energyGain = stepCollectedCells
        .map(([x, t]) => stateEnergyGain[ca._at(t, x)])
        .reduce((a, b) => a + b, 0);
    const energyDelta = energyGain - moveCost;
    const newPlayerEnergy = prevSight.playerEnergy + energyDelta;

    const newVisitedCells =
        (isP1Visited ? prevSight.visitedCells : [p1, ...prevSight.visitedCells])

            // 2x depthLeftBehind
            .filter(([, t]) => t >= prevSight.depth - depthLeftBehind);

    const newcCollectedCells = [
        ...stepCollectedCells,
        ...prevSight.collectedCells,
    ]
        .filter(([, t]) => t >= prevSight.depth - depthLeftBehind);



    const newDepth = Math.max(prevSight.depth, p1[1] - depthLeftBehind);

    return {
        playerPosition: p1,
        playerEnergy: newPlayerEnergy,
        visitedCells: newVisitedCells,
        collectedCells: newcCollectedCells,
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
        sight = initSight(trek);
    } else {
        const prevSight = getLastOkSight(sightAt(trek.prev));
        sight = applyStep(startForTrek(trek), prevSight, trek);
    }

    return { ...sight, trek };
});