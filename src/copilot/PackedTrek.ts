import { TrekStart, TrekStep } from "../model/terms";
import { FlatTrek } from "./FlatTrek";


export type PackedTrek = {
    start: TrekStart;
    unpackedArrayLength: number;
    arrayBase64: string;
}

const indexedActions = [
    "forward",
    "backward",
    "left",
    "right",
] as const;
const actionIndices = indexedActions.reduce(
    (acc, action, i) => ({ ...acc, [action]: i }),
    {} as Record<typeof indexedActions[number], number>,
);

const actionBitSize = 2; // 0..3

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
    const actionsPerUnit = Math.floor(6 / actionBitSize);
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

export const unpackTrek = (trek: PackedTrek): FlatTrek => {
    const { start, unpackedArrayLength, arrayBase64 } = trek;
    const actionsPerUnit = Math.floor(6 / actionBitSize);
    const unpackedArray = new Array(unpackedArrayLength);
    for (let i = 0; i < unpackedArrayLength; i++) {
        const packedIndex = Math.floor(i / actionsPerUnit);
        const packedOffset = (i % actionsPerUnit) * actionBitSize;
        const byteBase64 = arrayBase64.charCodeAt(packedIndex);
        const byte = base64Digits.indexOf(byteBase64);
        const packed = (byte >> packedOffset) & ((1 << actionBitSize) - 1);
        unpackedArray[i] = unpackTrekStep(packed);
    }
    return {
        start,
        array: unpackedArray,
    };
};