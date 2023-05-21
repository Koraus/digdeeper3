import { sightVersion, DropEquipment } from "../../model/terms";
import { localStorageAtomEffect } from "../../utils/localStorageAtomEffect";
import { atom } from "recoil";

export const dropEquipmentRecoil = atom<DropEquipment>({
    key: "dropEquipment",
    default: {
        pickNeighborhoodIndex: 0,
    },
    effects: [
        localStorageAtomEffect({
            key: key => `${sightVersion}/${key}`,
        }),
    ],
});