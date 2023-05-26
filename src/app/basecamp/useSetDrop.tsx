import { useRecoilState } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { historicalWorldsRecoil } from "./historicalWorldsRecoil";
import { saveTrek } from "../../copilot/saver";
import { Drop } from "../../model/trek";
import { eqDropzone } from "../../model/Dropzone";

export function useSetDrop() {
    const [trek, setTrek] = useRecoilState(trekRecoil);
    const [historicalWorlds, setHistoricalWorlds] =
        useRecoilState(historicalWorldsRecoil);
    return (drop: Drop) => {
        saveTrek(trek);
        setHistoricalWorlds([
            drop.dropzone,
            ...historicalWorlds
                .filter(p => !eqDropzone(p, drop.dropzone)),
        ]);
        setTrek(drop);
    };
}
