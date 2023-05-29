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

export function Cell(ctx: LayoutContext) {
    const {
        rootMatrixWorld,
        state: { t, x, isVisited, dropzone, isCollected, trek },
        abuseBox,
    } = ctx;

    const expSight = epxandedSight(trek);
    const caState = caForDropzone(dropzone)._at(t, x);

    const { visualStateMap } = expSight;
    const isGrass = caState === visualStateMap.grass;
    const isRock = caState === visualStateMap.rock;
    const isEnergy = caState === visualStateMap.energy;
    const visualKey = isGrass ? "grass" : isRock ? "rock" : "energy";

    const floor = abuseBox();
    floor.setColor(floorColors[visualKey]);
    floor.setMatrix(_m4s[1].compose(
        _v3s[0].set(0, -1, 0),
        _qs[0].identity(),
        _v3s[1].set(1, 2, 1),
    ).premultiply(rootMatrixWorld));

    if (isEnergy) {
        if (isCollected) {
            const isJustCollected = isCollected && !ctx.prevState?.isCollected;
            if (isJustCollected) {
                PickablePick(ctx);
            }
        } else {
            Pickable(ctx);
        }
    }

    if (!isVisited) {
        if (isGrass) {
            Grass(ctx);
        }
        if (isRock) {
            Rock(ctx);
        }
    } else {
        Bricks(ctx);
    }
}
