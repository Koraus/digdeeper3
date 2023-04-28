import { atom } from "recoil";
import {localStorageAtomEffect} from "../../utils/localStorageAtomEffect";
import { Problem } from "../../model/terms"


export const historicalWorldsRecoil = atom <Problem[] | [] >({
    key: "historicalWorldsRecoil",
    default: [],
    effects: [
        localStorageAtomEffect(),
    ],
});
