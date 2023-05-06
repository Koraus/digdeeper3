import { World, keyProjectWorld } from "../model/World";
import { TrekStep, Dropzone, Trek, trekDropzone, caForDropzone, initSight, applyStep } from "../model/terms";
import { _throw } from "../utils/_throw";


type FlatTrek = {
    dropzone: Dropzone,
    array: TrekStep[],
};

function flattenTrek(trek: Trek): FlatTrek {
    let t = trek;
    const array = [] as TrekStep[];
    while ("prev" in t) {
        array.push({ action: t.action });
        t = t.prev;
    }
    array.reverse();
    return { dropzone: t.dropzone, array };
}

const saverVersion = "digdeeper3/copilot/saver@2";

export function saveTrek(trek: Trek) {
    const countKey = JSON.stringify({
        saverVersion,
        world: keyProjectWorld(trekDropzone(trek).world),
        key: "count",
    });

    const count = JSON.parse(localStorage.getItem(countKey) ?? "0");

    const trekId = count;
    const trekKey = JSON.stringify({
        saverVersion,
        world: keyProjectWorld(trekDropzone(trek).world),
        key: "trek",
        trekId,
    });

    localStorage.setItem(trekKey, JSON.stringify(flattenTrek(trek)));
    localStorage.setItem(countKey, JSON.stringify(count + 1));
}

export function loadTreks(world: World) {
    const countKey = JSON.stringify({
        saverVersion,
        world: keyProjectWorld(world),
        key: "count",
    });
    const count = JSON.parse(localStorage.getItem(countKey) ?? "0");
    return Array.from(
        { length: count },
        (_, i) => {
            const trekKey = JSON.stringify({
                saverVersion,
                world: keyProjectWorld(world),
                key: "trek",
                trekId: i,
            });
            return JSON.parse(
                localStorage.getItem(trekKey)
                ?? _throw("Unexpectedly missing saved trek"),
            ) as FlatTrek;
        });
}

const offerVersion = "digdeeper3/copilot/offer@5";

function saveAccumulatedMap(
    world: World,
    map: Record<string, Partial<Record<TrekStep["action"], number>>>,
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
    map: Record<string, Partial<Record<TrekStep["action"], number>>>,
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
            map: {},
            accumulatedOverTrekCount: 0,
        };
    }
    return JSON.parse(str);
}


const windowLength = 5;

export const getStateKey = (arr: TrekStep[]) => {
    if (arr.length < windowLength) { return; }
    return arr.slice(-windowLength).map(x => x.action).join(",");
};

export const processTrek = (
    map: Record<string, Partial<Record<TrekStep["action"], number>>>,
    flatTrek: FlatTrek,
) => {
    const ca = caForDropzone(flatTrek.dropzone);
    let sight = initSight(flatTrek.dropzone);
    const getCell = (t: number, x: number) => {
        const _t = sight.playerPosition[1] + t;
        const _x = sight.playerPosition[0] + x;
        if (_t < sight.depth) { return "-"; }
        return ca._at(_t, _x);
    };
    const getCells = () => [
        getCell(-1, -1),
        getCell(-1, 0),
        getCell(-1, 1),
        getCell(0, -1),
        getCell(0, 0),
        getCell(0, 1),
        getCell(1, -1),
        getCell(1, 0),
        getCell(1, 1),
    ];

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
    const { map, accumulatedOverTrekCount } =
        loadAccumulatedMap(trekDropzone(trek).world);

    const dropzone = trekDropzone(trek);
    const treks = loadTreks(dropzone.world);
    for (let i = accumulatedOverTrekCount; i < treks.length; i++) {
        processTrek(map, treks[i]);
    }

    if (treks.length > accumulatedOverTrekCount) {
        saveAccumulatedMap(dropzone.world, map, treks.length);
    }

    const s = processTrek(map, flattenTrek(trek));
    if (s.length < windowLength) { return; }

    const key = JSON.stringify(s);
    const value = map[key] ?? {};
    return value;
};