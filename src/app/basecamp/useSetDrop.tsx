import { useRecoilState, useSetRecoilState } from "recoil";
import { playerActionRecoil } from "../playerActionRecoil";
import { historicalDropsRecoil } from "./historicalDropsRecoil";
import { Drop, eqDrop } from "../../model/terms/Drop";
import { track } from "@amplitude/analytics-browser";


export function useSetDrop() {
    const setPlayerAction = useSetRecoilState(playerActionRecoil);
    const [historicalDrops, setHistoricalDrops] =
        useRecoilState(historicalDropsRecoil);
    return (drop: Drop) => {
        setHistoricalDrops([
            drop,
            ...historicalDrops
                .filter(p => !eqDrop(p, drop)),
        ]);
        track("drop", { drop });
        setPlayerAction({
            action: undefined,
            ok: true,
            log: undefined,
            trek: drop,
        });
    };
}
