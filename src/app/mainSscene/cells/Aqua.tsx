import { LayoutContext } from "./LayoutContext";
import { Color, Euler, Matrix4, Quaternion, Vector3 } from "three";


const _m4s = Array.from({ length: 3 }, () => new Matrix4());
const _v3s = Array.from({ length: 4 }, () => new Vector3());
const _qs = Array.from({ length: 3 }, () => new Quaternion());
const _es = Array.from({ length: 3 }, () => new Euler());

export function Aqua(color: Color, {
    rootMatrixWorld, abuseBox, abuseFrame,
}: LayoutContext) {

    const aqua = abuseBox();
    aqua.setColor(new Color(color));
    aqua.setMatrix(_m4s[0].compose(
        _v3s[1].set(0, -1.2, 0),
        _qs[0].setFromEuler(_es[0].set(0.1, 0.05, 0)),
        _v3s[0].set(1.1, 1.6, 1.1),
    ).premultiply(rootMatrixWorld));

    abuseFrame(({ rootMatrixWorld, state }, { clock }) => {
        const { t, x } = state;

        const timeSec = clock.elapsedTime;
        const t1 = Math.sin(timeSec + t * 0.5 + x * 0.1);
        aqua.setMatrix(_m4s[0].compose(
            _v3s[1].set(0, -1.2, 0),
            _qs[0].setFromEuler(_es[0].set(0.1 * t1, 0.05 * t1, 0)),
            _v3s[0].set(1.1, 1.6, 1.1),
        ).premultiply(rootMatrixWorld));
    });

}
