import { useState } from "react";
import type { jsx } from "@emotion/react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { createRandomDropzone } from "../../model/terms";
import { WorldPreview } from "./WorldPreview";
import { historicalWorldsRecoil } from "./historicalWorldsRecoil";
import { Dropzone } from "../../model/terms";


export function WorldSelectionPanel({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const setProgression = useSetRecoilState(trekRecoil);
    const [isWorldSelection, setIsWorldSelection] = useState(false);

    const [historicalWorlds, setHistoricalWorlds] =
        useRecoilState(historicalWorldsRecoil);

    const [worlds, setWorlds] = useState<Dropzone[]>();

    return <div
        css={[{
            background: "#000000b0",
            border: "1px solid #ffffffb0",
        }]}
        {...props}
    >
        <div css={[{
            transitionDuration: "0.4s",
            height: isWorldSelection ? "fit-content" : "3vmin",
            overflow: "hidden",
        }]}
        >
            <h3 css={[{
                margin: "0.9vmin 0",
            }]}
                onClick={() => setIsWorldSelection(!isWorldSelection)}
            >World Selection: <span css={[{
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

                            onClick={
                                () => {
                                    setHistoricalWorlds(
                                        [world, ...historicalWorlds],
                                    );
                                    setProgression({ dropzone: world });
                                }
                            }
                        > Play!</button >
                    </div>)}
                </div>
            }
        </div>
        <h3 css={[{
            margin: "0.9vmin 0",
        }]}>Previously played worlds:</h3>

        {historicalWorlds
            && <div css={[{
                listStyle: "none",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
            }]}>
                {historicalWorlds.map((world: Dropzone, key: number) => <div
                    key={key + "playedWorlds"} css={[{
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
                        onClick={() => setProgression({ dropzone: world })}
                    > Play!</button >
                </div>)}
            </div>
        }
    </div >;
}
