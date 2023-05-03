import { atom } from "recoil";
import { localStorageAtomEffect } from "../../utils/localStorageAtomEffect";
import { Dropzone, sightVersion } from "../../model/terms";

export const favoriteDropzonesRecoil = atom({
    key: "favoriteDropzones",
    default: [] as Dropzone[],
    effects: [
        localStorageAtomEffect({
            key: key => `${sightVersion}/${key}`,
        }),
    ],
});


