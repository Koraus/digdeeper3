import { LayoutContext } from "./LayoutContext";
import { Color, Euler, Matrix4, Quaternion, Vector3 } from "three";


export const pickableColor = new Color("#b635d3");

const _m4s = Array.from({ length: 3 }, () => new Matrix4());
const _v3s = Array.from({ length: 3 }, () => new Vector3());
const _qs = Array.from({ length: 3 }, () => new Quaternion());
const _es = Array.from({ length: 3 }, () => new Euler());

export function Pickable({
    abuseBox, abuseFrame,
}: LayoutContext) {
    const pickable = abuseBox();
    pickable.setColor(pickableColor);
    abuseFrame(({ rootMatrixWorld, state }, { clock }) => {
        const { t } = state;

        const timeSec = clock.elapsedTime;

        pickable.setMatrix(_m4s[1].compose(
            _v3s[0].set(
                0,
                0.5 + 0.2 * Math.sin(timeSec + (t ?? 0)),
                0),
            _qs[0].setFromEuler(
                _es[0].set(
                    0.3 * timeSec,
                    0.2 * Math.sin(timeSec),
                    0.3 * timeSec,
                    "XYZ"),
                true),
            _v3s[1].set(0.5, 0.5, 0.5),
        ).premultiply(rootMatrixWorld));
    });
}
