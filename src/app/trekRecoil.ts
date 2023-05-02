import { atom } from "recoil";
import { Trek, sightVersion } from "../model/terms";
import { LehmerPrng } from "../utils/LehmerPrng";
import { buildFullTransitionLookupTable, version as caVersion } from "../ca";
import { getDigits, getNumberFromDigits } from "../ca/digits";
import { caStateCount } from "../model/World";


export const trekRecoil = atom<Trek>({
    key: "trek",
    default: {
        dropzone: {
            world: {
                sightVersion,
                ca: {
                    version: caVersion,
                    stateCount: caStateCount,
                    rule: (() => {
                        const pretable = getDigits(1815n, 3);
                        const table = buildFullTransitionLookupTable(
                            /* stateCount: */ 3,
                            (stateCount, n1, c, n2, pc) =>
                                pretable[n1 + c + n2]);
                        return getNumberFromDigits(table, 3).toString();
                    })(),
                },
                stateEnergyDrain: [81 * 9, 1, 0],
                stateEnergyGain: [0, 0, 81],
                emptyState: 1,
            },
            seed: Math.floor(Math.random() * LehmerPrng.MAX_INT32),
            width: 31,
            depthLeftBehind: 10,
        },
    },
});