import { useRecoilValue } from "recoil";
import { Dropzone } from "../../model/terms/Dropzone";
import { dropEquipmentRecoil } from "./dropEquipmentRecoil";
import { useSetDrop } from "./useSetDrop";
import { version } from "../../model/version";


export function useSetDropzone() {
    const setDrop = useSetDrop();
    const equipment = useRecoilValue(dropEquipmentRecoil);
    return (dropzone: Dropzone) => setDrop({
        v: version,
        dropzone,
        depthLeftBehind: 10,
        equipment,
    });
}
