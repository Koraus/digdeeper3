import { atom } from "recoil";
import { Trek } from "../model/trek";
import { version as sightVersion } from "../model/version";
import { buildFullTransitionLookupTable, version as caVersion } from "../ca";
import { getDigits, getNumberFromDigits } from "../ca/digits";
import { caStateCount } from "../model/terms/World";
import { generateRandomDropzone } from "../model/generate";


export const trekRecoil = atom<Trek>({
    key: "trek",
    default: {
        v: sightVersion,
        dropzone: generateRandomDropzone({
            world: {
                v: sightVersion,
                ca: {
                    v: caVersion,
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