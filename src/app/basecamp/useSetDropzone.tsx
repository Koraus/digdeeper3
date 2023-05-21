import { useRecoilValue } from "recoil";
import { Dropzone } from "../../model/Dropzone";
import { dropEquipmentRecoil } from "./dropEquipmentRecoil";
import { useSetDrop } from "./useSetDrop";


export function useSetDropzone() {
    const setDrop = useSetDrop();
    const equipment = useRecoilValue(dropEquipmentRecoil);
    return (dropzone: Dropzone) => setDrop({
        dropzone,
        depthLeftBehind: 10,
        equipment,
    });
}
