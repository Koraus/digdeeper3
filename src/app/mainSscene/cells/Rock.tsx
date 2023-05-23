import { LayoutContext } from "./LayoutContext";
import { Color, Matrix4, Quaternion, Vector3 } from "three";


export const rockColor = new Color("#2e444f");

const _m4s = Array.from({ length: 3 }, () => new Matrix4());
const _v3s = Array.from({ length: 3 }, () => new Vector3());
const _qs = Array.from({ length: 3 }, () => new Quaternion());

export function Rock({
    rootMatrixWorld, abuseRandom, abuseBox,
}: LayoutContext) {
    const rock1 = abuseBox();
    rock1.setColor(rockColor);
    rock1.setMatrix(_m4s[1].compose(
        _v3s[0].set(0, 0.25, 0),
        _qs[0].identity(),
        _v3s[1].set(1, 0.5, 1),
    ).premultiply(rootMatrixWorld));

    if (abuseRandom() < 0.5) {
        const rock2 = abuseBox();
        rock2.setColor(rockColor);
        rock2.setMatrix(_m4s[0].compose(
            _v3s[0].set(
                0.5 * (abuseRandom() - 0.5),
                0.7 * abuseRandom(),
                0.5 * (abuseRandom() - 0.5)),
            _qs[0].identity(),
            _v3s[1].set(
                0.4 + 0.5 * abuseRandom(),
                0.4 + 0.5 * abuseRandom(),
                0.4 + 0.5 * abuseRandom()),
        ).premultiply(rootMatrixWorld));
    }
}
