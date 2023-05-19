import { LehmerPrng } from "../utils/LehmerPrng";
import { World, generateRandomWorld } from "./World";


export type Dropzone = {
    world: World,
    seed: number,
    width: number,
    depthLeftBehind: number,
};

export const generateRandomDropzone = (
    world: World = generateRandomWorld(),
): Dropzone => ({
    world,
    seed: Math.floor(Math.random() * LehmerPrng.MAX_INT32),
    width: 51,
    depthLeftBehind: 10,
});

export const eqStringify = <T>(a: T, b: T) =>
    JSON.stringify(a) === JSON.stringify(b);

export const eqDropzone = eqStringify<Dropzone>;