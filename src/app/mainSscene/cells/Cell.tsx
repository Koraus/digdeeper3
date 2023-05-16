import { caForDropzone } from "../../../model/terms";
import { LayoutContext } from "./LayoutContext";
import { Grass } from "./Grass";
import { Rock } from "./Rock";
import { Bricks } from "./Bricks";
import { Pickable, PickablePick } from "./Pickable";
import { Color, Matrix4, Quaternion, Vector3 } from "three";


const _m4s = Array.from({ length: 3 }, () => new Matrix4());
const _v3s = Array.from({ length: 3 }, () => new Vector3());
const _qs = Array.from({ length: 3 }, () => new Quaternion());

export const floorColors = (["#576c6e", "#d8dd76", "#ffc57a"] as const)
    .map(x => new Color(x));

export function Cell(ctx: LayoutContext) {
    const {
        rootMatrixWorld, state: { t, x, isVisited, dropzone }, abuseBox,
    } = ctx;

    const caState = caForDropzone(dropzone)._at(t, x);

    const floor = abuseBox();
    floor.setColor(floorColors[caState]);
    floor.setMatrix(_m4s[1].compose(
        _v3s[0].set(0, -1, 0),
        _qs[0].identity(),
        _v3s[1].set(1, 2, 1),
    ).premultiply(rootMatrixWorld));

    if (caState === 2 && isVisited) {
        PickablePick(ctx);
    }

    if (!isVisited) {
        if (caState === dropzone.world.emptyState) {
            Grass(ctx);
        }
        if (caState === 2) {
            Pickable(ctx);
        }
        if (caState === 0) {
            Rock(ctx);
        }
    } else {
        Bricks(ctx);
    }
}
