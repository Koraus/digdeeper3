import { useState } from "react";
import type { jsx } from "@emotion/react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { createRandomDropzone } from "../../model/terms";
import { WorldPreview } from "./WorldPreview";
import { FavoritesWorlds } from "./FavoritesWorlds";
import { historicalWorldsRecoil } from "./historicalWorldsRecoil";
import { Dropzone } from "../../model/terms";
import { HistoricalWorlds } from "./HistoricalWorlds";
import { Dice } from "@emotion-icons/fa-solid/Dice";
import { eqDropzone } from "../../model/terms";


export function WorldSelectionPanel({
    css: cssProp,
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const setProgression = useSetRecoilState(trekRecoil);

    const [isWorldSelection, setIsWorldSelection] = useState(false);
    const [historicalWorlds, setHistoricalWorlds] =
        useRecoilState(historicalWorldsRecoil);

    const [worlds, setWorlds] = useState<Dropzone[]>();

    const setWorld = (dropzone: Dropzone) => {
        setHistoricalWorlds([
            dropzone,
            ...historicalWorlds
                .filter(p => !eqDropzone(p, dropzone)),
        ]);
        setProgression({ dropzone });
    };

    return <div
        css={[{
            background: "#000000b0",
            border: "1px solid #ffffffb0",
        }, cssProp]}
        {...props}
    >
        <div css={[{
            transitionDuration: "0.4s",
            height: isWorldSelection ? "fit-content" : "3vmin",
            overflow: "hidden",
        }]} >
            <h3 css={[{
                margin: "0.9vmin 0",
            }]}
                onClick={() => setIsWorldSelection(!isWorldSelection)}
            > <Dice css={[{
                width: "2vmin",
                marginRight: "0.4vmin",
            }]} />Generate: <span css={[{
                display: "inline-block",
                rotate: isWorldSelection ? "0deg" : "180deg",
            }]} > ^ </span> </h3>
            <button
                css={[{
                    margin: "0.9vmin 0",
                }]}
                onClick={() =>
                    setWorlds(
                        Array.from(
                            { length: 20 },
                            () => createRandomDropzone()))
                }> Reroll </button>
            {worlds
                && <div css={[{
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }]}>
                    {worlds.map((world, i) => <div key={i} css={[{
                        position: "relative",
                    }]}>
                        <WorldPreview
                            css={[{
                                margin: "0.1vmin",
                            }]}
                            dropzone={world}
                        />
                        <button
                            css={[{
                                position: "absolute",
                                bottom: "1vmin",
                                left: "50%",
                                transform: "translateX(-50%)",
                            }]}
                            onClick={() => setWorld(world)}
                        > Play!</button >
                    </div>)}
                </div>
            }
        </div>
        <FavoritesWorlds />
        <HistoricalWorlds />
    </div >;
}
