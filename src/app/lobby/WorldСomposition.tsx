import { World } from "../../model/World";
import { Dropzone, caForDropzone } from "../../model/terms";


export function WorldСomposition(
    { width, seed, world, space,
    }: {
        width: number, seed: number, world: World, space: number
    }) {

    const generateDropzone = (
        world: World,
    ): Dropzone => ({
        world,
        seed: seed,
        width: width,
        depthLeftBehind: 10,
    });

    const world1 = generateDropzone(world);

    const theCa = caForDropzone(world1);


    const w = space;
    const h = world1.width;

    const state: number[][] = [[], [], []];

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (theCa._at(x, y) === 0) {
                state[0].push(theCa._at(x, y));
            }
            if (theCa._at(x, y) === 1) {
                state[1].push(theCa._at(x, y));
            }
            if (theCa._at(x, y) === 2) {
                state[2].push(theCa._at(x, y));
            }
        }
    }
    const crtState = state.sort((a, b) => a.length - b.length);

    const stateLength = state.flat().length + 1;

    const typeOfstate = {
        stone: {
            value: crtState[2][0],
            percentage: Math.round(
                crtState[2].length + 1 / stateLength * 100 * 10) / 10,
        },
        grass: {
            value: crtState[1][0],
            percentage: Math.round(
                crtState[1].length + 1 / stateLength * 100 * 10) / 10,
        },

        energy: {
            value: crtState[0][0],
            percentage: Math.round(
                crtState[0].length + 1 / stateLength * 100 * 10) / 10,
        },
    };

    return <div>
        stone: {typeOfstate.stone.percentage}%,
        grass: {typeOfstate.grass.percentage}%,
        energy: {typeOfstate.energy.percentage}%
    </div>;

}
