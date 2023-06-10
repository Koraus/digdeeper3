import { ThreeElements, useThree } from "@react-three/fiber";
import { useRecoilValue } from "recoil";
import { playerActionRecoil, sightAt } from "../playerActionRecoil";
import { Character } from "./Character";
import { GroupSync } from "../../utils/GroupSync";
import { MathUtils } from "three";
import { easeSinInOut } from "d3-ease";
import { useEffect, useMemo } from "react";
import { Howl, HowlOptions } from "howler";
import sound1Url from "../sounds/244980__ani_music__wing-flap-flag-flapping-7a.mp3";
import sound2Url from "../sounds/389634__stubb__wing-flap-1.mp3";


const sounds: HowlOptions[] = [
    { src: [sound1Url] },
    { src: [sound2Url], volume: 0.5 },
];

const randomEl = <T,>(arr: T[]) =>
    arr[Math.floor(Math.random() * arr.length)];

const rotationMap = {
    "forward": 1,
    "left": 2,
    "backward": 3,
    "right": 0,
};

export function PlayerView({
    children, ...props
}: ThreeElements["group"]) {
    const playerAction = useRecoilValue(playerActionRecoil);
    const trek = playerAction.trek;
    const sight = sightAt(trek);
    const pos = sight.playerPosition;
    const prevPos = "prev" in trek ? sightAt(trek.prev).playerPosition : pos;
    const [dx, dt] = [pos[0] - prevPos[0], pos[1] - prevPos[1]];

    const invalidate = useThree(({ invalidate }) => invalidate);

    const rotation = (() => {
        if (playerAction.action?.action === "step") {
            return rotationMap[playerAction.action.instruction];
        }
        if (dx === 0 && dt === 0) { return 0; }
        if (dx === 0) { return dt > 0 ? 1 : 3; }
        if (dt === 0) { return dx > 0 ? 0 : 2; }
        return 0;
    })();

    const clock = useThree(({ clock }) => clock);
    const tStart = clock.getElapsedTime();

    // preload sounds
    useMemo(() => sounds.map(x => new Howl(x)), []);

    useEffect(() => {
        const howl = new Howl(randomEl(sounds));
        howl.play();
        // return () => { howl.stop(); };
    }, [trek]);

    return <group
        {...props}
        position={[pos[1], 0, pos[0]]}
    >
        <GroupSync
            onFrame={(g, frame) => {
                if (playerAction.action?.action === "step") {
                    if (playerAction.ok) {
                        const dTimeSec = frame.clock.getElapsedTime() - tStart;
                        const t = MathUtils.clamp(dTimeSec * 8, 0, 1);
                        if (t < 1) { invalidate(); }
                        const t1 = easeSinInOut(t);
                        const t2 = t1 - 1;
                        g.position.z = dx * t2;
                        g.position.x = dt * t2;
                    }
                }
            }}
        >
            <Character rotation={[0, rotation * Math.PI / 2, 0]} />
            {children}
        </GroupSync>
    </group >;
}
