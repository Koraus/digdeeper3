import { dropEquipmentRecoil } from "./dropEquipmentRecoil";
import type { jsx } from "@emotion/react";
import { useRecoilState, useRecoilValue } from "recoil";
import update from "immutability-helper";
import { playerProgressionRecoil } from "../playerProgressionRecoil";
import { SkillNumberPicker } from "./SkillNumberPicker";

export function DropEquipmentSelector({
    css: cssProp, ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const [dropEquipment, setDropEquipment] =
        useRecoilState(dropEquipmentRecoil);
    const { level } = useRecoilValue(playerProgressionRecoil);

    const totalPointsAvailable = level;
    const pointsUsed = dropEquipment.pickNeighborhoodIndex;
    const pointsRemaining = totalPointsAvailable - pointsUsed;

    return <div
        css={[{
            //
        }, cssProp]}
        {...props}
    >
        <h3>Skill Points spent: {pointsUsed} / {totalPointsAvailable}
        &nbsp;({pointsRemaining} left)</h3>
        A skill point is givel per level up.
        <br />
        You can reallocate points for each new game.
        <br />
        <br />
        <br />
        <div>
            <div css={{
                display: "inline-block",
                width: "25%",
            }}>
                <SkillNumberPicker
                    min={0}
                    max={Math.min(
                        2,
                        pointsRemaining + dropEquipment.pickNeighborhoodIndex,
                    )}
                    value={dropEquipment.pickNeighborhoodIndex}
                    setValue={v => setDropEquipment(update(dropEquipment, {
                        pickNeighborhoodIndex: {
                            $set: v as 0 | 1 | 2,
                        },
                    }))}
                    format={v => `${v}/2`}
                />
            </div>
            <br />Pick Neighborhood:
            <br />- {[
                "Current Cell Only",
                "Current + 4 Adjacent Cells",
                "Current + 4 Adjacent + 4 Diagonal Cells",
            ][dropEquipment.pickNeighborhoodIndex]}
        </div>
    </div>;
}
