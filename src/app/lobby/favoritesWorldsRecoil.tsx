import { atom } from "recoil";
import { localStorageAtomEffect } from "../../utils/localStorageAtomEffect";
import { Problem } from "../../model/terms";


export const favoritesWorldsRecoil = atom({
    key: "favoritesWorlds",
    default: [] as Problem[],
    effects: [
        localStorageAtomEffect(),
    ],
});
