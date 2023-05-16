import { DropzonePreview } from "./DropzonePreview";
import { trekDropzone } from "../../model/terms";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "../trekRecoil";


export function СurrentWorldInfo() {
    const progression = useRecoilValue(trekRecoil);
    const dropzone = trekDropzone(progression);
    const pStyle = { margin: "2px 10px" };
    
    return <div css={[{ display: "flex" }]}>
        <DropzonePreview css={[{
            margin: "10px",
        }]}
            dropzone={dropzone} />
        <div css={[{ marginTop: "10px" }]} >
            <p css={[pStyle]}> sightVersion: {dropzone.world.sightVersion} </p>
            <p css={[pStyle]}>ca version: {dropzone.world.ca.version}</p>
            <p css={[pStyle]}>ca stateCount: {dropzone.world.ca.stateCount}</p>
            <p css={[pStyle]}>ca rule: {dropzone.world.ca.rule} </p>
            <p css={[pStyle]}>stateEnergyDrain:&#32;
                {dropzone.world.stateEnergyDrain[0]}&nbsp;
                {dropzone.world.stateEnergyDrain[1]}&nbsp;
                {dropzone.world.stateEnergyDrain[2]}&nbsp;
            </p>
            <p css={[pStyle]}>stateEnergyGain:&#32;
                {dropzone.world.stateEnergyGain[0]}&nbsp;
                {dropzone.world.stateEnergyGain[1]}&nbsp;
                {dropzone.world.stateEnergyGain[2]}&nbsp;
            </p>
            <p css={[pStyle]}>emptyState: {dropzone.world.emptyState}</p>
            <p css={[pStyle]}>seed: {dropzone.seed}</p>
            <p css={[pStyle]}>width: {dropzone.width}</p>
            <p css={[pStyle]}>depthLeftBehind: {dropzone.depthLeftBehind}</p>
        </div>


    </div>;
}
