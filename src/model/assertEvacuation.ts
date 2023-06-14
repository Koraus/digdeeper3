import { applyStep, initSight } from "./sight";
import { PackedTrek, enumerateBytecode } from "./terms/PackedTrek";
import { _never } from "../utils/_never";
import { _throw } from "../utils/_throw";
import { isEvacuationLineCrossed } from "./evacuation";


export function assertEvacuation(packedTrek: PackedTrek) {
    let sight = initSight(packedTrek.drop);
    let lastEvacuationLineCrossed = false;

    for (const instruction of enumerateBytecode(packedTrek)) {
        const [nextSight, msg] =
            applyStep(packedTrek.drop, sight, instruction);
        if (!nextSight) { return _throw(msg); }
        lastEvacuationLineCrossed =
            isEvacuationLineCrossed(sight.maxDepth, nextSight.maxDepth);
        sight = nextSight;
    }
    if (lastEvacuationLineCrossed) {
        // a valid evacuation trek 
        // should reach the evacuation line on the last step
        return true;
    }
    _never();
}
