import { atom } from "recoil";
import { localStorageAtomEffect } from "../../utils/localStorageAtomEffect";
import { sightVersion } from "../../model/terms";
import { Dropzone } from "../../model/Dropzone";

export const favoriteDropzonesRecoil = atom({
    key: "favoriteDropzones",
    default: [] as Dropzone[],
    effects: [
        localStorageAtomEffect({
            key: key => `${sightVersion}/${key}`,
        }),
    ],
});


