import { World, keyifyWorld } from "../model/World";
import { ActionTrekStep, Trek, trekDropzone } from "../model/terms";
import { _throw } from "../utils/_throw";

export function saveTrek(trek: Trek) {
    const worldKey = keyifyWorld(trekDropzone(trek).world);
    const savedTrekCountKey = worldKey + "/savedTreks/count";
    const savedTrekCount =
        JSON.parse(localStorage.getItem(savedTrekCountKey) ?? "0");
    const trekId = savedTrekCount;
    localStorage.setItem(
        `${worldKey}/savedTreks/${trekId}`, JSON.stringify(trek));
    localStorage.setItem(savedTrekCountKey + 1, JSON.stringify(trekId));
}

export function loadTreks(world: World) {
    const worldKey = keyifyWorld(world);
    const savedTrekCountKey = worldKey + "/savedTreks/count";
    const savedTrekCount =
        JSON.parse(localStorage.getItem(savedTrekCountKey) ?? "0");
    return Array.from(
        { length: savedTrekCount },
        (_, i) => JSON.parse(
            localStorage.getItem(`${worldKey}/savedTreks/${i}`)
            ?? _throw("Unexpectedly missing saved trek")));
}





export function* enumerateProgression(
    progression: Trek,
): IterableIterator<ActionTrekStep> {
    if ("prev" in progression) {
        yield* enumerateProgression(progression.prev);
        yield progression;
    }
}

const windowLength = 5;

export const getStateKey = (arr: ActionTrekStep[]) => {
    if (arr.length < windowLength) { return; }
    return arr.slice(-windowLength).map(x => x.action).join(",");
};

export const write = (
    map: Record<string, Partial<Record<ActionTrekStep["action"], number>>>,
    arr: ActionTrekStep[],
    next: ActionTrekStep,
) => {
    const key = getStateKey(arr);
    if (!key) { return; }

    const value = (map[key] ?? (map[key] = {}))[next.action] ?? 0;
    map[key][next.action] = value * 0.95 + 1;
};

export const read = (
    map: Record<string, Partial<Record<ActionTrekStep["action"], number>>>,
    arr: ActionTrekStep[],
) => {
    const key = getStateKey(arr);
    if (!key) { return; }

    return Object.entries(map[key] ?? {})
        .sort((a, b) => b[1] - a[1])[0]?.[0] as ActionTrekStep["action"];
};


export const offer = (trek: Trek) => {
    const map = {} as Record<
        string,
        Partial<Record<ActionTrekStep["action"], number>>>;

    const dropzone = trekDropzone(trek);
    const treks = loadTreks(dropzone.world);
    for (const t of treks) {
        const tArr = [...enumerateProgression(t)];
        for (let i = windowLength; i < tArr.length; i++) {
            write(map, tArr.slice(i - windowLength, i), tArr[i]);
        }
    }

    const arr = [...enumerateProgression(trek)];
    for (let i = windowLength; i < arr.length; i++) {
        write(map, arr.slice(i - windowLength, i), arr[i]);
    }
    return read(map, arr.slice(-windowLength));
};