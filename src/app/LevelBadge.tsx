import { useRecoilValue } from "recoil";
import { jsx } from "@emotion/react";

export function LevelBadge({
    css: cssProp, ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const levelProgress = useRecoilValue(levelProgressRecoil);
    const isMaxLevel = levelProgress >= levelCap;
    const level = Math.floor(levelProgress);
    const progress = levelProgress % 1;
    const levelProgressText =
        isMaxLevel
            ? "MAX"
            : `${Math.floor(progress * 100)}%`;

    return <div
        css={[{
            fontSize: isMaxLevel ? "3em" : "5em",
            width: "1.1em",
            height: "1.1em",
            lineHeight: "1.03em",
            textAlign: "center",
            borderRadius: "50%",
            background: "#ffc98b",
            color: "#f98602",
            border: "0.15em solid #f98602",
        }, cssProp]}
        title={levelProgressText}
        {...props}
    >
        {level + 1}
        {level < levelCap && <div css={{
            position: "relative",
            width: "100%",
            height: "0.15em",
            margin: "0.06em 0 0 0",
            boxShadow: "0 0 0.05em 0.01em #000000",
        }}>
            <div css={{
                position: "absolute",
                inset: "0",
                background: "#f91702",
            }} />
            <div css={{
                position: "absolute",
                inset: `0 ${100 * (1 - progress)}% 0 0`,
                background: "#f98602",
            }} />
        </div>}
    </div>;
}


import { levelCap, levelProgressRecoil } from "./levelProgressRecoil";
