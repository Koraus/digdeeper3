import { atom } from "recoil";
import { TrekChain } from "../model/trekChain";
import { version as sightVersion } from "../model/version";
import { generateRandomDropzone } from "../model/generate";
import { devChoiceWorlds } from "./basecamp/DevChoiceWorlds";


export const trekRecoil = atom<TrekChain>({
    key: "trek",
    default: {
        v: sightVersion,
        zone: generateRandomDropzone({
            world: devChoiceWorlds[0],
        }),
        equipment: {
            pickNeighborhoodIndex: 0,
        },
        depthLeftBehind: 10,
    },
});