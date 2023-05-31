import { applyStep, initSight } from "./sight";
import { PackedTrek, getInstructionAt } from "./terms/PackedTrek";
import { _never } from "../utils/_never";
import { _throw } from "../utils/_throw";
import { isEvacuationLineCrossed } from "./evacuation";


export function assertEvacuation(packedTrek: PackedTrek) {
    let sight = initSight(packedTrek.drop);

    for (let i = 0; i < packedTrek.bytecodeLength; i++) {
        const instruction = getInstructionAt(packedTrek, i);

        const [nextSight, msg] =
            applyStep(packedTrek.drop, sight, instruction);
        if (!nextSight) { return _throw(msg); }

        if (i === packedTrek.bytecodeLength - 1) {
            // a valid evacuation trek should 
            // reach the evacuation line on the last step
            if (isEvacuationLineCrossed(sight.maxDepth, nextSight.maxDepth)) {
                return true;
            }
        }

        sight = nextSight;
    }
    _never();
}
