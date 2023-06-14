import { Instruction, PackedTrek, writeBytecode } from "../model/terms/PackedTrek";
import { version } from "../model/version";
import { TrekChain } from "./playerActionRecoil";


export const packTrekChain = (trek: TrekChain): PackedTrek => {
    let t = trek;
    const array = [] as Instruction[];
    while ("prev" in t) {
        array.push(t.instruction);
        t = t.prev;
    }
    array.reverse();

    return {
        v: version,
        drop: t,
        ...writeBytecode(array),
    };
};