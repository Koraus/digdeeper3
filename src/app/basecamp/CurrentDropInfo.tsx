import { DropzonePreview } from "./DropzonePreview";
import { useRecoilValue } from "recoil";
import { startForTrek, trekRecoil } from "../trekRecoil";


export function CurrentDropInfo() {
    const trek = useRecoilValue(trekRecoil);
    const drop = startForTrek(trek);

    return <DropzonePreview
        dropzone={drop.zone}
        showDetails
        additionalDetails={
            `+ depthLeftBehind: ${drop.depthLeftBehind}`
            + `\n+ equipment: ${JSON.stringify(drop.equipment)}`
        }
    />;
}
