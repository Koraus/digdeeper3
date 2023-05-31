import { useRecoilState } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { historicalWorldsRecoil } from "./historicalWorldsRecoil";
import { saveTrek } from "../../copilot/saver";
import { Drop } from "../../model/terms/Drop";
import { eqDropzone } from "../../model/terms/Dropzone";
import { packTrekChain } from "../packTrekChain";

export function useSetDrop() {
    const [trek, setTrek] = useRecoilState(trekRecoil);
    const [historicalWorlds, setHistoricalWorlds] =
        useRecoilState(historicalWorldsRecoil);
    return (drop: Drop) => {
        saveTrek(packTrekChain(trek));
        setHistoricalWorlds([
            drop.zone,
            ...historicalWorlds
                .filter(p => !eqDropzone(p, drop.zone)),
        ]);
        setTrek(drop);
    };
}
