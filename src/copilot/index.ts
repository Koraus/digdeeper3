import { ActionTrekStep, Trek } from "../model/terms";


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
    if (arr.length < windowLength + 1) { return; }
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


export const offer = (progression: Trek) => {
    const arr = [...enumerateProgression(progression)];
    const map = {} as Record<
        string,
        Partial<Record<ActionTrekStep["action"], number>>>;

    for (let i = windowLength; i < arr.length; i++) {
        write(map, arr.slice(i - windowLength, i), arr[i]);
    }
    return read(map, arr.slice(-windowLength));
};