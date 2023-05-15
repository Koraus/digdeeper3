import { Color, Matrix4, Quaternion, Vector3 } from "three";
import { LayoutContext } from "./LayoutContext";


export const brickColor = new Color("#ff8968");

const _m4s = Array.from({ length: 3 }, () => new Matrix4());
const _v3s = Array.from({ length: 3 }, () => new Vector3());
const _qs = Array.from({ length: 3 }, () => new Quaternion());

export function Bricks({
    rootMatrixWorld, abuseRandom, abuseBox,
}: LayoutContext) {
    const brick1 = abuseBox();
    brick1.setColor(brickColor);
    brick1.setMatrix(_m4s[1].compose(
        _v3s[0].set(
            0.3 * (abuseRandom() - 0.5),
            0.01,
            0.3 * (abuseRandom() - 0.5)),
        _qs[0].identity(),
        _v3s[1].set(0.6, 0.05, 0.6),
    ).premultiply(rootMatrixWorld));

    if (abuseRandom() < 0.5) {
        const brick2 = abuseBox();
        brick2.setColor(brickColor);
        brick2.setMatrix(_m4s[1].compose(
            _v3s[0].set(
                1 * (abuseRandom() - 0.5),
                0.01,
                1 * (abuseRandom() - 0.5)),
            _qs[0].identity(),
            _v3s[1].set(0.4, 0.05, 0.3),
        ).premultiply(rootMatrixWorld));
    }
    if (abuseRandom() < 0.5) {
        const brick3 = abuseBox();
        brick3.setColor(brickColor);
        brick3.setMatrix(_m4s[1].compose(
            _v3s[0].set(
                1 * (abuseRandom() - 0.5),
                0.01,
                1 * (abuseRandom() - 0.5)),
            _qs[0].identity(),
            _v3s[1].set(0.3, 0.05, 0.4),
        ).premultiply(rootMatrixWorld));
    }
}
