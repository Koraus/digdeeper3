import { useRecoilState } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { historicalWorldsRecoil } from "./historicalWorldsRecoil";
import { Dropzone } from "../../model/terms";
import { eqDropzone } from "../../model/terms";
import { saveTrek } from "../../copilot/saver";


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
