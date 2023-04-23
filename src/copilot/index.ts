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
    // console.log(arr);
    const last = arr[arr.length - 1];
    if ("prev" in last) { return [last.action, last.action, last.action]; }
    return [];
};