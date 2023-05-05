import { World, keyProjectWorld, keyifyWorld } from "../model/World";
import { TrekStep, Dropzone, Trek, trekDropzone } from "../model/terms";
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

const offerVersion = "digdeeper3/copilot/offer@1";

function saveAccumulatedMap(
    world: World,
    map: Record<string, Partial<Record<TrekStep["action"], number>>>,
    accumulatedOverTrekCount: number,
) {
    const key = JSON.stringify({
        offerVersion,
        saverVersion,
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
        saverVersion,
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

export const write = (
    map: Record<string, Partial<Record<TrekStep["action"], number>>>,
    arr: TrekStep[],
    next: TrekStep,
) => {
    const key = getStateKey(arr);
    if (!key) { return; }

    const value = (map[key] ?? (map[key] = {}))[next.action] ?? 0;
    map[key][next.action] = value * 0.95 + 1;
};

export const read = (
    map: Record<string, Partial<Record<TrekStep["action"], number>>>,
    arr: TrekStep[],
) => {
    const key = getStateKey(arr);
    if (!key) { return; }

    return Object.entries(map[key] ?? {})
        .sort((a, b) => b[1] - a[1])[0]?.[0] as TrekStep["action"];
};


export const offer = (trek: Trek) => {
    const { map, accumulatedOverTrekCount } =
        loadAccumulatedMap(trekDropzone(trek).world);

    const dropzone = trekDropzone(trek);
    const treks = loadTreks(dropzone.world);
    for (let i = accumulatedOverTrekCount; i < treks.length; i++) {
        const t = treks[i];
        const tArr = t.array;
        for (let i = windowLength; i < tArr.length; i++) {
            write(map, tArr.slice(i - windowLength, i), tArr[i]);
        }
    }
    if (treks.length > accumulatedOverTrekCount) {
        saveAccumulatedMap(dropzone.world, map, treks.length);
    }

    const arr = flattenTrek(trek).array;
    for (let i = windowLength; i < arr.length; i++) {
        write(map, arr.slice(i - windowLength, i), arr[i]);
    }
    return read(map, arr.slice(-windowLength));
};