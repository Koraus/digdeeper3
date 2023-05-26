import { Trek, TrekStart, TrekStep } from "./terms";


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


export type PackedTrek = {
    start: TrekStart;
    unpackedArrayLength: number;
    arrayBase64: string;
}

export const indexedActions = [
    "forward",
    "backward",
    "left",
    "right",
] as const;
export const actionIndices = indexedActions.reduce(
    (acc, action, i) => ({ ...acc, [action]: i }),
    {} as Record<typeof indexedActions[number], number>,
);

export const indexedActionsLength = indexedActions.length;
export const actionBitSize = Math.ceil(Math.log2(indexedActionsLength));
export const actionsPerUnit = Math.floor(6 / actionBitSize);

export const packTrekStep = (trekStep: TrekStep) => {
    return actionIndices[trekStep.action];
};
export const unpackTrekStep = (packed: number): TrekStep => {
    return { action: indexedActions[packed] };
};

const base64Digits = 
    [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"]
        .map(c => c.charCodeAt(0));

export const packTrek = (trek: FlatTrek): PackedTrek => {
    const { start, array } = trek;
    const arrayBase64 = new Uint8Array(
        Math.ceil(array.length * actionBitSize / 6));
    for (let i = 0; i < array.length; i++) {
        const packedIndex = Math.floor(i / actionsPerUnit);
        const packedOffset = (i % actionsPerUnit) * actionBitSize;
        const packed = packTrekStep(array[i]);
        arrayBase64[packedIndex] |= packed << packedOffset;
    }
    for (let i = 0; i < arrayBase64.length; i++) {
        arrayBase64[i] = base64Digits[arrayBase64[i]];
    }

    return {
        start,
        unpackedArrayLength: array.length,
        arrayBase64: String.fromCharCode(...arrayBase64),
    };
};

export const getPackedStepAt = (trek: PackedTrek, index: number) => {
    const { arrayBase64 } = trek;
    const packedIndex = Math.floor(index / actionsPerUnit);
    const packedOffset = (index % actionsPerUnit) * actionBitSize;
    const byteBase64 = arrayBase64.charCodeAt(packedIndex);
    const byte = base64Digits.indexOf(byteBase64);
    const packed = (byte >> packedOffset) & ((1 << actionBitSize) - 1);
    return packed;
};

export const unpackTrek = (trek: PackedTrek): FlatTrek => {
    const { start, unpackedArrayLength } = trek;
    const unpackedArray = new Array(unpackedArrayLength);
    for (let i = 0; i < unpackedArrayLength; i++) {
        unpackedArray[i] = unpackTrekStep(getPackedStepAt(trek, i));
    }
    return {
        start,
        array: unpackedArray,
    };
};