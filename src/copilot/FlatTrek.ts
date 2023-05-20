import { TrekStep, Trek, TrekStart } from "../model/terms";

export type FlatTrek = {
    start: TrekStart;
    array: TrekStep[];
};


export function flattenTrek(trek: Trek): FlatTrek {
    let t = trek;
    const array = [] as TrekStep[];
    while ("prev" in t) {
        array.push({ action: t.action });
        t = t.prev;
    }
    array.reverse();
    return { start: t, array };
}