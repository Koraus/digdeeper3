import { atom } from "recoil";
import { Trek, sightVersion } from "../model/terms";
import { buildFullTransitionLookupTable, version as caVersion } from "../ca";
import { getDigits, getNumberFromDigits } from "../ca/digits";
import { caStateCount } from "../model/World";
import { generateRandomDropzone } from "../model/Dropzone";


export const trekRecoil = atom<Trek>({
    key: "trek",
    default: {
        dropzone: generateRandomDropzone({
            world: {
                sightVersion,
                ca: {
                    version: caVersion,
                    stateCount: caStateCount,
                    rule: (() => {
                        const pretable = getDigits(1815n, 3);
                        const table = buildFullTransitionLookupTable(
                            /* stateCount: */ 3,
                            (_stateCount, n1, c, n2, _pc) =>
                                pretable[n1 + c + n2]);
                        return getNumberFromDigits(table, 3).toString();
                    })(),
                },
                stateEnergyDrain: [81 * 9, 1, 0],
                stateEnergyGain: [0, 0, 81],
            },
        }),
        equipment: {
            pickNeighborhoodIndex: 0,
        },
        depthLeftBehind: 10,
    },
});