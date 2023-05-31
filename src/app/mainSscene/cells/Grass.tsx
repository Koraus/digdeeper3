import { Color, Euler, Matrix4, Quaternion, Vector3 } from "three";
import { LayoutContext } from "./LayoutContext";


const _m4s = Array.from({ length: 3 }, () => new Matrix4());
const _v3s = Array.from({ length: 3 }, () => new Vector3());
const _qs = Array.from({ length: 3 }, () => new Quaternion());
const _es = Array.from({ length: 3 }, () => new Euler());

export function Grass(color: Color, {
    rootMatrixWorld, abuseRandom, abuseBox, abuseFrame,
}: LayoutContext) {
    const grass1 = abuseBox();
    grass1.setColor(color);
    grass1.setMatrix(_m4s[0].compose(
        _v3s[0].set(0, 0.075, 0),
        _qs[0].identity(),
        _v3s[1].set(1.05, 0.15, 1.05),
    ).premultiply(rootMatrixWorld));

    const grass2 = abuseRandom() < 0.8 ? abuseBox() : undefined;
    if (grass2) { grass2.setColor(color); }
    const grass2Postion = new Vector3(
        abuseRandom() - 0.5, 0.2, abuseRandom() - 0.5);

    const grass3 = abuseRandom() < 0.8 ? abuseBox() : undefined;
    if (grass3) { grass3.setColor(color); }
    const grass3Postion = new Vector3(
        abuseRandom() - 0.5, 0.2, abuseRandom() - 0.5);

    abuseFrame(({ rootMatrixWorld, state }, { clock }) => {
        const timeSec = clock.elapsedTime;
        const { x, t } = state;
        const { sin, pow } = Math;
        const t1 = 0.5
            + 0.5 * sin(
                timeSec * 1
                + sin(timeSec)
                + sin(timeSec * 0.5)
                + 0.2 * (t + sin(x * 2) + sin(x * 0.5)));
        const t0 =
            0.8 * sin(timeSec * 0.4 + t + x * 0.5) // regular oscillation
            + 0.8 * pow(t1, 5); // wind wave

        if (grass2) {
            grass2.setMatrix(_m4s[0].compose(
                grass2Postion,
                _qs[0].setFromEuler(
                    _es[0].set(
                        -0.2 * t0,
                        0,
                        0.1 * t0,
                        "XYZ"),
                    true),
                _v3s[1].set(0.08, 0.6, 0.08),
            ).premultiply(rootMatrixWorld));
        }

        if (grass3) {
            grass3.setMatrix(_m4s[0].compose(
                grass3Postion,
                _qs[0].setFromEuler(
                    _es[0].set(
                        -0.2 * t0,
                        0,
                        0.1 * t0,
                        "XYZ"),
                    true),
                _v3s[1].set(0.08, 1, 0.08),
            ).premultiply(rootMatrixWorld));
        }
    });
}
