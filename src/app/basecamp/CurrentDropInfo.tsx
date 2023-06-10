import { DropzonePreview } from "./DropzonePreview";
import { useRecoilValue } from "recoil";
import { startForTrek, playerActionRecoil } from "../playerActionRecoil";
import { jsx } from "@emotion/react";


export function CurrentDropInfo({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const trek = useRecoilValue(playerActionRecoil).trek;
    const drop = startForTrek(trek);

    return <DropzonePreview
        dropzone={drop.zone}
        showDetails
        additionalDetails={
            `+ depthLeftBehind: ${drop.depthLeftBehind}`
            + `\n+ equipment: ${JSON.stringify(drop.equipment)}`
        }
        {...props}
    />;
}
