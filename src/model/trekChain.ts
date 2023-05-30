
import { encode } from "../utils/base64Array";
import { Drop } from "./terms/Drop";
import { InstructionIndex, PackedTrek, instructionBitSize, instructionIndices } from "./terms/PackedTrek";
import { version } from "./version";


export type TrekChain =
    Drop
    | {
        instruction: keyof typeof instructionIndices,
        prev: TrekChain,
    };


export const packTrekChain = (trek: TrekChain): PackedTrek => {
    let t = trek;
    const array = [] as InstructionIndex[];
    while ("prev" in t) {
        array.push(instructionIndices[t.instruction]);
        t = t.prev;
    }
    array.reverse();

    return {
        v: version,
        drop: t,
        bytecodeLength: array.length,
        bytecodeBase64: encode(instructionBitSize, array),
    };
};