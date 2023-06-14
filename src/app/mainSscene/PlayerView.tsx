import { ThreeElements, useThree } from "@react-three/fiber";
import { useRecoilValue } from "recoil";
import { playerActionRecoil, sightAt } from "../playerActionRecoil";
import { Character } from "./Character";
import { GroupSync } from "../../utils/GroupSync";
import { MathUtils } from "three";
import { easeSinInOut } from "d3-ease";
import { useEffect, useMemo } from "react";
import { Howl, HowlOptions } from "howler";
import stepSound1Url from "../sounds/244980__ani_music__wing-flap-flag-flapping-7a.mp3";
import stepSound2Url from "../sounds/389634__stubb__wing-flap-1.mp3";
import impactSound1Url from "../sounds/607667__jayroo9__pots_and_cans_33.mp3";
import { namedInstructions } from "../../model/terms/PackedTrek";
import { directionVec } from "../../model/sight";


const stepSounds: HowlOptions[] = [
    { src: [stepSound1Url] },
    { src: [stepSound2Url], volume: 0.5 },
];
const impactSounds: HowlOptions[] = [
    { src: [impactSound1Url] },
];

const randomEl = <T,>(arr: T[]) =>
    arr[Math.floor(Math.random() * arr.length)];

const rotationMap = {
    [namedInstructions.forward]: 1,
    [namedInstructions.left]: 2,
    [namedInstructions.backward]: 3,
    [namedInstructions.right]: 0,
    [namedInstructions.knightForwardLeft]: 2,
    [namedInstructions.knightForwardRight]: 0,
    [namedInstructions.knightBackwardLeft]: 2,
    [namedInstructions.knightBackwardRight]: 0,
    [namedInstructions.knightLeftForward]: 1,
    [namedInstructions.knightLeftBackward]: 3,
    [namedInstructions.knightRightForward]: 1,
    [namedInstructions.knightRightBackward]: 3,
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
    useMemo(() => {
        stepSounds.map(x => new Howl(x));
        impactSounds.map(x => new Howl(x));
    }, []);

    useEffect(() => {
        if (playerAction.action?.action !== "step") { return; }
        const howl = new Howl(randomEl(
            playerAction.ok ? stepSounds : impactSounds));
        howl.play();
        // return () => { howl.stop(); };
    }, [playerAction]);

    return <group
        {...props}
        position={[pos[1], 0, pos[0]]}
    >
        <GroupSync
            onFrame={(g, frame) => {
                if (playerAction.action?.action === "step") {
                    const dTimeSec = frame.clock.getElapsedTime() - tStart;
                    const t = MathUtils.clamp(dTimeSec * 8, 0, 1);
                    if (t < 1) { invalidate(); }

                    const [dx, dt] =
                        directionVec[playerAction.action.instruction];

                    if (playerAction.ok) {
                        const t1 = easeSinInOut(t);
                        const t2 = t1 - 1;
                        g.position.z = dx * t2;
                        g.position.x = dt * t2;
                    } else {
                        const t1 = t * (1 - t) * (1 - t) * 2;
                        g.position.z = dx * t1;
                        g.position.x = dt * t1;
                    }
                } else {
                    g.position.z = 0;
                    g.position.x = 0;
                }
            }}
        >
            <Character rotation={[0, rotation * Math.PI / 2, 0]} />
            {children}
        </GroupSync>
    </group >;
}
