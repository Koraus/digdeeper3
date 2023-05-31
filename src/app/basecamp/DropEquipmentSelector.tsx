import { dropEquipmentRecoil } from "./dropEquipmentRecoil";
import type { jsx } from "@emotion/react";
import { useRecoilState, useRecoilValue } from "recoil";
import update from "immutability-helper";
import { playerProgressionRecoil } from "../playerProgressionRecoil";


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
        Skills<br />
        Skill Points: {pointsRemaining} / {totalPointsAvailable}<br />
        - <label>
            <span>Pick Neighborhood Index</span>&nbsp;
            <input
                type="number"
                min={0}
                max={Math.min(
                    2,
                    pointsRemaining + dropEquipment.pickNeighborhoodIndex,
                )}
                value={dropEquipment.pickNeighborhoodIndex}
                onChange={ev => setDropEquipment(update(dropEquipment, {
                    pickNeighborhoodIndex: {
                        $set: Number(ev.target.value) as 0 | 1 | 2,
                    },
                }))}
            ></input>
        </label><br />
    </div>;
}
