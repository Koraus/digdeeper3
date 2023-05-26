import { v2 } from "../utils/v";
import { evacuationLineProgress } from "./evacuation";
import update from "immutability-helper";
import { TrekStart, TrekStep, directionVec, caForDropzone, directionEnergyDrain } from "./trek";


export type SightBody = {
    playerPosition: v2,
    playerEnergy: number,
    visitedCells: v2[],
    collectedCells: v2[],
    depth: number,
    lastCrossedEvacuationLine: number,
    log: string,
    ok: boolean,
};

export const neighborhoods = [[
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

export const initSight = ({ dropzone, equipment }: TrekStart): SightBody => ({
    playerPosition: [Math.floor(dropzone.width / 2), 0],
    playerEnergy: 81 * 3,
    visitedCells: [[Math.floor(dropzone.width / 2), 0]],
    collectedCells: neighborhoods[equipment.pickNeighborhoodIndex]
        .map(x => v2.add(x, [Math.floor(dropzone.width / 2), 0]))
        .filter((x) => x[1] >= 0),
    lastCrossedEvacuationLine: 0,
    depth: 0,
    log: "init",
    ok: true,
});

export const applyStep = (
    start: TrekStart,
    prevSight: SightBody,
    trek: TrekStep,
): SightBody => {
    const {
        dropzone, depthLeftBehind, equipment,
    } = start;
    const {
        world, width,
    } = dropzone;
    const {
        stateEnergyDrain, stateEnergyGain,
    } = world;

    const p1 = v2.add(
        prevSight.playerPosition,
        directionVec[trek.action]);

    if (p1[0] < 0 || p1[0] >= width) {
        return update(prevSight, {
            log: { $set: "out of space bounds" },
            ok: { $set: false },
        });
    }

    if (p1[1] < prevSight.depth) {
        return update(prevSight, {
            log: { $set: "cannot return back" },
            ok: { $set: false },
        });
    }

    const isP1Visited = prevSight.visitedCells.some(x => v2.eqStrict(x, p1));
    const ca = caForDropzone(dropzone);
    const caState = caForDropzone(dropzone)._at(p1[1], p1[0]);

    const theStateEnergyDrain = directionEnergyDrain[trek.action];
    const theDirectionEnergyDrain = isP1Visited ? 0 : stateEnergyDrain[caState];
    const moveCost = theStateEnergyDrain + theDirectionEnergyDrain;

    if (prevSight.playerEnergy < moveCost) {
        return update(prevSight, {
            log: {
                $set:
                    `insufficient energy ${moveCost - prevSight.playerEnergy}`,
            },
            ok: { $set: false },
        });
    }

    const stepCollectedCells = neighborhoods[equipment.pickNeighborhoodIndex]
        .map(x => v2.add(x, p1))
        .filter((x) => x[0] >= 0
            && x[0] < width
            && x[1] >= 0
            && !prevSight.collectedCells.some(y => v2.eqStrict(x, y)));



    const energyGain = stepCollectedCells
        .map(([x, t]) => stateEnergyGain[ca._at(t, x)])
        .reduce((a, b) => a + b, 0);
    const energyDelta = energyGain - moveCost;
    const newPlayerEnergy = prevSight.playerEnergy + energyDelta;

    const newVisitedCells = (isP1Visited
        ? prevSight.visitedCells
        : [p1, ...prevSight.visitedCells]
    )

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
        lastCrossedEvacuationLine: Math.max(
            prevSight.lastCrossedEvacuationLine,
            Math.floor(evacuationLineProgress(p1[1]))),
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
