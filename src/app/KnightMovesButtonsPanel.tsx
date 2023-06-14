import { nameByInstruction, namedInstructions } from "../model/terms/PackedTrek";
import { useMakeStep } from "./useMakeStep";
import { jsx } from "@emotion/react";



export function KnightMovesButtonsPanel({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const makeStep = useMakeStep();
    return <div {...props}>
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
        >
            {nameByInstruction[instruction]}
        </button>)}
    </div>;
}
