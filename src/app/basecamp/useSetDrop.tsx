import { useRecoilState, useSetRecoilState } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { historicalDropsRecoil } from "./historicalDropsRecoil";
import { Drop, eqDrop } from "../../model/terms/Drop";


export function useSetDrop() {
    const setTrek = useSetRecoilState(trekRecoil);
    const [historicalDrops, setHistoricalDrops] =
        useRecoilState(historicalDropsRecoil);
    return (drop: Drop) => {
        setHistoricalDrops([
            drop,
            ...historicalDrops
                .filter(p => !eqDrop(p, drop)),
        ]);
        setTrek(drop);
    };
}
