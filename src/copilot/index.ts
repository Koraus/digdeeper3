import { ActionProgression, Progression } from "../model/terms";


export function* enumerateProgression(
    progression: Progression,
): IterableIterator<ActionProgression> {
    if ("prev" in progression) {
        yield* enumerateProgression(progression.prev);
        yield progression;
    }
}

export const offer = (progression: Progression) => {
    const arr = [...enumerateProgression(progression)];
    const windowLength = 5;
    if (arr.length < windowLength + 1) { return; }
    const map = {} as Record<
        string,
        Partial<Record<ActionProgression["action"], number>>>;
    for (let i = windowLength; i < arr.length; i++) {
        const key = arr.slice(i - windowLength, i)
            .map(x => x.action)
            .join(",");
        const value = (map[key] ?? (map[key] = {}))[arr[i].action] ?? 0;
        map[key][arr[i].action] = value * 0.95 + 1;
    }
    {
        const key = arr.slice(-windowLength).map(x => x.action).join(",");
        return Object.entries(map[key] ?? {})
            .sort((a, b) => b[1] - a[1])[0]?.[0] as ActionProgression["action"];
    }
};