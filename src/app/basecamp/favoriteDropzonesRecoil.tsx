import { atom } from "recoil";
import { localStorageAtomEffect } from "../../utils/localStorageAtomEffect";
import { version as sightVersion } from "../../model/version";
import { Dropzone } from "../../model/terms/Dropzone";

export const favoriteDropzonesRecoil = atom({
    key: "favoriteDropzones",
    default: [] as Dropzone[],
    effects: [
        localStorageAtomEffect({
            key: key => `${sightVersion}/${key}`,
        }),
    ],
});


