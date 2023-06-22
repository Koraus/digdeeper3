import { LayoutContext } from "./LayoutContext";
import { Color, Matrix4, Quaternion, Vector3 } from "three";


const _m4s = Array.from({ length: 3 }, () => new Matrix4());
const _v3s = Array.from({ length: 4 }, () => new Vector3());
const _qs = Array.from({ length: 3 }, () => new Quaternion());

export function Aqua(color: Color, {
    rootMatrixWorld, abuseBox,
}: LayoutContext) {

    const aqua = abuseBox();
    aqua.setColor(new Color(color));
    aqua.setMatrix(_m4s[0].compose(
        _v3s[1].set(0, -1.2, 0),
        _qs[0].identity(),
        _v3s[0].set(1, 1.6, 1),
    ).premultiply(rootMatrixWorld));

}
