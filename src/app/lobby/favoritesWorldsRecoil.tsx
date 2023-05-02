import { atom } from "recoil";
import { localStorageAtomEffect } from "../../utils/localStorageAtomEffect";
import { Dropzone, sightVersion } from "../../model/terms";

export const favoritesWorldsRecoil = atom({
    key: "favoritesWorlds",
    default: [] as Dropzone[],
    effects: [
        localStorageAtomEffect({
            key: key => `${sightVersion}/${key}`,
        }),
    ],
});
