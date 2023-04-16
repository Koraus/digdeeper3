import { universe } from "./universe";
import { Subject } from "rxjs";
import { log } from "./log";
import { v2 } from "../../utils/v";

export type DirectionKey = "left" | "right" | "up" | "down";

export const stateEnergyDrain = [81 * 9, 1, 0] as const;
export const stateEnergyGain = [0, 0, 81] as const;
export const directionEnergyDrain = {
    left: 1,
    right: 1,
    up: 9,
    down: 0,
} as const;
export const directionVec = {
    left: [-1, 0],
    right: [1, 0],
    up: [0, -1],
    down: [0, 1],
} as const;

export const maxDepthEver = ((key: string) => ({
    key,
    get() {
        const value = localStorage.getItem(key);
        return (null === value) ? 0 : Number(value);
    },
    set(value: number) {
        localStorage.setItem(key, value.toString());
    },
}))("maxDepthEver");

export const player = new (class Player {
    position = v2.from((universe.spaceSize - 1) / 2, universe.startingDepth);
    maxDepth = 0;
    energy = 81 * 3;
    insufficientEnergySubject = new Subject();
    onInput = new Subject();
    get depth() {
        const d = this.position[1] - universe.startingDepth;
        if (d > this.maxDepth) {
            this.maxDepth = d;
            if (this.maxDepth > maxDepthEver.get()) {
                maxDepthEver.set(this.maxDepth);
            }
        }
        return d;
    }
})();

const getMoveCost = (direction: DirectionKey, pos: v2) => {
    return directionEnergyDrain[direction]
        + (universe.get(pos[1], pos[0]).isEmpty ?
            0
            : stateEnergyDrain[universe.getCaState(pos[1], pos[0])]);
};

export const movePlayer = (_player: typeof player, direction: DirectionKey) => {
    _player.onInput.next(undefined);

    const p1 = v2.add(_player.position, directionVec[direction]);
    if (p1[0] < 0 || p1[0] > universe.spacetime[0].length - 1) { return; }
    if (p1[1] - universe.step < 0) { return; }

    const [_nx, _nt] = p1;
    const cellToCatch = universe.get(_nt, _nx);

    const moveCost = getMoveCost(direction, p1);
    if (_player.energy < moveCost) {
        _player.insufficientEnergySubject.next(undefined);
        log.write(`insufficient energy ${moveCost - _player.energy}`, -1);
        universe.stateVersion.increment();
        return;
    }

    _player.energy -= moveCost;
    const energyGain = cellToCatch.isEmpty
        ? 0
        : stateEnergyGain[universe.getCaState(_nt, _nx)];
    _player.energy += energyGain;

    const theDirectionEnergyDrain = directionEnergyDrain[direction];
    const theStateEnergyDrain = cellToCatch.isEmpty
        ? 0
        : stateEnergyDrain[universe.getCaState(_nt, _nx)];

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

    _player.position = p1;
    cellToCatch.isEmpty = true;
    if (
        _player.position[1] - universe.step > universe.spacetime.length * 0.6
    ) {
        universe.iterate();
    }
    universe.stateVersion.increment();
};