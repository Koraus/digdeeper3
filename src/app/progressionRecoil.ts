import { atom } from "recoil";
import { Progression, caStateCount, modelId } from "../model/terms";
import { LehmerPrng } from "../utils/LehmerPrng";
import { toFullTable } from "../ca";
import { getDigits } from "../ca/digits";


export const progressionRecoil = atom<Progression>({
    key: "progression",
    default: {
        problem: {
            modelId,
            caStateCount,
            table: (() => {
                const pretable = getDigits(1815n, 3);
                return toFullTable(
                    /* stateCount: */ 3,
                    (stateCount, n1, c, n2, pc) => pretable[n1 + c + n2]);
            })(),
            seed: Math.floor(Math.random() * LehmerPrng.MAX_INT32),
            stateEnergyDrain: [81 * 9, 1, 0],
            stateEnergyGain: [0, 0, 81],
            emptyState: 1,
            spaceSize: 31,
            depthLeftBehind: 10,
        },
    },
});