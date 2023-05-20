import { atom } from "recoil";
import { localStorageAtomEffect } from "../../utils/localStorageAtomEffect";
import { sightVersion } from "../../model/terms";
import { Dropzone } from "../../model/Dropzone";


export const historicalWorldsRecoil = atom({
    key: "historicalWorlds",
    default: [] as Dropzone[],
    effects: [
        localStorageAtomEffect({
            key: key => `${sightVersion}/${key}`,
        }),
    ],
});
