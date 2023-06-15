import { useRecoilValue } from "recoil";
import { allKnightMoves, knightMovesCap, knightMovesPerLevel } from "../model/sight";
import { namedInstructions } from "../model/terms/PackedTrek";
import { useMakeStep } from "./useMakeStep";
import { jsx } from "@emotion/react";
import { playerActionRecoil, sightAt, startForTrek } from "./playerActionRecoil";

export function KnightMoveButton({
    knightMove,
    ...props
}: jsx.JSX.IntrinsicElements["button"] & {
    knightMove: typeof allKnightMoves[number],
}) {
    const makeStep = useMakeStep();
    const playerAction = useRecoilValue(playerActionRecoil);
    const sight = sightAt(playerAction.trek);
    const drop = startForTrek(playerAction.trek);
    const equipment = drop.equipment;
    const knightMovesLeft = knightMovesCap(sight) - sight.knightMovesUsed;

    return <button
        onClick={() => makeStep(knightMove)}
        disabled={
            knightMovesLeft === 0
            || !knightMovesPerLevel[equipment.knightMoveLevel]
                .includes(knightMove)
        }
        {...props}
    >
        ‧
    </button>;
}

export function KnightMovesButtonsPanel({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const playerAction = useRecoilValue(playerActionRecoil);
    const sight = sightAt(playerAction.trek);
    const drop = startForTrek(playerAction.trek);
    const equipment = drop.equipment;
    const knightMovesLeft = knightMovesCap(sight) - sight.knightMovesUsed;
    return <div {...props}>
        {equipment.knightMoveLevel > 0 && <>
            Uses: {knightMovesLeft}
            <div css={[`& button {
                font-size: 2em;
                width: 1.5em;
                height: 1.5em;
            }`]}>
                <div>
                    <button css={{ visibility: "hidden" }}>‧</button>
                    <KnightMoveButton
                        knightMove={namedInstructions.knightLeftBackward}
                    />
                    <button css={{ visibility: "hidden" }}>‧</button>
                    <KnightMoveButton
                        knightMove={namedInstructions.knightLeftForward}
                    />
                    <button css={{ visibility: "hidden" }}>‧</button>
                </div>
                <div>
                    <KnightMoveButton
                        knightMove={namedInstructions.knightBackwardLeft}
                    />
                    <button css={{ visibility: "hidden" }}>‧</button>
                    <button css={{ visibility: "hidden" }}>‧</button>
                    <button css={{ visibility: "hidden" }}>‧</button>
                    <KnightMoveButton
                        knightMove={namedInstructions.knightForwardLeft}
                    />
                </div>
                <div>
                    <button css={{ visibility: "hidden" }}>‧</button>
                    <button css={{ visibility: "hidden" }}>‧</button>
                    <button disabled>ö</button>
                    <button css={{ visibility: "hidden" }}>‧</button>
                    <button css={{ visibility: "hidden" }}>‧</button>
                </div>
                <div>
                    <KnightMoveButton
                        knightMove={namedInstructions.knightBackwardRight}
                    />
                    <button css={{ visibility: "hidden" }}>‧</button>
                    <button css={{ visibility: "hidden" }}>‧</button>
                    <button css={{ visibility: "hidden" }}>‧</button>
                    <KnightMoveButton
                        knightMove={namedInstructions.knightForwardRight}
                    />
                </div>
                <div>
                    <button css={{ visibility: "hidden" }}>‧</button>
                    <KnightMoveButton
                        knightMove={namedInstructions.knightRightBackward}
                    />
                    <button css={{ visibility: "hidden" }}>‧</button>
                    <KnightMoveButton
                        knightMove={namedInstructions.knightRightForward}
                    />
                    <button css={{ visibility: "hidden" }}>‧</button>
                </div>
            </div>
        </>}
    </div>;
}
