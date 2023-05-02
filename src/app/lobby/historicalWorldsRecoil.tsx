import { atom } from "recoil";
import {localStorageAtomEffect} from "../../utils/localStorageAtomEffect";
import { Dropzone, sightVersion } from "../../model/terms";


export const historicalWorldsRecoil = atom <Dropzone[]>({
    key: "historicalWorldsRecoil",
    default: [],
    effects: [
        localStorageAtomEffect({
            key: key => `${sightVersion}/${key}`,
        }),
    ],
});
