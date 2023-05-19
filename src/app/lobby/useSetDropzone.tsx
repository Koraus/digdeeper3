import { useRecoilState } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { historicalWorldsRecoil } from "./historicalWorldsRecoil";
import { saveTrek } from "../../copilot/saver";
import { Dropzone, eqDropzone } from "../../model/Dropzone";


export function useSetDropzone() {
    const [trek, setTrek] = useRecoilState(trekRecoil);
    const [historicalWorlds, setHistoricalWorlds] =
        useRecoilState(historicalWorldsRecoil);
    return (dropzone: Dropzone) => {
        saveTrek(trek);
        setHistoricalWorlds([
            dropzone,
            ...historicalWorlds
                .filter(p => !eqDropzone(p, dropzone)),
        ]);
        setTrek({ dropzone });
        
    };
}
