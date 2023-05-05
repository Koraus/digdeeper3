import { DropzonePreview } from "./DropzonePreview";
import { trekDropzone } from "../../model/terms";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "../trekRecoil";


export function СurrentWorldInfo() {
    const progression = useRecoilValue(trekRecoil);
    const dropzone = trekDropzone(progression);

    return <div css={[{ display: "flex" }]}>
        <DropzonePreview  css={[{ 
            margin: "10px" }]} 
         dropzone={dropzone} />
        <div>
            <p>seed: {dropzone.seed}</p>
            <p>rule: {dropzone.world.ca.rule}</p>
            <p>stateCount: {dropzone.world.ca.stateCount}</p>
            <p>version: {dropzone.world.ca.version}</p>
        </div>

    </div>;
}
