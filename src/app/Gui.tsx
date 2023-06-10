import { useRecoilValue } from "recoil";
import { playerActionRecoil, sightAt } from "./playerActionRecoil";
import { jsx } from "@emotion/react";
import { dropShadow5 } from "../utils/dropShadow5";
import { evacuationLineProgress } from "../model/evacuation";
import { LevelBadge } from "./LevelBadge";


export function Gui({
    css: cssProp,
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const sight = sightAt(useRecoilValue(playerActionRecoil).trek);
    const pos = sight.playerPosition;

    const theEvacuationLineProgress = evacuationLineProgress(pos[1]) % 1;
    const theEvacuationLineProgress1 =
        evacuationLineProgress(sight.maxDepth) % 1;

    return <div
        css={[{
            filter: dropShadow5("0.2em", "0.1em", "rgb(0 0 0 / 0.8)"),
        }, cssProp]}
        {...props}
    >
        <div css={{
            position: "relative",
            width: "40vmin",
            height: "0.3vmin",
            margin: "1vmin 0 1vmin 0",
        }}>
            <div css={{
                position: "absolute",
                inset: "0",
                background: "#f91702",
            }} />
            <div css={{
                position: "absolute",
                inset: `0 ${100 * (1 - theEvacuationLineProgress1)}% 0 0`,
                background: "#f98602",
            }} />
            <div css={{
                position: "absolute",
                top: "50%",
                left: `${100 * theEvacuationLineProgress}%`,
                background: "#ffc98b",
                height: "300%",
                aspectRatio: "1/1",
                borderRadius: "50%",
                border: "0.2vmin solid #f98602",
                translate: "-50% -50%",
            }}>
                <div css={{
                    background: "#000000",
                    height: "40%",
                    width: "80%",
                    position: "absolute",
                    left: "10%",
                    top: "25%",
                }} />
            </div>
        </div>

        <div css={{
            fontSize: "0.7em",
            margin: "-2.5em 0 0 40.7vmin",
        }}>{sight.playerPosition.join(",")}</div>

        <br />
        <LevelBadge />


    </div >;
}
