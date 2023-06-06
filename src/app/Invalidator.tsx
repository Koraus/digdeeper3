import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "./trekRecoil";

export function Invalidator() {
    const trek = useRecoilValue(trekRecoil);
    const invalidate = useThree(({ invalidate }) => invalidate);
    useLayoutEffect(() => { invalidate(); }, [trek, invalidate]);
    return null;
}
