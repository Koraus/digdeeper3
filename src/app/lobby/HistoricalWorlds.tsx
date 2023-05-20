import type { jsx } from "@emotion/react";
import { useRecoilValue } from "recoil";
import { DropzonePreview } from "./DropzonePreview";
import { useState } from "react";
import { Time } from "@emotion-icons/ionicons-solid/Time";
import { historicalWorldsRecoil } from "./historicalWorldsRecoil";
import { ChevronForward } from "@emotion-icons/ionicons-solid/ChevronForward";
import { useSetDrop } from "./useSetDropzone";


export function HistoricalWorlds({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const historicalWorlds = useRecoilValue(historicalWorldsRecoil);

    const [isOpen, setIsOpen] = useState(false);

    const setDrop = useSetDrop();


    return <div  {...props} css={[{ marginBottom: "1vmin" }]}>
        <h3
            onClick={() => setIsOpen(!isOpen)}
            css={[{
                margin: "0.9vmin 0",
            }]}
        >
            <ChevronForward css={[{
                transitionDuration: "100ms",
                width: "2vmin",
                marginRight: "0.4vmin",
                transform: isOpen
                    ? "rotate(90deg)" : "rotate(0deg)",
            }]} />
            <Time css={[{
                width: "2vmin",
                marginRight: "0.6vmin",
            }]} />Last Played
        </h3>
        {historicalWorlds && isOpen &&
            <div css={[{
                listStyle: "none",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
            }]}>
                {historicalWorlds.length === 0 &&
                    <div> You have no played worlds yet</div>}
                {historicalWorlds
                    .slice(0, 10)
                    .map((p, i) => <div
                        key={i}
                        css={[{
                            position: "relative",
                        }]}>
                        <DropzonePreview
                            css={[{
                                margin: "0.1vmin",
                            }]}
                            dropzone={p} />
                        <button
                            css={[{
                                position: "absolute",
                                bottom: "1vmin",
                                left: "50%",
                                transform: "translateX(-50%)",
                            }]}
                            onClick={() => setDrop({
                                dropzone: p,
                                depthLeftBehind: 10,
                                equipment: {
                                    pickNeighborhoodIndex: 0,
                                },
                            })}
                        > Play!</button>
                    </div>)}
            </div>}
    </div>;
}
