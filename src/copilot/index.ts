import { World, keyProjectWorld } from "../model/World";
import { TrekStep, Trek, trekDropzone, caForDropzone, initSight, applyStep } from "../model/terms";
import { v2 } from "../utils/v";
import { FlatTrek, flattenTrek } from "./FlatTrek";
import { loadFlatTreks } from "./saver";


const offerVersion = "digdeeper3/copilot/offer@6";

type LeafMap = Record<
    string,
    Partial<Record<TrekStep["action"], number>>
>;
type AccumulatedMap = Record<
    string,
    Record<
        string,
        LeafMap
    >
>;

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


export const processTrek = (
    map: LeafMap,
    flatTrek: FlatTrek,
    windowLength: number,
    neighborhood: v2[],
) => {
    const ca = caForDropzone(flatTrek.dropzone);
    let sight = initSight(flatTrek.dropzone);
    const getCell = (t: number, x: number) => {
        const _t = sight.playerPosition[1] + t;
        const _x = sight.playerPosition[0] + x;
        if (_t < sight.depth) { return "-"; }
        if (_x < 0 || _x >= flatTrek.dropzone.width) { return "-"; }
        const isEmpty = sight.emptyCells.some(([t, x]) => t === _t && x === _x);
        if (isEmpty) { return "x"; }
        return ca._at(_t, _x);
    };
    const getCells = () => neighborhood.map(([dx, dt]) => getCell(dt, dx));

    const states = [{
        action: "init" as string,
        cells: getCells(),
    }];
    for (let i = 0; i < flatTrek.array.length; i++) {
        const step = flatTrek.array[i];
        if (states.length >= windowLength) {
            const key = JSON.stringify(states);
            const value = (map[key] ?? (map[key] = {}))[step.action] ?? 0;
            map[key][step.action] = value * 0.95 + 1;
        }

        sight = applyStep(flatTrek.dropzone, sight, step);
        states.push({
            action: step.action,
            cells: getCells(),
        });
        states.splice(0, states.length - windowLength);
    }

    return states;
};

export const offer = (trek: Trek) => {
    const { map: _map, accumulatedOverTrekCount } =
        loadAccumulatedMap(trekDropzone(trek).world);

    const map = _map ?? {
        "5": { "3": {}, "2": {}, "1": {} },
        "4": { "3": {}, "2": {}, "1": {} },
        "3": { "3": {}, "2": {}, "1": {} },
        "2": { "3": {}, "2": {}, "1": {} },
    };

    const dropzone = trekDropzone(trek);
    const treks = loadFlatTreks(dropzone.world);
    for (let i = accumulatedOverTrekCount; i < treks.length; i++) {
        for (let w = 5; w >= 2; w--) {
            processTrek(
                map[w.toString()]["3"],
                treks[i],
                w,
                [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1], [0, 0], [0, 1],
                    [1, -1], [1, 0], [1, 1],
                ]);
            processTrek(
                map[w.toString()]["2"],
                treks[i],
                w,
                [
                    [-1, 0],
                    [0, -1], [0, 0], [0, 1],
                    [1, 0],
                ]);
            processTrek(
                map[w.toString()]["1"],
                treks[i],
                w,
                [
                    [0, 0],
                ]);
        }
    }

    if (treks.length > accumulatedOverTrekCount) {
        saveAccumulatedMap(dropzone.world, map, treks.length);
    }

    for (let w = 5; w >= 2; w--) {
        const s = processTrek(
            map[w.toString()]["3"],
            flattenTrek(trek),
            w,
            [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1], [0, 0], [0, 1],
                [1, -1], [1, 0], [1, 1],
            ]);
        if (s.length >= w) {
            const key = JSON.stringify(s);
            const value = map[w.toString()]["3"][key];
            if (value) { return value; }
        }
    }
    for (let w = 5; w >= 2; w--) {
        const s = processTrek(
            map[w.toString()]["2"],
            flattenTrek(trek),
            w,
            [
                [-1, 0],
                [0, -1], [0, 0], [0, 1],
                [1, 0],
            ]);
        if (s.length >= w) {
            const key = JSON.stringify(s);
            const value = map[w.toString()]["2"][key];
            if (value) { return value; }
        }
    }
    for (let w = 5; w >= 2; w--) {
        const s = processTrek(
            map[w.toString()]["1"],
            flattenTrek(trek),
            w,
            [
                [0, 0],
            ]);
        if (s.length >= w) {
            const key = JSON.stringify(s);
            const value = map[w.toString()]["1"][key];
            if (value) { return value; }
        }
    }
    return {};
};