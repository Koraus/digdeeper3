import { applyStep, initSight } from "./sight";
import { PackedTrek, getInstructionAt } from "./terms/PackedTrek";
import { _never } from "../utils/_never";


export function assertEvacuation(packedTrek: PackedTrek) {
    let sight = initSight(packedTrek.drop);

    for (let i = 0; i < packedTrek.bytecodeLength; i++) {
        const instruction = getInstructionAt(packedTrek, i);

        const nextSight = applyStep(packedTrek.drop, sight, instruction)[0];
        if (!nextSight) { return _never(); }

        if (i === packedTrek.bytecodeLength - 1) {
            if (
                nextSight.lastCrossedEvacuationLine
                !== sight.lastCrossedEvacuationLine
            ) {
                // a valid evacuation trek should 
                // reach the evacuation line on the last step
                return true;
            }
        }

        sight = nextSight;
    }
    _never();
}
