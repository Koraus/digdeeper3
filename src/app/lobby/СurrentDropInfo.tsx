import { DropzonePreview } from "./DropzonePreview";
import { startForTrek } from "../../model/terms";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "../trekRecoil";


export function СurrentDropInfo() {
    const trek = useRecoilValue(trekRecoil);
    const drop = startForTrek(trek);
    const pStyle = { margin: "2px 10px" };

    return <div css={[{ display: "flex" }]}>
        <DropzonePreview css={[{
            margin: "10px",
        }]}
            dropzone={drop.dropzone} />
        <div css={[{ marginTop: "10px" }]} >
            <p css={[pStyle]}>sightVersion:
                &nbsp;{drop.dropzone.world.sightVersion} </p>
            <p css={[pStyle]}>ca version:
                &nbsp;{drop.dropzone.world.ca.version}</p>
            <p css={[pStyle]}>ca stateCount:
                &nbsp;{drop.dropzone.world.ca.stateCount}</p>
            <p css={[pStyle]}>ca rule:
                &nbsp;{drop.dropzone.world.ca.rule} </p>
            <p css={[pStyle]}>stateEnergyDrain:&#32;
                {drop.dropzone.world.stateEnergyDrain[0]}&nbsp;
                {drop.dropzone.world.stateEnergyDrain[1]}&nbsp;
                {drop.dropzone.world.stateEnergyDrain[2]}&nbsp;
            </p>
            <p css={[pStyle]}>stateEnergyGain:&#32;
                {drop.dropzone.world.stateEnergyGain[0]}&nbsp;
                {drop.dropzone.world.stateEnergyGain[1]}&nbsp;
                {drop.dropzone.world.stateEnergyGain[2]}&nbsp;
            </p>
            <p css={[pStyle]}>startFillState:
                &nbsp;{drop.dropzone.startFillState}</p>
            <p css={[pStyle]}>seed:
                &nbsp;{drop.dropzone.seed}</p>
            <p css={[pStyle]}>width:
                &nbsp;{drop.dropzone.width}</p>
            <p css={[pStyle]}>depthLeftBehind:
                &nbsp;{drop.depthLeftBehind}</p>
            <p css={[pStyle]}>equipment:
                &nbsp;{JSON.stringify(drop.equipment)}</p>

        </div>


    </div>;
}
