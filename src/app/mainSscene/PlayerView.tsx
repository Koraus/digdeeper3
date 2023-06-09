import { ThreeElements, useThree } from "@react-three/fiber";
import { useRecoilValue } from "recoil";
import { sightAt, trekRecoil } from "../trekRecoil";
import { Character } from "./Character";
import { GroupSync } from "../../utils/GroupSync";
import { MathUtils } from "three";
import { easeSinInOut } from "d3-ease";


export function PlayerView({
    children, ...props
}: ThreeElements["group"]) {
    const trek = useRecoilValue(trekRecoil);
    const sight = sightAt(trek);
    const pos = sight.playerPosition;
    const prevPos = "prev" in trek ? sightAt(trek.prev).playerPosition : pos;
    const [dx, dt] = [pos[0] - prevPos[0], pos[1] - prevPos[1]];

    const invalidate = useThree(({ invalidate }) => invalidate);

    const rotation = (() => {
        if (dx === 0 && dt === 0) { return 0; }
        if (dx === 0) { return dt > 0 ? 1 : 3; }
        if (dt === 0) { return dx > 0 ? 0 : 2; }
        return 0;
    })();

    const clock = useThree(({ clock }) => clock);
    const tStart = clock.getElapsedTime();

    return <group
        {...props}
        position={[pos[1], 0, pos[0]]}
    >
        <GroupSync
            onFrame={(g, frame) => {
                const dTimeSec = frame.clock.getElapsedTime() - tStart;
                const t = MathUtils.clamp(dTimeSec * 8, 0, 1);
                if (t < 1) { invalidate(); }
                const t1 = easeSinInOut(t);
                const t2 = t1 - 1;
                g.position.z = dx * t2;
                g.position.x = dt * t2;
            }}
        >
            <Character rotation={[0, rotation * Math.PI / 2, 0]} />
            {children}
        </GroupSync>
    </group >;
}
