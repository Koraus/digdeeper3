import { atom } from "recoil";
import {localStorageAtomEffect} from "../../utils/localStorageAtomEffect";
import { World, sightVersion } from "../../model/terms";


export const historicalWorldsRecoil = atom <World[] | [] >({
    key: "historicalWorldsRecoil",
    default: [],
    effects: [
        localStorageAtomEffect({
            key: key => `${sightVersion}/${key}`,
        }),
    ],
});
