import { v2 } from "../utils/v";
import memoize from "memoizee";
import { ca } from "./ca";

export const modelId = "digdeeper3@1";

export const caStateCount = 3;

export type CaState = number; // 0 | 1 | 2;

export type Problem = {
    modelId: typeof modelId,
    caStateCount: typeof caStateCount,
    table: CaState[],
    seed: number,
    stateEnergyDrain: Record<CaState, number>,
    stateEnergyGain: Record<CaState, number>,
    emptyState: CaState,
    spaceSize: number,
    depthLeftBehind: number,
}

export type MoveAction =
    "forward" // t++
    | "backward" // t--
    | "left" // x--
    | "right"; // x++

export type Progression = {
    problem: Problem,
} | {
    prev: Progression,
    action: MoveAction,
}

export type World = {
    progression: Progression,
    playerPosition: v2,
    playerEnergy: number,
    emptyCells: v2[],
    depth: number,
    log: string,
    ok: boolean,
}

export function progressionProblem(progression: Progression): Problem {
    if (!("prev" in progression)) { return progression.problem; }
    return progressionProblem(progression.prev);
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

export const caForProblem = memoize((problem: Problem) => ca({
    stateCount: caStateCount,
    spaceSize: problem.spaceSize,
    table: problem.table,
    emptyState: problem.emptyState,
    seed: problem.seed,
}));

function getLastOkWorld(world: World): World {
    if (world.ok) { return world; }
    if ("prev" in world.progression) {
        return getLastOkWorld(worldAt(world.progression.prev));
    }
    return world; // init world is always ok
}

export function worldAt(progression: Progression): World {
    if (!("prev" in progression)) {
        return {
            progression: progression,
            playerPosition: [0, 0],
            playerEnergy: 81 * 3,
            emptyCells: [],
            depth: 0,
            log: "init",
            ok: true,
        };
    }

    const prevWorld = getLastOkWorld(worldAt(progression.prev));

    const problem = progressionProblem(progression);
    const {
        spaceSize,
        stateEnergyDrain,
        stateEnergyGain,
        depthLeftBehind: depathLeftBehind,
    } = problem;

    const p1 = v2.add(
        prevWorld.playerPosition,
        directionVec[progression.action]);

    const isOutOfSpace = p1[0] < 0 || p1[0] >= spaceSize;

    if (isOutOfSpace) {
        return {
            progression,
            playerPosition: prevWorld.playerPosition,
            playerEnergy: prevWorld.playerEnergy,
            emptyCells: prevWorld.emptyCells,
            depth: prevWorld.depth,
            log: "out of space bounds",
            ok: false,
        };
    }

    const isEmptyAtP1 = prevWorld.emptyCells.some(x => v2.eqStrict(x, p1));
    const caState = caForProblem(problem)._at(p1[1], p1[0]);

    const theStateEnergyDrain = directionEnergyDrain[progression.action];
    const theDirectionEnergyDrain = isEmptyAtP1 ? 0 : stateEnergyDrain[caState];
    const moveCost = theStateEnergyDrain + theDirectionEnergyDrain;

    if (prevWorld.playerEnergy < moveCost) {
        return {
            progression,
            playerPosition: prevWorld.playerPosition,
            playerEnergy: prevWorld.playerEnergy,
            emptyCells: prevWorld.emptyCells,
            depth: prevWorld.depth,
            log: `insufficient energy ${moveCost - prevWorld.playerEnergy}`,
            ok: false,
        };
    }

    const energyGain = isEmptyAtP1 ? 0 : stateEnergyGain[caState];
    const energyDelta = energyGain - moveCost;
    const newPlayerEnergy = prevWorld.playerEnergy + energyDelta;

    const newEmptyCells = isEmptyAtP1
        ? prevWorld.emptyCells
        : [p1, ...prevWorld.emptyCells];

    const newDepth = Math.max(prevWorld.depth, p1[1] - depathLeftBehind);

    return {
        progression,
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
}