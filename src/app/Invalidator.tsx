import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import { useRecoilValue } from "recoil";
import { playerActionRecoil } from "./playerActionRecoil";

export function Invalidator() {
    const playerAction = useRecoilValue(playerActionRecoil);
    const invalidate = useThree(({ invalidate }) => invalidate);
    useLayoutEffect(() => { invalidate(); }, [playerAction, invalidate]);
    return null;
}
