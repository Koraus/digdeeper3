import { DropzonePreview } from "./DropzonePreview";
import { startForTrek } from "../../model/sightChain";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "../trekRecoil";


export function CurrentDropInfo() {
    const trek = useRecoilValue(trekRecoil);
    const drop = startForTrek(trek);

    const world = drop.zone.world;

    return <div css={[{ display: "flex", flexDirection: "column" }]}>
        <DropzonePreview dropzone={drop.zone} />
        <div>
            <div>{world.v}</div>
            <div>-- ca rule:
                &nbsp;{world.ca.rule} </div>
            <div>-- drain: {world.stateEnergyDrain.join(" ")}
                &nbsp;/ gain: {world.stateEnergyGain.join(" ")}
            </div>
            <div>- startFillState:
                &nbsp;{drop.zone.startFillState}</div>
            <div>- seed:
                &nbsp;{drop.zone.seed}</div>
            <div>- width:
                &nbsp;{drop.zone.width}</div>
            <div>depthLeftBehind:
                &nbsp;{drop.depthLeftBehind}</div>
            <div>equipment:
                &nbsp;{JSON.stringify(drop.equipment)}</div>

        </div>
    </div>;
}
