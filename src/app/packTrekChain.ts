import { encode } from "../utils/base64Array";
import { InstructionIndex, PackedTrek, instructionBitSize, instructionIndices } from "../model/terms/PackedTrek";
import { version } from "../model/version";
import { TrekChain } from "./playerActionRecoil";


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