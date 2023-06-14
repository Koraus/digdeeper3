import { dropEquipmentRecoil } from "./dropEquipmentRecoil";
import type { jsx } from "@emotion/react";
import { useRecoilState, useRecoilValue } from "recoil";
import update from "immutability-helper";
import { SkillNumberPicker } from "./SkillNumberPicker";
import { useTranslate } from "../languageRecoil";
import { levelProgressRecoil } from "../levelProgressRecoil";

export function DropEquipmentSelector({
    css: cssProp, ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const [dropEquipment, setDropEquipment] =
        useRecoilState(dropEquipmentRecoil);
    const levelProgress = useRecoilValue(levelProgressRecoil);

    const totalPointsAvailable = Math.floor(levelProgress);
    const pointsUsed = 
        dropEquipment.pickNeighborhoodLevel
        + dropEquipment.knightMoveLevel;
    const pointsRemaining = totalPointsAvailable - pointsUsed;
    const translate = useTranslate();

    return <div
        css={[{
            //
        }, cssProp]}
        {...props}
    >
        <h3>
            # {translate("Skill Points")}: {pointsRemaining}
            <br />
            <span css={{ fontSize: "0.85em" }}>(
                {pointsUsed} {translate("spent")}
                &nbsp;/ {totalPointsAvailable} {translate("total")}
            )</span>
        </h3>
        {translate("A skill point is given per level up.")}
        <br />
        {translate("You can reallocate points for each new game.")}
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
                        pointsRemaining + dropEquipment.pickNeighborhoodLevel,
                    )}
                    value={dropEquipment.pickNeighborhoodLevel}
                    setValue={v => setDropEquipment(update(dropEquipment, {
                        pickNeighborhoodLevel: {
                            $set: v as 0 | 1 | 2,
                        },
                    }))}
                    format={v => `${v}/2`}
                />
            </div>
            <br />{translate("Pick Neighborhood")}:
            <br />- {[
                translate("Current Cell Only"),
                translate("Current + 4 Adjacent Cells"),
                translate("Current + 4 Adjacent + 4 Diagonal Cells"),
            ][dropEquipment.pickNeighborhoodLevel]}
        </div>
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
                        pointsRemaining + dropEquipment.knightMoveLevel,
                    )}
                    value={dropEquipment.knightMoveLevel}
                    setValue={v => setDropEquipment(update(dropEquipment, {
                        knightMoveLevel: {
                            $set: v as 0 | 1 | 2,
                        },
                    }))}
                    format={v => `${v}/2`}
                />
            </div>
            <br />{translate("Blink: Move like a Chess Knight")}:
            <br />- {[
                translate("No blink"),
                translate("Blink forward-left or forward-right"),
                translate("Blick in any direction"),
            ][dropEquipment.knightMoveLevel]}
        </div>
    </div>;
}
