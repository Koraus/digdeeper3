import { v2 } from "../utils/v";
import { evacuationLineProgress } from "./evacuation";
import memoize from "memoizee";
import { ca } from "./ca";
import { Dropzone } from "./terms/Dropzone";
import { Drop } from "./terms/Drop";
import { InstructionIndex, instructionIndices } from "./terms/PackedTrek";

export const caForDropzone = memoize((dropzone: Dropzone) => ca({
    ca: dropzone.world.ca,
    spaceSize: dropzone.width,
    startFillState: dropzone.startFillState,
    seed: dropzone.seed,
}));

export const directionEnergyDrain = {
    [instructionIndices.left]: 1,
    [instructionIndices.right]: 1,
    [instructionIndices.backward]: 9,
    [instructionIndices.forward]: 0,
} as const;
export const directionVec = {
    [instructionIndices.left]: [-1, 0],
    [instructionIndices.right]: [1, 0],
    [instructionIndices.backward]: [0, -1],
    [instructionIndices.forward]: [0, 1],
} as const;

export type SightBody = {
    playerPosition: v2,
    playerEnergy: number,
    visitedCells: v2[],
    collectedCells: v2[],
    depth: number,
    lastCrossedEvacuationLine: number,
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

export const initSight = ({
    zone,
    equipment,
}: Drop): SightBody => ({
    playerPosition: [Math.floor(zone.width / 2), 0],
    playerEnergy: 81 * 3,
    visitedCells: [[Math.floor(zone.width / 2), 0]],
    collectedCells: neighborhoods[equipment.pickNeighborhoodIndex]
        .map(x => v2.add(x, [Math.floor(zone.width / 2), 0]))
        .filter((x) => x[1] >= 0),
    lastCrossedEvacuationLine: 0,
    depth: 0,
});

export function applyStep(
    start: Drop,
    prevSight: SightBody,
    instruction: InstructionIndex,
    verbose?: false,
): [SightBody, undefined] | [undefined, string];
export function applyStep(
    start: Drop,
    prevSight: SightBody,
    instruction: InstructionIndex,
    verbose: true,
): [SightBody, string] | [undefined, string];
export function applyStep(
    start: Drop,
    prevSight: SightBody,
    instruction: InstructionIndex,
    verbose = false,
): [SightBody, string | undefined] | [undefined, string] {
    const {
        zone: dropzone, depthLeftBehind, equipment,
    } = start;
    const {
        world, width,
    } = dropzone;
    const {
        stateEnergyDrain, stateEnergyGain,
    } = world;

    const p1 = v2.add(
        prevSight.playerPosition,
        directionVec[instruction]);

    if (p1[0] < 0 || p1[0] >= width) {
        return [undefined, "out of space bounds"];
    }

    if (p1[1] < prevSight.depth) {
        return [undefined, "cannot return back"];
    }

    const isP1Visited = prevSight.visitedCells.some(x => v2.eqStrict(x, p1));
    const ca = caForDropzone(dropzone);
    const caState = caForDropzone(dropzone)._at(p1[1], p1[0]);

    const theStateEnergyDrain = directionEnergyDrain[instruction];
    const theDirectionEnergyDrain = isP1Visited ? 0 : stateEnergyDrain[caState];
    const moveCost = theStateEnergyDrain + theDirectionEnergyDrain;

    if (prevSight.playerEnergy < moveCost) {
        return [
            undefined,
            `insufficient energy ${moveCost - prevSight.playerEnergy}`,
        ];
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
    const log = verbose
        ? `delta ${energyGain - moveCost}:`
        + ((theDirectionEnergyDrain > 0)
            ? ` move ${-theDirectionEnergyDrain}`
            : "")
        + ((theStateEnergyDrain > 0)
            ? ` ruin ${-theStateEnergyDrain}`
            : "")
        + ((energyGain > 0)
            ? ` gain ${energyGain}`
            : "")
        : undefined;

    return [
        {
            playerPosition: p1,
            playerEnergy: newPlayerEnergy,
            visitedCells: newVisitedCells,
            collectedCells: newcCollectedCells,
            depth: newDepth,
            lastCrossedEvacuationLine: Math.max(
                prevSight.lastCrossedEvacuationLine,
                Math.floor(evacuationLineProgress(p1[1]))),
        },
        log,
    ];
}
