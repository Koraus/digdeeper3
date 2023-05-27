import { DropzonePreview } from "./DropzonePreview";
import { startForTrek } from "../../model/sightAtTrek";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "../trekRecoil";


export function CurrentDropInfo() {
    const trek = useRecoilValue(trekRecoil);
    const drop = startForTrek(trek);

    const world = drop.dropzone.world;

    const pStyle = { margin: "2px 10px" };
    return <div css={[{ display: "flex" }]}>
        <DropzonePreview css={[{
            margin: "10px",
        }]}
            dropzone={drop.dropzone} />
        <div css={[{ marginTop: "10px" }]} >
            <p css={[pStyle]}>{world.sightVersion}</p>
            <p css={[pStyle]}>-- ca rule:
                &nbsp;{world.ca.rule} </p>
            <p css={[pStyle]}>-- drain: {world.stateEnergyDrain.join(" ")}
                &nbsp;/ gain: {world.stateEnergyGain.join(" ")}
            </p>
            <p css={[pStyle]}>- startFillState:
                &nbsp;{drop.dropzone.startFillState}</p>
            <p css={[pStyle]}>- seed:
                &nbsp;{drop.dropzone.seed}</p>
            <p css={[pStyle]}>- width:
                &nbsp;{drop.dropzone.width}</p>
            <p css={[pStyle]}>depthLeftBehind:
                &nbsp;{drop.depthLeftBehind}</p>
            <p css={[pStyle]}>equipment:
                &nbsp;{JSON.stringify(drop.equipment)}</p>

        </div>
    </div>;
}
