import { Cell, universe } from "./universe";
import { createCachedGetter } from "../../utils/CachedGetter";
import { Subject } from "rxjs";
import { log } from "./log";

export type Direction = "left" | "right" | "up" | "down";

export const stateEnergyDrain = [81 * 9, 1, 0];
export const stateEnergyGain = [0, 0, 81];
export const directionEnergyDrain = {
    left: 1,
    right: 1,
    up: 9,
    down: 0,
};
export const emptyState = 1;

export const oppositeDirection = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
} as const;

export const maxDepthEver = ((key: string) => ({
    key,
    get() {
        const value = localStorage.getItem(key);
        return (null === value) ? 0 : Number(value);
    },
    set(value: number) {
        localStorage.setItem(key, value.toString());
    }
}))("maxDepthEver");

export const player = new class Player {
    getCell = createCachedGetter(
        () => universe.stateVersion.value,
        () => {
            for (let t = 0; t < universe.spacetime.length; t++) {
                for (let x = 0; x < universe.spacetime[t].length; x++) {
                    const cell = universe.spacetime[t][x];
                    if (cell.isPlayer) {
                        return { t, x, cell };
                    }
                }
            }
            throw "No player";
        },
    );

    get cell() {
        return this.getCell();
    }



    autocompleteLog = [] as Array<{
        direction: Direction,
        targetCell: {
            state: number,
            isEmpty: boolean,
        },
    }>;

    g(i: number, t: number, x: number) {
        const gg = [] as Array<{
            direction: Direction;
            targetCell: { state: number; isEmpty: boolean },
            t: number;
            x: number
        }>;
        for (; i < this.autocompleteLog.length; i++) {
            const entry = this.autocompleteLog[i];
            const cell = this.getNeighbourCell(entry.direction, t, x);

            if ("undefined" === typeof cell) {
                break;
            }

            if (
                entry.targetCell.state
                !== universe.spacetime[cell.t][cell.x].state
            ) {
                break;
            }

            gg.push({ ...entry, t, x });
            t = cell.t;
            x = cell.x;
        }
        return gg;
    }

    k(): (Array<{
        direction: Direction;
        targetCell: { state: number; isEmpty: boolean },
        t: number;
        x: number
    }>)[] {
        return this.autocompleteLog
            .map((_, i) => this.g(i, this.cell.t, this.cell.x))
            .filter(x => x.length > 10);
    }

    kk = createCachedGetter(
        () => universe.stateVersion.value,
        () => this.k(),
    );

    maxDepth = 0;

    energy = 81 * 3;
    insufficientEnergySubject = new Subject();

    onInput = new Subject();

    get depth() {
        const d = universe.step + this.cell.t - universe.startingDepth;
        if (d > this.maxDepth) {
            this.maxDepth = d;
            if (this.maxDepth > maxDepthEver.get()) {
                maxDepthEver.set(this.maxDepth);
            }
        }
        return d;
    }

    getNeighbourCell(direction: "left" | "right" | "up" | "down", t: number, x: number) {
        switch (direction) {
            case "left":
                if (x <= 0) {
                    return undefined;
                }
                return {
                    t: t,
                    x: x - 1,
                    cell: universe.spacetime[t][x - 1],
                };
            case "right":
                if (x >= universe.spacetime[0].length - 1) {
                    return undefined;
                }
                return {
                    t: t,
                    x: x + 1,
                    cell: universe.spacetime[t][x + 1],
                };
            case "up":
                if (t <= 0) {
                    return undefined;
                }
                return {
                    t: t - 1,
                    x: x,
                    cell: universe.spacetime[t - 1][x],
                };
            case "down":
                if (t >= universe.spacetime.length - 1) {
                    return undefined;
                }
                return {
                    t: t + 1,
                    x: x,
                    cell: universe.spacetime[t + 1][x],
                };
        }
    }

    getMoveCost(direction: Direction, cellToCatch: Cell) {
        return directionEnergyDrain[direction]
            + (cellToCatch.isEmpty ? 0 : stateEnergyDrain[cellToCatch.state]);
    }

    lastMove?: {
        direction: Direction,
        energyDelta: number,
        ruined: boolean,
    };

    move(direction: Direction) {
        this.onInput.next(undefined);

        const _cellToCatch = this.getNeighbourCell(
            direction, this.cell.t, this.cell.x);

        if ("undefined" === typeof _cellToCatch) {
            return;
        }
        const cellToCatch = _cellToCatch.cell;

        const moveCost = this.getMoveCost(direction, cellToCatch);
        if (this.energy < moveCost) {
            this.insufficientEnergySubject.next(undefined);
            log.write(`insufficient energy ${moveCost - this.energy}`, -1);
            universe.stateVersion.increment();
            return;
        }

        this.energy -= moveCost;
        const energyGain = cellToCatch.isEmpty
            ? 0
            : stateEnergyGain[cellToCatch.state];
        this.energy += energyGain;

        const theDirectionEnergyDrain = directionEnergyDrain[direction];
        const theStateEnergyDrain = cellToCatch.isEmpty
            ? 0
            : stateEnergyDrain[cellToCatch.state];

        log.write(
            `delta ${energyGain - moveCost}:`
            + ((theDirectionEnergyDrain > 0)
                ? ` move ${-theDirectionEnergyDrain}`
                : "")
            + ((theStateEnergyDrain > 0)
                ? ` ruin ${-theStateEnergyDrain}`
                : "")
            + ((energyGain > 0)
                ? ` gain ${energyGain}`
                : ""),
            energyGain - moveCost);

        this.autocompleteLog.push({
            direction,
            targetCell: {
                isEmpty: cellToCatch.isEmpty,
                state: cellToCatch.state,
            }
        });


        this.lastMove = {
            direction,
            energyDelta: energyGain - moveCost,
            ruined: !cellToCatch.isEmpty,
        };

        this.cell.cell.isPlayer = false;
        cellToCatch.isPlayer = true;
        cellToCatch.isEmpty = true;
        if (this.cell.t > universe.spacetime.length * 0.6) {
            universe.iterate();
        }
        universe.stateVersion.increment();
    }

    undo() {
        this.onInput.next(undefined);
        if ("undefined" === typeof this.lastMove) {
            log.write("undo not available", -1);
            universe.stateVersion.increment();
            return;
        }
        this.energy -= this.lastMove.energyDelta;
        const cellToCatch = this.getNeighbourCell(
            oppositeDirection[this.lastMove.direction],
            this.cell.t,
            this.cell.x)!;

        log.write(
            `undo, delta ${-this.lastMove.energyDelta}`,
            -this.lastMove.energyDelta);

        if (this.lastMove.ruined) {
            this.cell.cell.isEmpty = false;
        }
        this.cell.cell.isPlayer = false;
        cellToCatch.cell.isPlayer = true;
        this.autocompleteLog.pop();
        this.lastMove = undefined;

        universe.stateVersion.increment();
    }
};
