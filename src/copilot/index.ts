import { Progression } from "../model/terms";


export function* enumerateProgression(
    progression: Progression,
): IterableIterator<Progression> {
    if ("prev" in progression) {
        yield* enumerateProgression(progression.prev);
    }
    yield progression;
}

export const offer = (progression: Progression) => {
    const arr = [...enumerateProgression(progression)];
    if (arr.length < 5) { return; }
    const last = arr.slice(-5);
    for (let i = arr.length - 1 - 5 - 1; i >= 0; i--) {
        if (arr.slice(i, i + 5).every((x, i) => {
            if (!("prev" in x)) { return false; }
            const y = last[i];
            if (!("prev" in y)) { return false; }
            return x.action === y.action;
        })) {
            const x = arr[i + 5];
            if ("prev" in x) { return x.action; }
        }
    }
};