import { atom } from "recoil";
import { localStorageAtomEffect } from "../../utils/reactish/localStorageAtomEffect";
import { version as sightVersion } from "../../model/version";
import { Drop } from "../../model/terms/Drop";


export const historicalDropsRecoil = atom({
    key: "historicalDrops",
    default: [] as Drop[],
    effects: [
        localStorageAtomEffect({
            key: key => `${sightVersion}/${key}`,
        }),
    ],
});
