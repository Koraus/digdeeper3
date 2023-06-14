import { useRecoilValue } from "recoil";
import { knightMovesCap, knightMovesPerLevel } from "../model/sight";
import { nameByInstruction, namedInstructions } from "../model/terms/PackedTrek";
import { useMakeStep } from "./useMakeStep";
import { jsx } from "@emotion/react";
import { playerActionRecoil, sightAt, startForTrek } from "./playerActionRecoil";



export function KnightMovesButtonsPanel({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const makeStep = useMakeStep();
    const playerAction = useRecoilValue(playerActionRecoil);
    const sight = sightAt(playerAction.trek);
    const drop = startForTrek(playerAction.trek);
    const equipment = drop.equipment;
    const knightMovesLeft = knightMovesCap(sight) - sight.knightMovesUsed;
    return <div {...props}>
        Uses: {knightMovesLeft}
        {[
            namedInstructions.knightForwardLeft,
            namedInstructions.knightForwardRight,
            namedInstructions.knightBackwardLeft,
            namedInstructions.knightBackwardRight,
            namedInstructions.knightLeftForward,
            namedInstructions.knightLeftBackward,
            namedInstructions.knightRightForward,
            namedInstructions.knightRightBackward,
        ].map((instruction, i) => <button
            key={i}
            onClick={() => makeStep(instruction)}
            css={{
                display: "block",
            }}
            disabled={
                knightMovesLeft === 0
                || !knightMovesPerLevel[equipment.knightMoveLevel]
                    .includes(instruction)
            }
        >
            {nameByInstruction[instruction]}
        </button>)}
    </div>;
}
