import { getComposition } from "../ca/calculateComposition";
import { LehmerPrng } from "../utils/LehmerPrng";
import { CaState, World } from "./World";


export type Dropzone = {
    world: World,
    seed: number,
    width: number,
    startFillState: CaState,
};

export const generateRandomDropzone = ({
    world,
}: {
    world: World,
}): Dropzone => ({
    world,
    seed: Math.floor(Math.random() * LehmerPrng.MAX_INT32),
    width: 51,
    startFillState: (() => {
        const composition = getComposition(world.ca);

        const [_stone, grass, _energy] = composition
            .map((p, i) => [p, i])
            .sort(([a], [b]) => b - a)
            .map(([_, i]) => i);

        return grass;
    })(),
});

export const eqStringify = <T>(a: T, b: T) =>
    JSON.stringify(a) === JSON.stringify(b);

export const eqDropzone = eqStringify<Dropzone>;