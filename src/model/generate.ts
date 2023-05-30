import { LehmerPrng } from "../utils/LehmerPrng";
import { version } from "./version";
import { Code } from "../ca/Code";
import { getComposition } from "../ca/calculateComposition";
import { World } from "./terms/World";
import { Dropzone } from "./terms/Dropzone";


export function generateRandomWorld({
    ca: caCode,
}: {
    ca: Code;
}) {
    const composition = getComposition(caCode);

    const [stone, grass, energy] = composition
        .map((p, i) => [p, i])
        .sort(([a], [b]) => b - a)
        .map(([_, i]) => i);

    const stateEnergyDrain = [0, 0, 0];
    stateEnergyDrain[stone] = 81 * 9;
    stateEnergyDrain[grass] = 1;
    stateEnergyDrain[energy] = 0;

    const stateEnergyGain = [0, 0, 0];
    stateEnergyGain[stone] = 0;
    stateEnergyGain[grass] = 0;
    stateEnergyGain[energy] = 81;

    return {
        v: version,
        ca: caCode,
        stateEnergyDrain,
        stateEnergyGain,
    } as World;
}

export const generateRandomDropzone = ({
    world,
}: {
    world: World,
}): Dropzone => ({
    v: version,
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
