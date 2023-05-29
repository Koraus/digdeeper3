import { DropzonePreview } from "./DropzonePreview";
import { startForTrek } from "../../model/sightAtTrek";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "../trekRecoil";


export function CurrentDropInfo() {
    const trek = useRecoilValue(trekRecoil);
    const drop = startForTrek(trek);

    const world = drop.dropzone.world;

    return <div css={[{ display: "flex", flexDirection: "column" }]}>
        <DropzonePreview dropzone={drop.dropzone} />
        <div>
            <div>{world.sightVersion}</div>
            <div>-- ca rule:
                &nbsp;{world.ca.rule} </div>
            <div>-- drain: {world.stateEnergyDrain.join(" ")}
                &nbsp;/ gain: {world.stateEnergyGain.join(" ")}
            </div>
            <div>- startFillState:
                &nbsp;{drop.dropzone.startFillState}</div>
            <div>- seed:
                &nbsp;{drop.dropzone.seed}</div>
            <div>- width:
                &nbsp;{drop.dropzone.width}</div>
            <div>depthLeftBehind:
                &nbsp;{drop.depthLeftBehind}</div>
            <div>equipment:
                &nbsp;{JSON.stringify(drop.equipment)}</div>

        </div>
    </div>;
}
