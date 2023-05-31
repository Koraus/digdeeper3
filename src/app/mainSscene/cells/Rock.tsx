import { LayoutContext } from "./LayoutContext";
import { Color, Matrix4, Quaternion, Vector3 } from "three";


const _m4s = Array.from({ length: 3 }, () => new Matrix4());
const _v3s = Array.from({ length: 4 }, () => new Vector3());
const _qs = Array.from({ length: 3 }, () => new Quaternion());

export function Rock({
    mainColor,
    snowColor,
}: {
    mainColor: Color,
    snowColor?: Color,
}, {
    rootMatrixWorld, abuseRandom, abuseBox,
}: LayoutContext) {

    const hasSnow = snowColor !== undefined;

    const rock1 = abuseBox();
    rock1.setColor(mainColor);
    rock1.setMatrix(_m4s[1].compose(
        _v3s[0].set(0, 0.25, 0),
        _qs[0].identity(),
        _v3s[1].set(1, 0.5, 1),
    ).premultiply(rootMatrixWorld));

    if (abuseRandom() < 0.5) {
        const rock2 = abuseBox();
        rock2.setColor(mainColor);

        const pos = _v3s[0].set(
            0.5 * (abuseRandom() - 0.5),
            0.7 * abuseRandom(),
            0.5 * (abuseRandom() - 0.5));
        const scale = _v3s[1].set(
            0.4 + 0.5 * abuseRandom(),
            0.4 + 0.5 * abuseRandom(),
            0.4 + 0.5 * abuseRandom());

        rock2.setMatrix(_m4s[0].compose(
            pos,
            _qs[0].identity(),
            scale,
        ).premultiply(rootMatrixWorld));

        if (hasSnow) {
            const snow = abuseBox();
            const snowCut = 0.1;
            snow.setColor(snowColor);
            snow.setMatrix(_m4s[0].compose(
                _v3s[2].set(
                    pos.x,
                    pos.y + scale.y * 0.5 + 0.05,
                    pos.z),
                _qs[0].identity(),
                _v3s[3].set(
                    scale.x - snowCut,
                    0.1,
                    scale.z - snowCut),
            ).premultiply(rootMatrixWorld));
        }
    } else {
        if (hasSnow) {
            const snow = abuseBox();
            const snowСut = 0.1;
            snow.setColor(snowColor);
            snow.setMatrix(_m4s[1].compose(
                _v3s[0].set(0, (0.25 + 0.3), 0),
                _qs[0].identity(),
                _v3s[1].set(1 - snowСut, 0.1, 1 - snowСut),
            ).premultiply(rootMatrixWorld));
        }
    }

}
