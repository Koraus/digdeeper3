import memoize from "memoizee";
import { ca } from "./ca";
import { Dropzone } from "./terms/Dropzone";
import { Drop } from "./terms/Drop";


export type TrekStart = Drop;

export type MoveAction =
    "forward" // t++
    | "backward" // t--
    | "left" // x--
    | "right"; // x++

export type TrekStep = { action: MoveAction };

export type Trek = TrekStart | (TrekStep & { prev: Trek });

export const directionEnergyDrain = {
    left: 1,
    right: 1,
    backward: 9,
    forward: 0,
} as const;
export const directionVec = {
    left: [-1, 0],
    right: [1, 0],
    backward: [0, -1],
    forward: [0, 1],
} as const;

export const caForDropzone = memoize((dropzone: Dropzone) => ca({
    ca: dropzone.world.ca,
    spaceSize: dropzone.width,
    startFillState: dropzone.startFillState,
    seed: dropzone.seed,
}));