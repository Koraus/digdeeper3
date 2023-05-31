import { caForDropzone } from "../../../model/sight";
import { LayoutContext } from "./LayoutContext";
import { Grass } from "./Grass";
import { Rock } from "./Rock";
import { Bricks } from "./Bricks";
import { Pickable, PickablePick } from "./Pickable";
import { Color, Matrix4, Quaternion, Vector3 } from "three";
import { epxandedSight } from "./CellsView";


const _m4s = Array.from({ length: 3 }, () => new Matrix4());
const _v3s = Array.from({ length: 3 }, () => new Vector3());
const _qs = Array.from({ length: 3 }, () => new Quaternion());

export const floorColors = ({
    rock: new Color("#576c6e"),
    grass: new Color("#d8dd76"),
    energy: new Color("#ffc57a"),
} as const);

const colorThemes = [{
    // earth-like vegetation of mideteranian climate
    rock: {
        mainColor: new Color("#2e444f"),
        snowColor: undefined,
    },
    grass: new Color("#00ff00"),
    pickable: new Color("#b635d3"),
    floor: {
        rock: new Color("#576c6e"),
        grass: new Color("#d8dd76"),
        energy: new Color("#ffc57a"),
    },
    bricks: new Color("#fb9658"),
}, {
    // [name]
    rock: {
        mainColor: new Color("#782881"),
        snowColor: undefined,
    },
    grass: new Color("#980843"),
    pickable: new Color("#61C3EA"),
    floor: {
        rock: new Color("#2d282e"),
        grass: new Color("#6a3e4f"),
        energy: new Color("#a947b4"),
    },
    bricks: new Color("#bf4967"),
}, {
    // [name]
    rock: {
        mainColor: new Color("#0b76ab"),
        snowColor: new Color("#cae0fb"),
    },
    rockSnow: new Color("#cae0fb"),
    grass: new Color("#e66ce8"),
    pickable: new Color("#5bef20"),
    floor: {
        rock: new Color("#576c6e"),
        grass: new Color("#d8dd76"),
        energy: new Color("#ffc57a"),
    },
    bricks: new Color("#fb9658"),
}] as const;

export function Cell(ctx: LayoutContext) {

    const {
        rootMatrixWorld,
        state: { t, x, isVisited, dropzone, isCollected, trek },
        abuseBox,
    } = ctx;

    // const colors = colorThemes[Math.floor(t / 15) % colorThemes.length];
    const colors = colorThemes[
        Number(dropzone.world.ca.rule[0]) % colorThemes.length];

    const expSight = epxandedSight(trek);
    const caState = caForDropzone(dropzone)._at(t, x);

    const { visualStateMap } = expSight;
    const isGrass = caState === visualStateMap.grass;
    const isRock = caState === visualStateMap.rock;
    const isEnergy = caState === visualStateMap.energy;
    const visualKey = isGrass ? "grass" : isRock ? "rock" : "energy";

    const floor = abuseBox();
    floor.setColor(colors.floor[visualKey]);
    floor.setMatrix(_m4s[1].compose(
        _v3s[0].set(0, -1, 0),
        _qs[0].identity(),
        _v3s[1].set(1, 2, 1),
    ).premultiply(rootMatrixWorld));
    if (isEnergy) {
        if (isCollected) {
            const isJustCollected = isCollected && !ctx.prevState?.isCollected;
            if (isJustCollected) {
                PickablePick(colors.pickable, ctx);
            }
        } else {
            Pickable(colors.pickable, ctx);
        }
    }

    if (!isVisited) {
        if (isGrass) {
            Grass(colors.grass, ctx);
        }
        if (isRock) {
            Rock(colors.rock, ctx);
        }
    } else {
        Bricks(colors.bricks, ctx);
    }
}
